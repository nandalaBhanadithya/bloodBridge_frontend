# BloodBridge AI — Complete Technical Source of Truth
> Version: June 2026 Rev 3 | Hackathon: AI For Good 2.0 | Org: Blood Warriors Foundation
> All data claims are dataset-verified. All service limits are internet-verified as of June 2026.
> Do not assume, hallucinate, or add anything not written here.

---

## 1. PROBLEM STATEMENT

**Organization:** Blood Warriors Foundation — Hyderabad-based nonprofit connecting voluntary blood donors with Thalassemia patients across India.

**Scale:** 100,000+ Thalassemia patients India-wide, each requiring 500–700 blood transfusions in a lifetime. Frequency: every 14–31 days (avg 24.6 days, dataset-confirmed).

**Current pain:** Donor-patient matching, scheduling, and outreach is 100% manual. Volunteers call donors by phone, hoping they are available, off cooldown, and willing. If any link breaks — donor sick, unreachable, in cooldown — the patient misses their transfusion. No inventory tracking. No automated escalation. No community layer. The chain is fragile.

**Goal:** Build an autonomous AI system that: coordinates donor recruitment, tracks blood stock, manages outreach and escalations, nurtures a donor community, and gives patients and admins full visibility — with minimal manual intervention.

---

## 2. DATASET FACTS (7,033 rows · 31 columns · no assumptions)

### 2.1 Roles
| Role | Count | Meaning |
|---|---|---|
| Guest | 2,420 | Registered, no role assigned yet. Donation intent uncertain. |
| Emergency Donor | 2,385 | One-time urgent donors. `donor_type = One-Time Donor`. |
| Bridge Donor | 2,061 | Assigned to a specific patient. `donor_type = Regular Donor`. |
| Patient | 84 | Thalassemia patients receiving periodic transfusions. |
| Volunteer | 83 rows / 6 people | Care coordinators. Each person appears across multiple bridge rows. |

### 2.2 Bridge System
- A **bridge** = a committed patient ↔ donor relationship record.
- 80 unique `bridge_id` values. 786 rows total with `bridge_status = true`.
- Each bridge contains: 1 Patient row + multiple Bridge Donor rows + Volunteer rows.
- `last_bridge_donation_date` = `last_transfusion_date` in **100% of cases** (confirmed). One is redundant — retain `last_transfusion_date`, drop `last_bridge_donation_date` in new schema.
- `bridge_status` = `status_of_bridge` always. One is redundant — use `bridge_status`.

### 2.3 Latitude / Longitude — CONFIRMED = Blood Bank / Hospital / Facility Coordinates
**This is the most important dataset fact. Read carefully.**

- Only **132 unique coordinate pairs** exist for 7,009 rows. Home addresses would produce thousands of unique points. These are institutional locations.
- **Patients have exactly 5 unique coordinates** for 84 patients = 5 hospitals/clinics where they receive transfusions.
- **Guests have 4 unique coordinates** for 2,396 rows — 1,873 at one point, 521 at another = two mass Blood Warriors registration camps.
- **All 83 volunteer rows share exactly 1 coordinate** = Blood Warriors' primary hospital partner.
- Within most bridges, donor lat/lon matches patient lat/lon exactly = they are registered at the same blood bank.

**The 5 Patient Blood Banks (CONFIRMED HOSPITALS):**
| Coordinates | Patients | Bridge+Emergency Donors at same point |
|---|---|---|
| (17.3922792, 78.4602749) | 73 | 1,334 |
| (17.3877306, 78.4764393) | 7 | 920 |
| (17.3693644, 78.457235) | 2 | 25 |
| (17.4422778, 78.4688006) | 1 | 27 |
| (17.4086859, 78.4125044) | **1** | **0 ← CRITICAL: zero donors at this blood bank** |

The last entry is a real low-density emergency — one patient with no donors registered at their blood bank. This is what the density map and aggressive campaign are for.

**Architecture implication:** Patient's lat/lon = the blood bank where their blood is stored and where they receive transfusions. Donor's lat/lon = the blood bank or facility where they registered. Haversine distance between donor and patient coordinates = how far the donor would need to travel to reach the patient's blood bank.

### 2.4 Blood Groups
- Donor `blood_group` (16 types including rare): O+, B+, A+, AB+, O-, B-, A-, AB-, A1B+, A1+, A2+, A2-, A2B-, A2B+, Bombay Blood Group
- Patient `bridge_blood_group` (8 types): O+(32 patients), B+(30), A+(7), AB+(5), O-(2), B-(1), A-(1), AB-(1)
- **Extended antigen data (Kell, Duffy, Kidd, MNS) does not exist in the dataset. Do not implement.**

### 2.5 Key Columns
| Column | Filled | Meaning |
|---|---|---|
| `expected_next_transfusion_date` | 786 | Next patient transfusion date. Core scheduling input. |
| `frequency_in_days` | 786 non-zero | Patient's transfusion cycle. Non-zero only for bridge rows. |
| `last_transfusion_date` | 786 | Last date patient received blood (= last bridge donation date). |
| `eligibility_status` | 7,033 | `eligible` / `not eligible` (90-day whole blood cooldown). |
| `next_eligible_date` | 1,719 | Date donor's cooldown clears. 1,427 of these are already in the past. |
| `donations_till_date` | 1,719 | Lifetime donation count (1–12). 78% of donors have donated only once. |
| `calls_to_donations_ratio` | 1,719 | Outreach efficiency. 736 donors (43%) donated with zero calls (self-motivated). |
| `last_contacted_date` | 1,887 | Last outreach attempt. 5,146 users have never been called. |
| `total_calls` | 7,033 | Total contact attempts. 0 for most guests. |
| `user_donation_active_status` | 7,033 | `Active` (6,351) / `Inactive` (682). |
| `inactive_trigger_comment` | 682 | Exactly 2 values: "Not donated in last 1 year" (361) / "Very limited activity despite multiple calls" (321). |
| `quantity_required` | 786 | Units per transfusion: 1 (456), 2 (322), 3 (8). |
| `latitude`, `longitude` | 7,009 | Blood bank / hospital / facility coordinates. NOT home addresses. 132 unique pairs. |

