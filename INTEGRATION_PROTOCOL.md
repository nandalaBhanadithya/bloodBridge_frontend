# BloodBridge AI - Integration Protocol Documentation

## Overview

The Integration Protocol ensures that every new donor assignment triggers a mandatory supervised initial meeting, fostering human connection and donor retention. This document describes the automatic integration event trigger logic.

## Protocol Trigger

### When It Triggers

The integration event is automatically created **immediately** when an Admin assigns a new donor to a patient's active bridge.

**Trigger Condition**: `INSERT` into `bridge_donors` table
**Action**: Create `integration_events` row with 30-day deadline

### Implementation

**Frontend API Call**:
```javascript
// API Service - src/services/api.js
async assignDonorToBridgeWithIntegration(bridgeId, donorId) {
  // Step 1: Assign donor to bridge
  const result = await this.assignDonorToBridge(bridgeId, donorId)
  
  // Step 2: Trigger integration event creation with 30-day deadline
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

**Backend Database Trigger** (Recommended):
```sql
CREATE TRIGGER trigger_integration_event
AFTER INSERT ON bridge_donors
FOR EACH ROW
BEGIN
  INSERT INTO integration_events (
    donor_id,
    bridge_id,
    event_type,
    deadline_days,
    status,
    created_at
  ) VALUES (
    NEW.donor_id,
    NEW.bridge_id,
    'initial_meeting',
    30,
    'pending',
    NOW()
  );
END;
```

## Integration Event Structure

### Event Properties

| Property | Type | Description |
|----------|------|-------------|
| `donor_id` | UUID | ID of the newly assigned donor |
| `bridge_id` | UUID | ID of the bridge the donor was assigned to |
| `event_type` | TEXT | Always `'initial_meeting'` for new assignments |
| `deadline_days` | INTEGER | Always `30` days from creation |
| `status` | TEXT | Starts as `'pending'` |
| `created_at` | TIMESTAMPTZ | Timestamp of event creation |

### Deadline Calculation

```javascript
const deadlineDate = new Date()
deadlineDate.setDate(deadlineDate.getDate() + 30)
```

## Volunteer Assignment

### Automatic Volunteer Routing

When an integration event is created, the system automatically assigns it to the Volunteer responsible for that bridge.

**Routing Logic**:
1. Identify the bridge's assigned volunteer
2. Create task in volunteer's task queue
3. Set priority to `high` (integration tasks are critical)
4. Calculate deadline (30 days from event creation)

### Volunteer Task Display

The integration event appears in the Volunteer's TasksSection with:
- **Badge**: "Integration · Mandatory"
- **Priority**: High (red border)
- **Deadline**: 30-day countdown
- **Action**: "Schedule intro meeting"

## Event Lifecycle

### States

1. **pending** - Event created, awaiting volunteer action
2. **in_progress** - Volunteer has scheduled the meeting
3. **completed** - Meeting successfully conducted
4. **overdue** - Deadline passed without completion
5. **cancelled** - Event cancelled by admin

### State Transitions

```
pending → in_progress → completed
pending → overdue
pending → cancelled
in_progress → cancelled
```

## Volunteer Actions

### Required Actions

1. **Schedule Meeting**: Volunteer must schedule initial meeting within 30 days
2. **Coordinate**: Arrange venue, time, and participants
3. **Conduct**: Supervise the meeting between donor and patient
4. **Report**: Submit completion report

### API Endpoints

```javascript
// Approve integration event (mark as completed)
POST /api/activities/integration-events/{event_id}/approve

// Request date change (extend deadline)
POST /api/activities/integration-events/{event_id}/request-date

