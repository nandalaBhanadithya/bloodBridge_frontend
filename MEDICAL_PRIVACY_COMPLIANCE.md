# BloodBridge AI - Medical Privacy & Security Compliance

## Overview

This document outlines the medical privacy and security compliance measures implemented in the BloodBridge AI system to ensure patient safety, donor privacy, and regulatory compliance.

## Core Medical Constraints

### 1. 14-Day Cycle Absolute Floor

**Purpose**: Prevent lethal execution cycles for Thalassemia major patients.

**Implementation**:
- **Database Constraint**: `CHECK (frequency_in_days >= 14)`
- **Frontend Validation**: `api.validateTransfusionCycle(frequencyInDays)`
- **Backend Enforcement**: Hard-blocks any entry beneath 14 days

**Rationale**: Thalassemia major patients require regular transfusions, but medically, a cycle rarely falls below 14 days. This absolute baseline boundary prevents dangerous transfusion scheduling.

**Code Reference**:
```javascript
// API Service - src/services/api.js
validateTransfusionCycle(frequencyInDays) {
  const MIN_CYCLE_DAYS = 14
  if (frequencyInDays < MIN_CYCLE_DAYS) {
    throw new Error(`Transfusion cycle cannot be less than ${MIN_CYCLE_DAYS} days for patient safety`)
  }
  return true
}
```

### 2. Immediate Integration Protocol Trigger

**Purpose**: Ensure sustainability through human connection and donor retention.

**Implementation**:
- **Trigger**: When Admin assigns a new donor to a patient's bridge
- **Action**: Automatically create an `integration_events` row
- **Deadline**: Strict 30-day completion deadline
- **Assignment**: Task appears on Volunteer's ledger for coordination

**Rationale**: A first-time donor who meets the child they are protecting becomes a loyal recurring donor. This protocol ensures every new donor assignment triggers a mandatory supervised initial meeting.

**Code Reference**:
```javascript
// API Service - src/services/api.js
async assignDonorToBridgeWithIntegration(bridgeId, donorId) {
  const result = await this.assignDonorToBridge(bridgeId, donorId)
  
  // Trigger integration event creation with 30-day deadline
  await this.request('/api/activities/integration-events', {
    method: 'POST',
    body: JSON.stringify({
      donor_id: donorId,
      bridge_id: bridgeId,
      event_type: 'initial_meeting',
      deadline_days: 30,
    }),
  })
  
  return result
}
```

### 3. Medically Private "Soft Disband" System

**Purpose**: Protect donor medical privacy while maintaining system integrity.

**Implementation**:
- **No Explicit Medical Data**: Never log phrases like "Donor has HIV" in public tables
- **Generic Codes**: Use standardized categorization codes
- **Audit Trail**: Record exits in encrypted audit track
- **Clean Removal**: Purge from all automated communication arrays

**Valid Reason Codes**:
- `medical_permanent` - Permanent medical disqualification
- `medical_temporary` - Temporary medical deferral
- `personal` - Personal reasons
- `other` - Other reasons

**Rationale**: To comply with absolute medical privacy and data protection principles, explicit medical conditions are never stored in public tables. Instead, generic codes protect donor privacy while maintaining auditability.

**Code Reference**:
```javascript
// API Service - src/services/api.js
async reportMedicalDisband(donorId, reasonCode) {
  // reasonCode should be generic: 'medical_permanent', 'medical_temporary', etc.
  // Never store explicit medical conditions in public tables
  const validCodes = ['medical_permanent', 'medical_temporary', 'personal', 'other']
  if (!validCodes.includes(reasonCode)) {
    throw new Error('Invalid disband reason code')
  }

  return this.request(`/api/donors/${donorId}/disband`, {
    method: 'POST',
    body: JSON.stringify({ reason_code: reasonCode }),
  })
}
```

## Role-Specific Signup Constraints

### Admin Sign-Up (Organizational Guardrail)

**Constraint**: Email Suffix Validation
- **Requirement**: Email must end with `@warriors.org`
- **Implementation**: Frontend validation + backend enforcement
- **Purpose**: Prevent unauthorized admin access

**Code Reference**: `src/components/signup/AdminSignup.jsx`

### Patient Sign-Up (AI Triage Engine)

**Constraint**: AI-Powered Prescription Analysis
- **Requirement**: Upload doctor's prescription (JPG, PNG, PDF)
- **Process**: Groq Llama 3.3 70B extracts blood_group, frequency_in_days, quantity_required
- **Status**: Account set to `pending_review`
- **Approval**: Manual admin approval before activation

**Medical Safety**: 14-day cycle minimum enforced automatically

**Code Reference**: `src/components/signup/PatientSignup.jsx`