### 2.6 Notes on Specific Columns
- `eligibility_status` for Patients = meaningless (they don't donate). Always filter `role != 'Patient'` before checking.
- `frequency_in_days = 0` for all non-bridge rows (Guests, Emergency Donors without a bridge). It means "not applicable" not "donates continuously."
- `donated_earlier` only exists (filled) for users who have donated. No `false` values — empty means never donated.
- No phone numbers in dataset. All outreach fields (total_calls, last_contacted_date) reflect historical manual contact by volunteers.

---

## 3. BLOOD BANKING SCIENCE (Medical Constraints — Hardcoded, Never Overridden)

### 3.1 Storage and Freshness (India Standards — NBTC Confirmed)
- Packed Red Blood Cells stored at **1–6°C**
- Shelf life: **35 days with CPDA** / **42 days with SAGM** solution
- **For Thalassemia Major (WHO / NCBI guidelines):** use blood **<7 days old** (freshness target). <2 weeks is the outer acceptable limit.
- Blood testing post-donation (HIV I&II, HBsAg, HCV, VDRL, Malaria): **24–48 hours minimum**
- Therefore: donor must donate **at least 2 days before transfusion date** (testing window). Optimal: **3–5 days before** (blood is fresh AND tested).

### 3.2 Donation Window (hardcoded system parameter)
```
DONATION_WINDOW_START = transfusion_date - 5  # Optimal (blood 3-5 days old when used)
DONATION_WINDOW_END   = transfusion_date - 2  # Latest safe (24-48hr testing, blood 1-2 days old)
DONATION_WINDOW_OUTER = transfusion_date - 7  # Outermost (still within 7-day freshness for Thalassemia)
```

### 3.3 Buffer Stock Model (hardcoded)
Every patient must have a safety buffer beyond their quantity_required:
```
buffer_target = quantity_required + 1          # Standard blood types
buffer_target = quantity_required + 2          # Rare: O-, Bombay Blood Group
```
The buffer exists because: donors can no-show, blood can fail testing, and units can be rejected for contamination. A patient with 0 buffer is at risk from any single point of failure.

### 3.4 Blood Compatibility Map (hardcoded Python dict — NOT configurable via dashboard)
```python
BLOOD_COMPATIBILITY = {
    "O Negative":           ["O Negative"],
    "O Positive":           ["O Negative", "O Positive"],
    "A Negative":           ["O Negative", "A Negative"],
    "A Positive":           ["O Negative", "O Positive", "A Negative", "A Positive"],
    "B Negative":           ["O Negative", "B Negative"],
    "B Positive":           ["O Negative", "O Positive", "B Negative", "B Positive"],
    "AB Negative":          ["O Negative", "A Negative", "B Negative", "AB Negative"],
    "AB Positive":          ["O Negative", "O Positive", "A Negative", "A Positive",
                             "B Negative", "B Positive", "AB Negative", "AB Positive"],
    # Rare subtypes: treated as base ABO+Rh for compatibility
    "A1 Positive":          ["O Negative", "O Positive", "A Negative", "A Positive", "A1 Positive"],
    "A2 Positive":          ["O Negative", "O Positive", "A Negative", "A Positive", "A2 Positive"],
    "A1B Positive":         ["O Negative", "O Positive", "A Negative", "A Positive",
                             "B Negative", "B Positive", "AB Negative", "AB Positive", "A1B Positive"],
    "A2B Negative":         ["O Negative", "A Negative", "B Negative", "AB Negative", "A2B Negative"],
    "A2B Positive":         ["O Negative", "O Positive", "A Negative", "A Positive",
                             "B Negative", "B Positive", "AB Negative", "AB Positive", "A2B Positive"],
    # CRITICAL: Bombay Blood Group has zero fallback. Only Bombay can donate to Bombay.
    "Bombay Blood Group":   ["Bombay Blood Group"],
}
```
Always query using `BLOOD_COMPATIBILITY[patient_blood_group]` — never exact string match.

---

## 4. SYSTEM ARCHITECTURE

### 4.1 What We Are NOT Building
- Extended antigen matching (Kell/Duffy/Kidd/MNS) — not in dataset
- LSTM demand forecasting — insufficient time-series depth (786 bridges, one year of data)
- Gale-Shapley matching — overkill for 84 patients
- Any clinical decision via LLM — all clinical logic is deterministic Python
- Home-address proximity matching — lat/lon is blood bank, not home

### 4.2 Three Platforms
| Platform | Users | Tech | Host |
|---|---|---|---|
| WhatsApp Bot | All users — primary channel | Python, Twilio, Bhashini, Groq | AWS Lambda |
| Unified Admin/Volunteer Dashboard | 6 volunteers + Blood Warriors staff | React + Vite | Cloudflare Pages (`bloodbridge-admin`) |
| Donor/Patient PWA | Self-service donors and patients | React + Vite | Cloudflare Pages (`bloodbridge-portal`) |

Dashboard is ONE React app with role-based section rendering via Supabase Auth. Admins see everything. Volunteers see only their assigned bridges. Staff see operational + reports. Not two separate apps.

### 4.3 Blood Bank Density Map (Central Intelligence)
The density map is computed daily and drives ALL campaign, stock, and timing decisions.

**Inputs:** The 132 unique lat/lon points from the dataset (materialized as `blood_banks` table).

**For each blood bank:**
```
eligible_compatible_donors = count users WHERE
  role IN ('Bridge Donor', 'Emergency Donor', 'Guest') AND
  blood_group IN BLOOD_COMPATIBILITY[patient_blood_group] AND
  eligibility_status = 'eligible' AND
  haversine(user.lat, user.lon, blood_bank.lat, blood_bank.lon) <= 15km AND
  user_donation_active_status = 'Active'

density_ratio = eligible_compatible_donors / (patients_at_bank × avg_quantity_required)
```

**Density zones:**
| Ratio | Zone | Action |
|---|---|---|
| < 2 | CRITICAL | Immediate volunteer alert. Broadcast campaign. Buffer +3. |
| 2–5 | LOW | Aggressive guest conversion. Outreach at T-7. Buffer +2. Wider search radius (25km). |
| 5–15 | MEDIUM | Standard campaign. Outreach at T-5. Buffer +1. Radius 15km. |
| > 15 | GOOD | Monitor only. Standard parameters. |

**Drives:**
- `is_low_density` flag on each bridge (set daily by density Lambda)
- Buffer stock target per patient
- Outreach start timing (T-7 vs T-5)
- Guest conversion campaign intensity in each area
- Final check timing (T-3hr vs T-12hr)
- Search radius in escalation cascade

**Critical real example from dataset:** Blood bank at (17.4086859, 78.4125044) has 1 patient and ZERO compatible donors registered. This is density_ratio = 0 → CRITICAL. System must immediately start a campaign to convert guests and emergency donors within 15km to become committed donors for this patient.

### 4.4 Blood Stock Management Engine
This is the most critical engine. It runs before any outreach.

**Daily inventory check (runs at 00:00 IST):**
```python
for each bridge:
    transfusion_date = expected_next_transfusion_date
    buffer_target = compute_buffer_target(bridge_blood_group, quantity_required)
    
    # Count FRESH units (donated within freshness window, not yet used or expired)
    fresh_units = blood_inventory WHERE
        bridge_id = this AND
        status = 'stored' AND
        donated_at >= transfusion_date - 7 days AND  # freshness: <7 days old
        max_expires_at >= transfusion_date             # won't expire before use
    
    gap = buffer_target - len(fresh_units)
    
    if gap <= 0:
        update transfusion_schedule.status = 'blood_sufficient'
        # No outreach needed. Patient is covered.
        
    elif gap > 0 AND days_until_transfusion <= outreach_trigger_days:
        # Trigger donation appointment outreach
        open_outreach_cascade(bridge, gap, transfusion_date)
```

**Inventory states:**
- `blood_sufficient`: units_stored >= buffer_target AND all within freshness window
- `low_stock`: units_stored == quantity_required (no buffer)
- `critical_shortage`: units_stored < quantity_required
- `freshness_at_risk`: enough units stored but some may exceed 7-day freshness by transfusion day

**Stock is updated by blood bank staff** via admin dashboard portal when a donor physically donates. Staff logs: donor_id, units donated, date. System adds to blood_inventory.

### 4.5 Dynamic Outreach Cascade (Blood Donation Appointment System)

**What changes from old wrong model:**
- OLD (WRONG): Contact donor → donor says YES → transfusion confirmed.
- NEW (CORRECT): Check inventory → if gap > 0 → contact donor → donor books APPOINTMENT at blood bank → donor physically donates → staff logs inventory → inventory covered → patient confirmed.

**"Confirmed" means blood is physically in the blood bank, not just a promise.**

**Trigger timing by zone:**
- Normal zone: outreach starts T-5 days (5 days before transfusion)
- Low-density zone: outreach starts T-7 days
- Critical shortage (0 units, <3 days): immediate outreach regardless of zone

**Outreach message to donor:**
```
"Patient at [Hospital Name] needs [bridge_blood_group] blood for transfusion on [date].
Can you come donate between [donation_window_start] and [donation_window_end]?
Reply YES / NO / DIFFERENT TIME"
```
This is an appointment request at the blood bank — not a vague "will you donate."

**When donor says YES:**
- System creates `donation_appointments` record with specific date + time slot
- Donor receives: "Please come to [Hospital Name/Blood Bank] on [date] between [time range]. Ask for the Blood Warriors desk."
- Blood bank staff are notified (admin dashboard shows upcoming donor appointments)

**Escalation tiers (all use BLOOD_COMPATIBILITY, not exact match):**
```
Tier 1: Bridge donors of THIS bridge — already at same blood bank (distance = 0)
         Sort by: calls_to_donations_ratio ASC (most reliable first)

Tier 2: Bridge donors of OTHER bridges — compatible blood group,
         haversine(donor.lat/lon, patient.lat/lon) <= 15km, eligible, Active

Tier 3: Emergency Donors — compatible blood group,
         haversine <= 15km, eligible, Active
         (Low-density zone: haversine <= 25km)

Tier 4: Guests with KNOWN compatible blood group — haversine <= 15km
         Different message tone: explain urgency, make it personal
         (Low-density zone: haversine <= 25km)

Tier 5: Guests with UNKNOWN blood group — haversine <= 10km
         Message: "Do you know your blood group? A patient nearby urgently needs help."
         If they respond with compatible group → escalate to Tier 4 flow

Tier 6: Volunteer alert (WhatsApp + dashboard notification) → manual intervention
         Low-density zone: Tier 6 triggers at T-4 days, not just when all else fails
```

**Hard deadline:**
- Normal zone: T-12 hours → final inventory check
- Low-density zone: T-3 hours → final inventory check (earlier because getting blood last-minute is harder)
- If gap still > 0 at deadline: broadcast to ALL compatible donors in city (25km), alert ALL 6 volunteers

**Over-confirmation rule:** If more appointments booked than gap requires, acknowledge extras: "Thank you! We have enough donors for this cycle. We'll call you first for the next one." Never let a donor feel wasted.

**No-show tracking:** Each no-show logged in `donation_appointments.status = 'no_show'`. After 3 no-shows: donor moves to bottom of escalation order for this bridge. After 5: volunteer review flagged.

### 4.6 Transfusion Schedule Calculator
```python
from datetime import timedelta
next_transfusion = last_transfusion_date + timedelta(days=frequency_in_days)
```
Python `timedelta` handles leap years, 30/31-day months — never do manual date arithmetic.

**Frequency change workflow (admin-gated):**
1. Coordinator uploads doctor's report (PDF → Supabase Storage, private bucket)
2. Groq 70B reads PDF, extracts numeric frequency recommendation
3. If Groq cannot find a numeric value → reject change, return error
4. Coordinator reviews extracted value → submits for approval
5. Advisor approves → frequency_in_days updated in DB + all future schedule dates recomputed
6. Immutable audit log: who changed, when, from what to what, which report
7. Patient notified via WhatsApp: "Your schedule has been updated."
8. Hard minimum: frequency_in_days >= 14. System hard-blocks values below this.

### 4.7 Donor Availability Scorer
Scoring formula (helper for ranking, not final verdict):
```python
score = (eligibility_on_transfusion_date * 0.4)
      + (1 / max(calls_to_donations_ratio, 0.01) * 0.3)
      + (min(donations_till_date, 5) / 5 * 0.2)
      - (haversine(donor_lat, donor_lon, patient_lat, patient_lon) / max_radius * 0.1)
```

Haversine (pure Python, zero cost):
```python
from math import radians, sin, cos, sqrt, atan2
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat, dlon = radians(lat2-lat1), radians(lon2-lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))
```

### 4.8 Churn Detection + Re-engagement
**Runs weekly (Monday 09:00 IST):**

At-risk donors (Active but lapsing):
- `user_donation_active_status = Active` AND `next_eligible_date` passed >30 days ago AND `last_contacted_date` >60 days ago
- Action: soft WhatsApp ping ("We miss you. Patients still need [blood_group].")

Inactive Type 1 — "Not donated in 1 year":
- Gentle message, share anonymized patient impact story
- Wait 30 days between each contact attempt

Inactive Type 2 — "Limited activity despite calls":
- Wait 30 days after last call
- Single WhatsApp (not call). Shorter message, lower ask.
- 3 WhatsApp no-responses → `user_donation_active_status = 'Dormant'`, stop outreach

Proactive re-engagement: When a low-density zone is detected, churn engine increases re-engagement priority for lapsed donors in that area, reducing the 60-day wait to 30 days.

### 4.9 Guest Conversion Pipeline
```
Bucket A: Has blood_group + donated_earlier = true
  → Direct outreach: "Patient near you needs [blood_group]. Donate once — 30 min."

Bucket B: Has blood_group + never donated
  → Softer: "You registered as [blood_group]. Everything is guided. Takes 30 min."

Bucket C: No blood_group + donated_earlier = true
  → "Can you tell us your blood group? (Check your donor card or ask the hospital)"
  → If IDK: "Your hospital where you donated before can tell us."
  → Volunteer follow-up task created

Bucket D: No blood_group + never donated
  Day 1: "Welcome! Interested to help?" YES/LATER/STOP
  Day 3: "Great! What's your blood group?"
  If UNKNOWN: "Find out free at any blood bank — 5 minutes."
```

**Low-density zone campaign mode (triggered by density map):**
When guest lives within 15km of a low-density blood bank:
- Campaign frequency doubles (weekly instead of every 2 weeks)
- Message becomes specific: "There are [X] patients at [Hospital] who desperately need [blood_group] donors."
- After 3 messages with no response: try different channel (call if phone available, else stop)

**Personality matching (Groq-driven):**
After 2+ WhatsApp interactions, Groq adapts: if they write in Telugu, reply in Telugu. If casual, be casual. If formal, be formal. Passed as system prompt parameter.

**Conversion path:** Guest → Emergency Donor (first donation) → Bridge Donor (assigned to patient, recurring) → Integration event triggered on bridge assignment.

### 4.10 Patient-Donor Cluster System

A **cluster** is the named community group built around each patient and all their assigned donors.

**Cluster creation:**
- Every bridge automatically gets a cluster (1:1 initially)
- Cluster name: "Team [Patient Alias]" — alias assigned by Blood Warriors (protects patient privacy)
- Members: patient + all bridge donors + their assigned volunteer(s)

**When a new donor is assigned to a bridge (mandatory integration protocol):**
```
1. Admin assigns donor in dashboard
2. System creates cluster_membership record
3. Triggers integration_event:
   a. New donor → WhatsApp welcome: "You've joined Team [Alias]! You're now part of a dedicated
      group supporting [anonymized patient info]. Our volunteer [name] will reach out soon."
   b. Patient → WhatsApp notification: "A new champion has joined your team!"
   c. Volunteer for this bridge → dashboard notification + WhatsApp: "Please arrange an
      introduction meeting for the new donor within 30 days."
   d. integration_events record created with status='pending', due_date = now + 30 days
4. Dashboard shows pending integration events in a dedicated queue
5. Reminders: 15 days if still pending, escalation to admin at 25 days
6. Volunteer marks event 'completed' after meeting happens
```
**This is a mandatory protocol, not optional.** The system tracks completion rate for volunteers.

### 4.11 Milestone + Community Events Engine

**Donation milestones (tracked per bridge donor):**
| Donation # | Milestone | WhatsApp Message |
|---|---|---|
| 1st | First Champion | "You just saved a life for the first time. [Patient alias] thanks you." |
| 3rd | Consistent Hero | "3 times! You're becoming a regular lifeline for [Patient alias]." |
| 5th | Year Protector | "You've protected [Patient alias] for a year! 🌟 [Integration event invite]" |
| 10th | Blood Warrior | "10 donations. You're officially a Blood Warrior. Special recognition awaits." |
| 25th | Legend | "25 donations. You're a legend. [Special ceremony invite]" |

**Fun activities / bond events:** ← PLACEHOLDER
- Content and event types to be defined in next prompt
- System infrastructure: `activities` table + `activity_rsvps` table + WhatsApp RSVP flow
- RSVP: YES → confirmation + reminder T-1 day. NO → warm acknowledgement.
- Activities are organized per cluster (patient + their donors together)
- Organized by Blood Warriors volunteers/staff

**Meeting requests (Donor ↔ Patient):**
Either party can request a meeting via WhatsApp bot:
- "I'd like to meet the person I'm donating for / donating to me"
- Bot collects reason (voice note or text)
- Request goes to meeting_requests table → admin dashboard queue
- Volunteer reviews, plans logistics, coordinates supervised meeting
- Both parties notified of outcome (approved/declined/scheduled)
- All meetings supervised by Blood Warriors staff

### 4.12 Medical Condition Hold
Donors can self-report a temporary medical condition that extends their unavailability:
- Via WhatsApp: "I'm unwell until [date]" or in donor portal
- System creates `donor_medical_holds` record: reason + estimated_recovery_date
- `next_eligible_date` updated to max(current, estimated_recovery_date)
- Donor removed from all outreach queues until hold lifts
- Single confirmation: "Got it. We won't contact you until [date]. Feel better soon!"
- On recovery date: single WhatsApp ping "Welcome back! Ready to save lives again?"

**Recurring holds:** If a donor reports the same condition 2+ times, system tracks as recurring pattern and pre-blocks the same period next year (seasonal illness).

**Seasonal illness effect on future cooldown:** If the hold pushes the donor's donation timing into their next cycle window (e.g., they were due to donate in week 3 but hold lasts until week 5), system automatically recalculates their next_eligible_date for the affected bridge cycle.

### 4.13 Soft Disbanding
For donors who can no longer donate:
- Triggered by: donor self-reports, or >5 no-shows + medical hold pattern
- **Temporary disbanding** (surgery, pregnancy, treatment): reinstate after recovery date. Status → 'On Hold'.
- **Permanent disbanding** (chronic condition, personal decision): status → 'Disbanded'.
  - WhatsApp: "We understand. Thank you for everything you've done. Could you share our cause with someone you trust?"
  - Offer to refer friends/family
  - Never contacted for donation again
- **HIV/AIDS / blood-transmitted infection:** self-disbanding, immediate, irreversible. Blood bank medically notified. Privacy maintained — no specific condition stored in logs, only "permanent medical disbanding."
- `disbanding_log` records: donor_id (hashed), disbanding_type, date, reason (generic), disbanding_initiated_by

### 4.14 Failure Self-Improvement Log
Every cascade failure (reached Tier 5+) logs: bridge_id, days notice given, tiers exhausted, response rates per tier, final outcome.

Weekly Lambda job sends 7-day failure log to Groq 70B:
- Groq output → admin dashboard report: "Bridge X failed 3x — consider adding 2 more O+ donors within 10km."
- This is LLM reading logs and surfacing patterns — NOT ML training.

---

## 5. TECH STACK (June 2026, Cross-Verified)

### 5.1 Database — Supabase Free Tier
**Free tier (verified June 2026):** 500MB PostgreSQL, 1GB file storage, 50,000 MAU, 5GB bandwidth, unlimited API requests, 2 projects max.

**CRITICAL:** Projects pause after 7 days inactivity.
**Fix — GitHub Actions heartbeat (mandatory day-1 setup):**
```yaml
name: Supabase Heartbeat
on:
  schedule:
    - cron: '0 8 */3 * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X GET "${{ secrets.SUPABASE_URL }}/rest/v1/users?select=user_id&limit=1" \
               -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
               -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

**Setup:**
1. supabase.com → New project → Note `Project URL`, `anon key`, `service_role key`
2. `service_role key` → backend only (SSM SecureString). Never in frontend.
3. `anon key` → frontend only. Always with RLS policies.
4. Enable RLS on every table. Default deny.

**FastAPI connection:**
```python
from supabase import create_client
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
# Never skip .execute() — query won't run without it
```

**Errors to avoid:**
- `pip install supabase` not `supabase-client`
- Never `anon key` in Lambda
- Never skip `.execute()`
- Never skip RLS

### 5.2 Cache — Upstash Redis Free Tier
**Free tier (verified 2025 update):** 500,000 commands/month, 256MB.
**Use for:** WhatsApp session state, donor eligibility cache (TTL 6hrs), outreach dedup flags.

**Must use `upstash-redis` not `redis-py`** — Lambda has no persistent TCP. `upstash-redis` uses HTTP.
```python
from upstash_redis import Redis
redis = Redis(url=os.environ["UPSTASH_REDIS_REST_URL"], token=os.environ["UPSTASH_REDIS_REST_TOKEN"])
redis.set("session:+91XXXXXXXXXX", json.dumps(state), ex=86400)
```

**Setup:** upstash.com → Redis → region: ap-south-1 → copy REST URL + token

### 5.3 LLM — Groq Free Tier
**Free tier (verified April 2026):**
- `llama-3.1-8b-instant`: 14,400 RPD, 30 RPM, 6,000 TPM
- `llama-3.3-70b-versatile`: 1,000 RPD, 30 RPM, 6,000 TPM
- Rate limits track separately per model.

**Use 8B for:** WhatsApp intent classification, outreach message generation (bulk), personality adaptation
**Use 70B for:** Doctor PDF report extraction, failure pattern analysis, complex guest conversations

**Setup:** console.groq.com → API Keys → create → set `GROQ_API_KEY`

**Connection:**
```python
from groq import Groq
client = Groq(api_key=os.environ["GROQ_API_KEY"])
def call_llm(system: str, user: str, model="llama-3.1-8b-instant") -> str:
    r = client.chat.completions.create(model=model,
        messages=[{"role":"system","content":system},{"role":"user","content":user}],
        max_tokens=500, temperature=0.3)
    return r.choices[0].message.content
```

**Errors to avoid:**
- 70B for every message → hits 1,000/day limit
- No backoff on 429 → use `time.sleep(2**retry)` up to 3 retries
- TPM is 6,000 total (input+output) — keep system prompts short
- temp 0.3 for extraction, 0.7 for natural conversation

**LLM is NEVER used for:** blood type matching, date math, eligibility checks, distance calculation, scoring formula, any patient safety decision.

### 5.4 Backend — FastAPI + Mangum on AWS Lambda
**Free tier:** 1M Lambda invocations/month + 400K GB-seconds. API Gateway HTTP API: 300M/month free (12mo).

**Cold start:** 200–800ms for FastAPI+Mangum. Acceptable for this use case.

**Project structure:**
```
bloodbridge/
├── main.py
├── requirements.txt
├── template.yaml
├── routes/
│   ├── whatsapp.py        # POST /webhook/whatsapp
│   ├── donors.py          # Donor CRUD
│   ├── patients.py        # Patient CRUD
│   ├── bridges.py         # Bridge management
│   ├── admin.py           # Admin operations
│   ├── inventory.py       # Blood stock management
│   ├── clusters.py        # Patient-donor community clusters
│   └── activities.py      # Milestone + bond activities
├── engines/
│   ├── scheduler.py       # Transfusion schedule calculator
│   ├── density.py         # Blood bank density analyser
│   ├── scorer.py          # Donor scoring + compatibility
│   ├── inventory_mgr.py   # Blood stock engine
│   ├── cascade.py         # Dynamic outreach cascade
│   ├── churn.py           # Churn detection + re-engagement
│   ├── conversion.py      # Guest conversion pipeline
│   ├── clustering.py      # Cluster management + integration events
│   └── events.py          # Milestone + community events
└── services/
    ├── groq_client.py
    ├── supabase_client.py
    ├── redis_client.py
    ├── twilio_client.py
    └── bhashini_client.py
```

**main.py:**
```python
from fastapi import FastAPI
from mangum import Mangum
from routes import whatsapp, donors, patients, bridges, admin, inventory, clusters, activities

app = FastAPI(title="BloodBridge AI API")
app.include_router(whatsapp.router, prefix="/webhook")
app.include_router(donors.router, prefix="/api/donors")
app.include_router(patients.router, prefix="/api/patients")
app.include_router(bridges.router, prefix="/api/bridges")
app.include_router(admin.router, prefix="/api/admin")
app.include_router(inventory.router, prefix="/api/inventory")
app.include_router(clusters.router, prefix="/api/clusters")
app.include_router(activities.router, prefix="/api/activities")

handler = Mangum(app, lifespan="off")  # lifespan="off" is REQUIRED
```

**requirements.txt:**
```
fastapi==0.115.0
mangum==0.17.0
supabase==2.7.4
upstash-redis==1.1.0
groq==0.11.0
twilio==9.3.0
httpx==0.27.0
python-multipart==0.0.9
pydantic==2.8.0
```

**Errors to avoid:**
- APScheduler inside Lambda = WRONG. Lambda is stateless. Use EventBridge.
- `lifespan="off"` is mandatory in Mangum — omit it and Lambda throws lifecycle errors
- Lambda Timeout must be ≥30s for LLM calls (Groq 70B can take 5–10s)
- Secrets in SSM Parameter Store as SecureString — never hardcoded

### 5.5 Scheduled Jobs — AWS EventBridge + Lambda

**5 separate Lambda functions (one per job):**

| Lambda | EventBridge Cron (UTC) | IST | What it does |
|---|---|---|---|
| `bb-daily-main` | `cron(30 18 * * ? *)` | 00:00 | Inventory check + cascade trigger + density map |
| `bb-daily-density` | `cron(30 20 * * ? *)` | 02:00 | Recompute density ratios for all blood banks |
| `bb-weekly-churn` | `cron(30 3 ? * MON *)` | 09:00 Mon | Churn detection + re-engagement messages |
| `bb-weekly-report` | `cron(30 14 ? * SUN *)` | 20:00 Sun | Failure log → Groq analysis → admin report |
| `bb-daily-integr` | `cron(30 4 * * ? *)` | 10:00 | Integration event reminder check |

**SQS queue (`bb-outreach-queue`):**
- Type: Standard (order not critical)
- Visibility timeout: 300s (time for Groq + Twilio)
- Lambda consumer: 1 message at a time, sends WhatsApp, logs result

### 5.6 WhatsApp — Twilio Sandbox (Demo) → Meta Cloud API (Production)

**Sandbox limitations (confirmed Twilio docs June 2026):**
1. Users must send `join <keyword>` to sandbox number before receiving anything
2. Sessions expire every 3 days — users must re-join
3. Outbound business-initiated messages: only pre-approved templates
4. Within 24hr customer window (after user messages): free-form replies OK
5. Sandbox shared across all Twilio developers

**Demo strategy:** Have judges/demo users join sandbox first. Register 3-5 test donors with real phone numbers via the admin portal. All demo WhatsApp interactions happen with these real test accounts. Historical dataset users show as "queued" in admin dashboard (what message would have been sent).

**Webhook setup:**
1. Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Set webhook URL: `https://your-api.execute-api.ap-south-1.amazonaws.com/webhook/whatsapp`
3. Method: POST

**Receiving messages:**
```python
@router.post("/whatsapp")
async def whatsapp_webhook(request: Request, From: str = Form(...), Body: str = Form(...)):
    validator = RequestValidator(os.environ["TWILIO_AUTH_TOKEN"])
    if not validator.validate(str(request.url), dict(await request.form()),
                              request.headers.get("X-Twilio-Signature","")):
        return {"error": "Invalid signature"}, 403
    phone = From.replace("whatsapp:", "")
    # Pass to intent classifier
```

**Errors to avoid:**
- Always validate Twilio signature — spoofed webhooks are real
- Prefix all numbers with `whatsapp:` in from_ and to
- Free-form outside 24hr window fails with error 63016 — use templates
- Sandbox number: `+14155238886` (include the +)

### 5.7 Translation — Bhashini API (Free, Government of India)
**Registration:** `https://bhashini.gov.in/ulca/user/register`
**Login:** `https://bhashini.gov.in/ulca/user/login`
**3 credentials needed:** `userId`, `ulcaApiKey`, `InferenceApiKey`

**Supported (relevant):** Hindi, Telugu, Tamil, Kannada, Marathi, Malayalam, Gujarati, Bengali, Punjabi, Odia, Assamese, Urdu (ISO 639-1 codes)

**Two-step call pattern (mandatory — cannot skip step 1):**
```python
# Step 1: Get pipeline config (cache result in Redis, TTL 24h to save calls)
pipeline_config_url = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
config_payload = {"pipelineTasks": [{"taskType": "translation",
    "config": {"language": {"sourceLanguage": src, "targetLanguage": tgt}}}],
    "pipelineRequestConfig": {"pipelineId": "64392f96daac500b55c543cd"}}

# Step 2: Run inference using service_id from step 1 response
# Parse: config["pipelineResponseConfig"][0]["config"][0]["serviceId"]
# Response parse: result["pipelineResponse"][0]["output"][0]["target"]
```

**Errors to avoid:**
- `pipelineId` = `"64392f96daac500b55c543cd"` — exact, do not change
- Language codes are ISO 639-1 two-letter codes
- Cache the service_id per language pair in Redis (TTL 24hr) — avoids repeated config calls

### 5.8 Frontend — Cloudflare Pages (Free)
**Why not Vercel:** Vercel Hobby plan prohibits commercial use (confirmed June 2026). Cloudflare Pages: unlimited bandwidth, unlimited requests, 500 builds/month, no commercial restriction.

**Two projects:**
1. `bloodbridge-admin` — Unified Admin/Volunteer Dashboard
2. `bloodbridge-portal` — Donor/Patient PWA

**Setup:**
1. cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
2. Build command: `npm run build` | Output: `dist` (Vite)
3. Environment vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon only, never service_role)
4. Create `public/_redirects` with `/* /index.html 200` for SPA routing