// Cancel event
POST /api/activities/integration-events/{event_id}/cancel
```

## Monitoring & Alerts

### Deadline Tracking

The system monitors integration events for:
- **Upcoming Deadlines**: Events within 7 days of deadline
- **Overdue Events**: Events past deadline
- **Completed Events**: Successfully completed events

### Alert System

**Volunteer Alerts**:
- 7 days before deadline: Reminder notification
- 3 days before deadline: Urgent reminder
- 1 day before deadline: Critical alert
- Deadline passed: Overdue escalation to admin

**Admin Alerts**:
- New integration events created
- Overdue events requiring intervention
- Completed events for reporting

## Frontend Implementation

### Volunteer TasksSection

The integration event appears in the volunteer's task list:

```javascript
// src/components/volunteer/sections/TasksSection.jsx
{
  border: '#7C3AED',
  badge: 'bp',
  badgeText: 'Integration · Mandatory',
  dueBadge: '14 days remaining',
  title: 'New donor intro — Team Ramu',
  desc: 'Lakshmi T. joined Jun 3. Arrange first supervised meetup within 30 days of assignment (protocol).',
  btn: 'btn-purple',
  btnText: 'Schedule intro meeting',
  doneText: 'Meeting scheduled ✓'
}
```

### EventQueue Component

Admin can view and manage integration events:

```javascript
// src/components/admin/sections/EventQueue.jsx
// Displays integration events with approval actions
```

## Business Logic Validation

### Pre-Assignment Checks

Before assigning a donor to a bridge, the system should validate:

1. **Donor Eligibility**: Donor is not in cooldown
2. **Bridge Capacity**: Bridge has available slots
3. **Blood Compatibility**: Donor blood group matches patient requirements
4. **Active Status**: Both donor and patient are active

### Post-Assignment Actions

After successful assignment:

1. **Create Integration Event**: Automatic trigger
2. **Notify Volunteer**: Send notification to assigned volunteer
3. **Update Donor Status**: Mark donor as "assigned"
4. **Log Assignment**: Record in audit trail

## Failure Handling

### Assignment Failures

If donor assignment fails:
- Rollback any partial changes
- Log error with details
- Notify admin of failure
- Do not create integration event

### Integration Event Failures

If integration event creation fails:
- Log error with bridge_id and donor_id
- Retry mechanism (3 attempts)
- Manual admin intervention if retries fail
- Alert system notification

## Compliance Requirements

### 30-Day Deadline

**Purpose**: Ensure timely integration of new donors
**Enforcement**: Hard deadline, no extensions without admin approval
**Consequences**: Overdue events escalate to admin for intervention

### Mandatory Completion

**Purpose**: Every donor must meet their patient
**Enforcement**: Cannot proceed to next donation without completion
**Tracking**: Completion status recorded in donor profile

### Audit Trail

**Purpose**: Maintain record of all integration activities
**Storage**: Encrypted audit log
**Retention**: 7 years minimum
**Access**: Admin only

## Testing

### Unit Tests

1. Test integration event creation on donor assignment
2. Test deadline calculation (30 days)
3. Test volunteer routing logic
4. Test state transitions

### Integration Tests

1. Test full assignment → integration → completion flow
2. Test overdue event handling
3. Test volunteer notification system
4. Test admin escalation for overdue events

### Manual Testing

1. Assign donor to bridge via admin dashboard
2. Verify integration event appears in volunteer tasks
3. Verify deadline countdown
4. Complete meeting and verify status update

## Performance Considerations

### Database Indexing

```sql
CREATE INDEX idx_integration_events_donor_id ON integration_events(donor_id);
CREATE INDEX idx_integration_events_bridge_id ON integration_events(bridge_id);
CREATE INDEX idx_integration_events_deadline ON integration_events(deadline);
CREATE INDEX idx_integration_events_status ON integration_events(status);
```

### Query Optimization

- Use indexed columns for filtering
- Batch operations for bulk assignments
- Cache volunteer assignments
- Optimize deadline queries

## Security Considerations

### Access Control

- Only admins can assign donors
- Only assigned volunteers can view their integration events
- Audit all integration event modifications
- Encrypt sensitive event data

### Data Privacy

- Donor medical data not exposed in integration events
- Patient information protected
- Volunteer access limited to assigned bridges
- Generic status codes for disband reasons

## Future Enhancements

1. **Smart Scheduling**: AI-powered meeting scheduling
2. **Video Integration**: Remote meeting options
3. **Feedback System**: Post-meeting feedback collection
4. **Analytics**: Integration success rate tracking
5. **Automation**: Automated reminder escalation

## References

- BloodBridge Technical SOT
- Medical Privacy Compliance Documentation
- API Service Documentation
- Database Schema Documentation