### Donor Sign-Up (Geographical Anchor)

**Constraint**: Mandatory Location Mapping
- **Requirement**: Full Legal Name, Phone, Blood Group, Facility Coordinates (Lat/Lon)
- **Purpose**: Enable Haversine proximity distance routing
- **Integration**: Maps to 132 institutional blood center locations

**Code Reference**: `src/components/signup/DonorSignup.jsx`

### Volunteer Sign-Up (Closed Invites Protocol)

**Constraint**: Admin-Invited Only
- **Requirement**: Valid invite token (format: BWVOL-XXXXXXXX)
- **Process**: Admin generates single-use registration link
- **Purpose**: Prevent random internet users from accessing care coordinator role

**Code Reference**: `src/components/signup/VolunteerSignup.jsx`

## Database Schema Constraints

### Users Table (Single-Table Pattern)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- Role Check Constraint
  role TEXT NOT NULL CHECK (role IN ('admin', 'donor', 'patient', 'volunteer')),
  
  -- Profile Parameters (nullable depending on role)
  blood_group TEXT,
  facility_coordinates POINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_privacy_policy ON users
  FOR SELECT
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');
```

### Patient Cycle Constraint

```sql
-- 14-Day Cycle Absolute Floor
ALTER TABLE patients 
  ADD CONSTRAINT cycle_minimum 
  CHECK (frequency_in_days >= 14);
```

## Security Best Practices

### Authentication
- Unified authentication gateway
- Role-based client-side routing
- Backend determines role from database
- JWT token-based session management

### Data Privacy
- Row-Level Security (RLS) enabled
- Generic medical codes instead of explicit conditions
- Encrypted audit trails for sensitive operations
- No medical data in public tables

### Access Control
- Admin: Email domain validation
- Volunteer: Invite-token only
- Patient: Admin approval required
- Donor: Public registration with validation

## Compliance Checklist

- [x] 14-day cycle minimum enforced
- [x] Generic medical disband codes implemented
- [x] Integration event auto-trigger on donor assignment
- [x] Admin email domain validation
- [x] Volunteer invite-token system
- [x] Patient AI triage with admin approval
- [x] Donor location mapping for proximity routing
- [x] Row-Level Security enabled
- [x] Single-table user pattern
- [x] Medical privacy compliance

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Unified login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Role-Specific Signup
- `POST /api/auth/signup/admin` - Admin registration
- `POST /api/auth/signup/patient` - Patient registration with AI triage
- `POST /api/auth/signup/donor` - Donor registration
- `POST /api/auth/signup/volunteer` - Volunteer registration (invite only)

### Medical Operations
- `POST /api/donors/{id}/disband` - Medical disband with generic codes
- `POST /api/bridges/{id}/assign-donor` - Assign donor with integration trigger

## Frontend Components

### Signup Pages
- `src/components/signup/AdminSignup.jsx` - Admin registration
- `src/components/signup/PatientSignup.jsx` - Patient registration
- `src/components/signup/DonorSignup.jsx` - Donor registration
- `src/components/signup/VolunteerSignup.jsx` - Volunteer registration

### Authentication
- `src/contexts/AuthContext.jsx` - Unified auth context
- `src/components/LoginPage.jsx` - Unified login page
- `src/App.jsx` - Role-based routing

### API Service
- `src/services/api.js` - API service with medical constraints

## Testing Guidelines

### Medical Constraint Testing
1. Test 14-day cycle validation with values < 14
2. Test integration event creation on donor assignment
3. Test medical disband with invalid codes
4. Test generic code validation

### Signup Flow Testing
1. Test admin signup with invalid email domain
2. Test patient signup without prescription
3. Test donor signup without coordinates
4. Test volunteer signup without invite token

### Security Testing
1. Test RLS policies with different roles
2. Test JWT token expiration
3. Test invite token uniqueness
4. Test admin approval workflow

## Deployment Notes

### Environment Variables
```env
VITE_API_URL=http://localhost:8000
```

### Database Setup
1. Enable Row-Level Security
2. Create check constraints
3. Set up RLS policies
4. Configure JWT authentication

### Backend Requirements
- Supabase Auth integration
- Groq Llama 3.3 70B for AI triage
- File upload handling for prescriptions
- Geolocation services for donor mapping

## Future Enhancements

1. **Real-time Validation**: WebSocket-based cycle validation
2. **Enhanced AI**: More sophisticated prescription parsing
3. **Audit Dashboard**: Real-time audit trail monitoring
4. **Compliance Reports**: Automated compliance reporting
5. **Medical Integration**: EHR system integration for prescription verification

## References

- BloodBridge Technical SOT
- Medical Safety Guidelines
- Data Protection Regulations
- Healthcare Compliance Standards