**Errors to avoid:**
- Never `SUPABASE_SERVICE_KEY` in frontend env vars
- `VITE_` prefix required for Vite to expose to browser
- Missing `_redirects` = 404 on page refresh

### 5.9 CI/CD — GitHub Actions
**Backend deploy:**
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - run: pip install aws-sam-cli && sam build && sam deploy --no-confirm-changeset
```
**Frontend:** Auto-deploy on git push via Cloudflare Pages git integration — no workflow needed.

### 5.10 Email — Resend (Free)
100 emails/day free. For admin digest emails, volunteer alerts, system reports.
SDK: `pip install resend` | `import resend; resend.api_key = os.environ["RESEND_API_KEY"]`

---

## 6. DATABASE SCHEMA (Supabase PostgreSQL)

```sql
-- BLOOD BANKS (materialized from 132 unique lat/lon pairs in dataset)
-- populated from CSV import. Names filled by Blood Warriors staff later.
CREATE TABLE blood_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  name TEXT,                                -- filled by staff (nullable initially)
  address TEXT,
  phone TEXT,
  operating_hours JSONB,                    -- {"Mon":"8AM-8PM", ...}
  same_day_processing BOOLEAN DEFAULT TRUE, -- can process blood same day?
  processing_hours INTEGER DEFAULT 6,       -- hrs from donation to ready for transfusion
  is_primary_hospital BOOLEAN DEFAULT FALSE,-- main thalassemia care hospital?
  density_ratio DECIMAL(5,2),               -- recomputed daily by density Lambda
  density_zone TEXT DEFAULT 'MEDIUM' CHECK (density_zone IN ('CRITICAL','LOW','MEDIUM','GOOD')),
  UNIQUE(latitude, longitude)
);

-- USERS (all roles: Guest, Emergency Donor, Bridge Donor, Patient, Volunteer)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash TEXT UNIQUE NOT NULL,          -- hashed from original dataset
  phone TEXT UNIQUE,                           -- WhatsApp number with country code (blank from CSV)
  role TEXT NOT NULL CHECK (role IN ('Guest','Emergency Donor','Bridge Donor','Patient','Volunteer')),
  donor_type TEXT CHECK (donor_type IN ('One-Time Donor','Regular Donor','Other')),
  blood_group TEXT,
  gender TEXT,
  blood_bank_id UUID REFERENCES blood_banks(id), -- FK to blood_banks (derived from lat/lon)
  latitude DECIMAL(10,7),                     -- blood bank / facility coordinate (NOT home address)
  longitude DECIMAL(10,7),                    -- blood bank / facility coordinate (NOT home address)
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  eligibility_status TEXT DEFAULT 'eligible' CHECK (eligibility_status IN ('eligible','not eligible')),
  next_eligible_date DATE,
  last_donation_date DATE,
  donations_till_date INTEGER DEFAULT 0,
  total_calls INTEGER DEFAULT 0,
  last_contacted_date DATE,
  calls_to_donations_ratio DECIMAL(5,2),
  user_donation_active_status TEXT DEFAULT 'Active'
    CHECK (user_donation_active_status IN ('Active','Inactive','Dormant','On Hold','Disbanded')),
  inactive_trigger_comment TEXT,
  donated_earlier BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'en',       -- ISO 639-1
  personality_profile JSONB,                  -- {tone:'casual', language:'te', response_speed:'fast'}
  opted_out BOOLEAN DEFAULT FALSE,            -- WhatsApp STOP compliance (DPDP Act 2023)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DONOR CLUSTERS (patient + their donor community group)
CREATE TABLE donor_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id UUID UNIQUE REFERENCES bridges(id),
  patient_id UUID REFERENCES users(id),
  cluster_name TEXT NOT NULL,               -- "Team Ramu" — alias protects patient privacy
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLUSTER MEMBERSHIPS (who is in which cluster)
CREATE TABLE cluster_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES donor_clusters(id),
  user_id UUID REFERENCES users(id),
  role_in_cluster TEXT CHECK (role_in_cluster IN ('patient','donor','volunteer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, user_id)
);

-- BRIDGES (patient ↔ donor group relationship)
CREATE TABLE bridges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id_hash TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES users(id),
  blood_bank_id UUID REFERENCES blood_banks(id), -- FK to patient's blood bank
  bridge_status BOOLEAN DEFAULT FALSE,
  bridge_blood_group TEXT NOT NULL,
  bridge_gender TEXT,
  quantity_required INTEGER DEFAULT 1 CHECK (quantity_required BETWEEN 1 AND 10),
  buffer_target INTEGER,                     -- set by inventory engine (qty_req + 1 or +2 for rare)
  frequency_in_days INTEGER NOT NULL CHECK (frequency_in_days >= 14),
  last_transfusion_date DATE,
  expected_next_transfusion_date DATE,
  is_low_density BOOLEAN DEFAULT FALSE,      -- set daily by density Lambda
  donation_window_start_days INTEGER DEFAULT 5, -- days before transfusion to start donation window
  donation_window_end_days INTEGER DEFAULT 2,   -- latest acceptable donation (2 days before)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRIDGE DONORS (many donors per bridge)
CREATE TABLE bridge_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id UUID REFERENCES bridges(id),
  donor_id UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  is_primary BOOLEAN DEFAULT FALSE,
  UNIQUE(bridge_id, donor_id)
);

-- BLOOD INVENTORY (actual stored units per patient per cycle)
-- Updated by blood bank staff via admin portal when donor physically donates
CREATE TABLE blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id UUID REFERENCES bridges(id),
  transfusion_id UUID REFERENCES transfusion_schedule(id),
  donor_id UUID REFERENCES users(id),
  blood_bank_id UUID REFERENCES blood_banks(id),
  units INTEGER DEFAULT 1 CHECK (units >= 1),
  blood_group TEXT NOT NULL,
  donated_at DATE NOT NULL,
  freshness_expires_at DATE NOT NULL,        -- donated_at + 7 days (Thalassemia freshness target)
  max_expires_at DATE NOT NULL,              -- donated_at + 35 days (CPDA shelf life, India standard)
  status TEXT DEFAULT 'stored'
    CHECK (status IN ('stored','reserved','used','expired','rejected')),
  logged_by UUID REFERENCES users(id),       -- staff who logged this donation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DONATION APPOINTMENTS (confirmed donor slot at blood bank)
-- YES from donor = appointment, not vague promise
CREATE TABLE donation_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfusion_id UUID REFERENCES transfusion_schedule(id),
  bridge_id UUID REFERENCES bridges(id),
  donor_id UUID REFERENCES users(id),
  blood_bank_id UUID REFERENCES blood_banks(id),
  appointment_date DATE NOT NULL,
  time_slot TEXT,                            -- e.g. "09:00-11:00"
  escalation_tier INTEGER CHECK (escalation_tier BETWEEN 1 AND 6),
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  confirmed_via_whatsapp BOOLEAN DEFAULT TRUE,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- TRANSFUSION SCHEDULE (computed daily, one row per upcoming transfusion)
CREATE TABLE transfusion_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id UUID REFERENCES bridges(id),
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','blood_sufficient','outreach_started',
                      'appointments_booked','confirmed','completed','failed')),
  units_required INTEGER NOT NULL,
  units_stored INTEGER DEFAULT 0,            -- snapshot from blood_inventory at last check
  buffer_gap INTEGER DEFAULT 0,              -- buffer_target - units_stored, min 0
  appointment_count INTEGER DEFAULT 0,
  outreach_started_at TIMESTAMPTZ,
  final_check_at TIMESTAMPTZ,               -- T-12hr normal, T-3hr low-density
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OUTREACH LOG (every contact attempt, every tier)
CREATE TABLE outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfusion_id UUID REFERENCES transfusion_schedule(id),
  donor_id UUID REFERENCES users(id),
  contact_method TEXT DEFAULT 'whatsapp' CHECK (contact_method IN ('whatsapp','sms','call')),
  message_sent TEXT,
  escalation_tier INTEGER CHECK (escalation_tier BETWEEN 1 AND 6),
  status TEXT DEFAULT 'sent'
    CHECK (status IN ('sent','delivered','responded_yes','responded_no','no_response','no_show')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- DONOR MEDICAL HOLDS (temporary unavailability)
CREATE TABLE donor_medical_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id),
  reason TEXT,                               -- self-reported, free text
  hold_start DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_recovery_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,        -- detected after 2+ holds of same type
  recurrence_pattern TEXT,                   -- e.g. "every December-January"
  status TEXT DEFAULT 'active' CHECK (status IN ('active','lifted','extended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISBANDING LOG (permanent or temporary donor removal)
CREATE TABLE disbanding_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id),
  disbanding_type TEXT CHECK (disbanding_type IN ('temporary','permanent')),
  reason_category TEXT CHECK (reason_category IN
    ('medical_temporary','medical_permanent','personal_decision','blood_transmitted_infection')),
  reinstated_at TIMESTAMPTZ,                 -- for temporary disbanding
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INTEGRATION EVENTS (mandatory when new donor joins a bridge)
CREATE TABLE integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES donor_clusters(id),
  new_donor_id UUID REFERENCES users(id),
  assigned_volunteer_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','scheduled','completed','overdue')),
  due_date DATE NOT NULL,                    -- assignment_date + 30 days
  meeting_format TEXT CHECK (meeting_format IN ('physical','virtual','hybrid')),
  meeting_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEETING REQUESTS (donor ↔ patient meetup requests)
CREATE TABLE meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES donor_clusters(id),
  requested_by UUID REFERENCES users(id),
  requesting_role TEXT CHECK (requesting_role IN ('donor','patient')),
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','scheduled','completed')),
  admin_notes TEXT,
  meeting_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITIES (bond events, milestone celebrations — content TBD next prompt)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES donor_clusters(id),  -- null = org-wide event
  activity_type TEXT CHECK (activity_type IN ('milestone','bond','integration','org_wide')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  organized_by UUID REFERENCES users(id),
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned','active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY RSVPs
CREATE TABLE activity_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id),
  user_id UUID REFERENCES users(id),
  response TEXT CHECK (response IN ('yes','no','maybe')),
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  reminded_at TIMESTAMPTZ,
  UNIQUE(activity_id, user_id)
);

-- INTERVAL CHANGE AUDIT (immutable — frequency changes with doctor report)
CREATE TABLE interval_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bridge_id UUID REFERENCES bridges(id),
  old_frequency_days INTEGER NOT NULL,
  new_frequency_days INTEGER NOT NULL,
  changed_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  report_file_url TEXT,                      -- Supabase Storage URL, private bucket
  groq_extracted_frequency INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ
);

-- FAILURE LOG (self-improvement engine input)
CREATE TABLE failure_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfusion_id UUID REFERENCES transfusion_schedule(id),
  bridge_id UUID REFERENCES bridges(id),
  days_notice INTEGER,
  max_tier_reached INTEGER,
  tier_response_rates JSONB,                 -- {1: 0.8, 2: 0.5, 3: 0.2}
  outcome TEXT CHECK (outcome IN ('resolved','failed','volunteer_intervened')),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN REPORTS (weekly AI-generated insights from failure log)
CREATE TABLE admin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT CHECK (report_type IN ('failure_analysis','churn_summary',
                                           'bridge_health','density_report')),
  report_content TEXT NOT NULL,
  generated_by TEXT DEFAULT 'groq-llama-3.3-70b',
  covers_period_start DATE,
  covers_period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. API ENDPOINTS (FastAPI)

```
POST /webhook/whatsapp                   Twilio webhook — incoming messages

GET  /api/donors                         List with filters: role, eligibility, blood_group, status
GET  /api/donors/{id}                    Donor profile + donation history + cluster membership
POST /api/donors                         Register new donor (admin portal + WhatsApp onboarding)
PUT  /api/donors/{id}                    Update profile
POST /api/donors/{id}/hold               Create medical hold
POST /api/donors/{id}/disband            Initiate soft disbanding

GET  /api/patients/{id}                  Patient profile + schedule + blood inventory status
GET  /api/patients/{id}/schedule         Upcoming transfusions + inventory state per cycle

GET  /api/bridges                        All bridges with density zone, stock status, next transfusion
GET  /api/bridges/{id}                   Bridge detail + donors + inventory + cluster
POST /api/bridges                        Create bridge (admin)
PUT  /api/bridges/{id}/frequency         Request frequency change → triggers approval flow

GET  /api/inventory/{bridge_id}          Current blood stock for a bridge
POST /api/inventory/log                  Log a completed donation (blood bank staff)
GET  /api/inventory/dashboard            All bridges: stock status, gaps, freshness alerts

GET  /api/clusters/{id}                  Cluster detail with members + activities
POST /api/clusters/{id}/meeting-request  Donor or patient requests a meeting

GET  /api/activities                     Upcoming activities
POST /api/activities                     Create activity (admin/volunteer)
POST /api/activities/{id}/rsvp           RSVP to an activity

GET  /api/admin/dashboard                Aggregate: bridge health, density map data, pending queues
GET  /api/admin/density                  Blood bank density map (all 132 locations with ratios)
GET  /api/admin/failures                 Failure log
GET  /api/admin/reports                  AI-generated weekly reports
POST /api/admin/approve-frequency        Approve/reject interval change
GET  /api/admin/integration-events       Pending integration events queue
PUT  /api/admin/integration-events/{id}  Mark integration event complete
GET  /api/admin/meeting-requests         Pending meeting requests
```

---

## 8. KEY BUSINESS RULES (hardcoded — never overridden by LLM or config)

1. `frequency_in_days` minimum = 14 days. Hard block. No override.
2. Blood freshness target for Thalassemia: donated_at must be within 7 days of transfusion_date.
3. Donation window: T-7 (outer) to T-2 (inner) days before transfusion_date.
4. Optimal donation request: ask donors to donate between T-5 and T-3.
5. Buffer target: quantity_required + 1 standard; + 2 for O-, Bombay Blood Group.
6. Bombay Blood Group: ONLY Bombay donors. Zero fallback. Hard filter.
7. Eligibility_status filter: always check `role != 'Patient'` first. Patients are never eligible donors.
8. Cascade triggers: Normal zone T-5 days; Low-density zone T-7 days.
9. Final deadline check: Normal T-12hr; Low-density T-3hr.
10. Density zones: CRITICAL (<2), LOW (2-5), MEDIUM (5-15), GOOD (>15).
11. No-show tracking: 3 no-shows → deprioritize. 5 no-shows → volunteer review.
12. Over-confirmation: excess donors go to standby, not primary slot.
13. Doctor report required for frequency change. Groq must confirm numeric frequency found.
14. Integration event mandatory within 30 days of new donor assignment. Not optional.
15. WhatsApp STOP → `opted_out = true`. Never contact again. No override.
16. Medical holds are self-reported and trusted. Volunteer can review if concerned.
17. Disbanding (permanent): irreversible via system. Only senior admin can reinstate after human review.
18. Blood inventory updates (logging donations): blood bank staff only. Not auto-computed.
19. Milestone triggers: 1st, 3rd, 5th, 10th, 25th donation per bridge (not total across all bridges).
20. DPDP Act 2023: no raw PII in logs. Use hashed IDs only. Consent required before first WhatsApp.

---

## 9. ENVIRONMENT VARIABLES (all in AWS SSM Parameter Store as SecureString)

```
SUPABASE_URL                    # https://xxxx.supabase.co
SUPABASE_SERVICE_KEY            # Backend Lambda only
SUPABASE_ANON_KEY               # Frontend only (with RLS)

GROQ_API_KEY                    # gsk_...

UPSTASH_REDIS_REST_URL          # https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN        # from Upstash console

TWILIO_ACCOUNT_SID              # ACxxxx
TWILIO_AUTH_TOKEN               # from Twilio console
TWILIO_WHATSAPP_NUMBER          # +14155238886 (sandbox) or registered number

BHASHINI_USER_ID                # from Bhashini profile
BHASHINI_API_KEY                # ulcaApiKey
BHASHINI_INFERENCE_KEY          # InferenceApiKey

RESEND_API_KEY                  # re_...

AWS_REGION                      # ap-south-1
```

---

## 10. KNOWN ISSUES AND MITIGATIONS

| Issue | Mitigation |
|---|---|
| Supabase pauses after 7 days inactivity | GitHub Actions heartbeat every 3 days (Section 5.1) |
| Lambda cold starts 200–800ms | Acceptable. Do NOT enable Provisioned Concurrency (costs money). |
| Twilio Sandbox sessions expire every 3 days | Demo: all participants join before demo. Production: Meta Cloud API with registered sender. |
| Twilio Sandbox: outbound only via templates | Demo within 24hr window of user message. Production: custom templates submitted to Meta. |
| Groq 70B rate limit (1,000 RPD) | Use 8B for bulk tasks. 70B only for extraction and analysis. |
| Groq 429 errors | Exponential backoff: `time.sleep(2**retry)` up to 3 retries. |
| Bhashini two-step API | Step 1 (config) is mandatory. Cache service_id per language pair in Redis (TTL 24h). |
| Lambda 10MB ZIP limit | Use Docker container image (up to 10GB). `PackageType: Image` in SAM template. |
| SQS visibility timeout | Set to 300s (5 min). Failed messages become visible again for retry. |
| Blood inventory not auto-updated | Staff must manually log donations in admin portal. Train Blood Warriors staff on this workflow. |
| Patient at (17.4086859, 78.4125044): 0 donors | System immediately flags CRITICAL density. Immediate campaign to convert guests within 15km. |
| No phone numbers in CSV | Demo with 3-5 test accounts created via portal. Historical data shows "queued" messages on dashboard. |
| Vercel Hobby plan prohibits commercial use | Use Cloudflare Pages only. Never Vercel for this project. |
| APScheduler inside Lambda | Never use. Lambda is stateless. All scheduling via EventBridge. |

---

## 11. COST SUMMARY (June 2026 verified)

| Service | Free Limit | Hackathon Usage | Cost |
|---|---|---|---|
| Supabase | 500MB DB, 1GB storage, 50K MAU | ~15MB DB, <2MB storage | $0 |
| Upstash Redis | 500K commands/month | ~8,000 commands | $0 |
| Groq (8B) | 14,400 req/day | ~600 req/day | $0 |
| Groq (70B) | 1,000 req/day | ~60 req/day | $0 |
| AWS Lambda | 1M invocations/month | ~8,000 invocations | $0 |
| AWS API Gateway HTTP | 300M/month free (12mo) | ~8,000 requests | $0 |
| AWS EventBridge | 14M events/month free | ~15 events/day | $0 |
| AWS SQS | 1M requests/month | ~2,000 messages | $0 |
| AWS CloudWatch | 5GB logs/month | ~200MB | $0 |
| Cloudflare Pages | Unlimited bandwidth | Hackathon traffic | $0 |
| Twilio Sandbox | Free for development | Demo usage | $0 |
| Bhashini | Free (Government of India) | Translation calls | $0 |
| GitHub Actions | 2,000 min/month | ~80 min | $0 |
| Resend | 100 emails/day | ~20 emails/day | $0 |
| **Total** | | | **$0** |

---

## 12. DEMO STRATEGY (WhatsApp without phone numbers)

1. CSV data is historical operational data. No phone numbers exist.
2. Team creates 3-5 test donor accounts via admin portal using real phone numbers (team's own phones).
3. These new accounts go through full live WhatsApp flow (invite, conversation, RSVP).
4. Historical dataset users appear in cascade queue and admin dashboard as "queued" — showing what message would be sent, not actually sending.
5. Judges see: real WhatsApp bot working with test accounts + dashboard showing cascade engine running against real historical data = comprehensive demo.
6. Post-hackathon: Blood Warriors staff backfill phone numbers from volunteer contact logs → those users enter the live system.

---

## 13. SECURITY CHECKLIST

- [ ] RLS enabled on all Supabase tables. Default deny policy.
- [ ] `service_role` key only in Lambda env vars (SSM SecureString). Never in frontend.
- [ ] `anon` key only in Cloudflare Pages env vars.
- [ ] Twilio signature validation on every webhook call.
- [ ] All user IDs in logs use hashed values (already hashed in dataset).
- [ ] Medical reports in Supabase Storage private bucket (no public URL).
- [ ] `opted_out = true` → never contact. Checked before every outreach.
- [ ] Blood type compatibility uses hardcoded dict, not user-submitted values.
- [ ] Disbanding log: reason stored as category only, no specific medical condition text.
- [ ] HTTPS automatic everywhere (Cloudflare Pages + Lambda API Gateway).
- [ ] DPDP Act 2023: consent collected before first WhatsApp message. Audit log of consent.

---

*Last verified: June 2026. All service limits from official documentation. Dataset facts confirmed from direct analysis. Medical protocol facts sourced from WHO, NCBI, and NBTC guidelines.*
