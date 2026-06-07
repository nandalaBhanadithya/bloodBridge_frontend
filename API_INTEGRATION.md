# BloodBridge Frontend - API Integration Documentation

## Overview

This document describes how the BloodBridge frontend integrates with the FastAPI backend. All components now use real API calls instead of dummy data, with proper error handling and loading states.

## API Service Layer

The API service is located at `src/services/api.js` and provides a centralized interface for all backend communication.

### Configuration

The API base URL is configured via environment variable:
```bash
VITE_API_URL=http://localhost:8000
```

Set this in your `.env` file to point to your FastAPI backend.

### Available API Methods

#### Patient Management
- `getPatients()` - Fetch all patients
- `approvePatient(patientId)` - Approve a patient registration
- `rejectPatient(patientId, reason)` - Reject a patient registration
- `getPendingRegistrations()` - Get pending patient registrations

#### Donor Management
- `getDonors()` - Fetch all donors
- `updateDonorStatus(donorId, status)` - Update donor status

#### Bridge Management
- `getBridges()` - Fetch all bridges
- `assignDonorToBridge(bridgeId, donorId)` - Assign donor to a bridge

#### Blood Stock Management
- `getBloodStock()` - Get current blood inventory
- `logDonation(donationData)` - Log a new donation

#### Event/Activity Management
- `getIntegrationEvents()` - Get integration events
- `approveIntegrationEvent(eventId)` - Approve an integration event
- `requestDateChange(eventId, requestedDate)` - Request a date change
- `combineEvents(eventIds, combinedData)` - Combine multiple events
- `getCommunityEvents()` - Get community events
- `createCommunityEvent(eventData)` - Create a new community event

#### Density Map
- `getDensityMap()` - Get blood bank density map data

#### Reports
- `getFailureReports()` - Get failure reports
- `getAnalyticsReport()` - Get analytics report

#### Meeting Requests
- `getMeetingRequests()` - Get meeting requests
- `approveMeetingRequest(requestId)` - Approve a meeting request
- `rejectMeetingRequest(requestId, reason)` - Reject a meeting request

## Component Integration

### Admin Components

#### PriorityQueue (`src/components/admin/PriorityQueue.jsx`)
- **API Calls**: `getPendingRegistrations()`, `approvePatient()`
- **Key Feature**: When a patient is approved, the pending count automatically decreases
- **Loading State**: Shows loading spinner while fetching data
- **Error Handling**: Displays error message if API fails, falls back to mock data

#### EventQueue (`src/components/admin/sections/EventQueue.jsx`)
- **API Calls**: `getIntegrationEvents()`, `approveIntegrationEvent()`, `requestDateChange()`, `combineEvents()`, `createCommunityEvent()`
- **Key Feature**: All approval and date change buttons make real API calls
- **Loading State**: Buttons show "Processing..." during API operations

#### BloodStock (`src/components/admin/sections/BloodStock.jsx`)
- **API Calls**: `getBloodStock()`, `logDonation()`
- **Key Feature**: Metric cards display dynamic data from API
- **Auto-refresh**: Reloads inventory after logging a donation

#### Patients (`src/components/admin/sections/Patients.jsx`)
- **API Calls**: `getPatients()`
- **Key Feature**: Patient count and table rows are dynamic
- **Status Badges**: Automatically calculated based on stock status

#### Overview (`src/components/admin/sections/Overview.jsx`)
- **API Calls**: `getAnalyticsReport()`
- **Key Feature**: All metric cards display dynamic data
- **Guest Conversion**: Shows real conversion funnel data

### Donor Components

#### DashboardTab (`src/components/donor/sections/DashboardTab.jsx`)
- **API Calls**: `getDonors()`
- **Key Feature**: Eligibility, milestones, and impact metrics are dynamic
- **Progress Bars**: Calculated from actual API data

#### MeetupTab (`src/components/donor/sections/MeetupTab.jsx`)
- **API Calls**: `createCommunityEvent()`
- **Key Feature**: Meetup requests are sent to backend
- **Loading State**: Button shows "Processing..." during API call

### Patient Components

#### DashboardTab (`src/components/patient/sections/DashboardTab.jsx`)
- **API Calls**: `getPatients()`
- **Key Feature**: Transfusion schedule and donor team are dynamic
- **Loading State**: Shows loading spinner while fetching data

### Volunteer Components

#### TasksSection (`src/components/volunteer/sections/TasksSection.jsx`)
- **API Calls**: `getIntegrationEvents()`, `approveIntegrationEvent()`
- **Key Feature**: Task completion triggers API calls
- **Loading State**: Shows loading spinner while fetching tasks

## Error Handling Strategy

All components follow a consistent error handling pattern:

1. **Try-Catch Blocks**: All API calls are wrapped in try-catch
2. **Fallback Data**: If API fails, components fall back to mock data for development
3. **User Alerts**: Critical errors show alert() to inform the user
4. **Console Logging**: Errors are logged to console for debugging

Example:
```javascript
try {
  const data = await api.getPatients()
  setPatients(data.patients || [])
} catch (err) {
  console.error('Failed to load patients:', err)
  // Fallback to mock data for development
  setPatients(mockPatients)
} finally {
  setLoading(false)
}
```

## Loading States

All components implement loading states:

1. **Initial Load**: Shows loading spinner when component mounts
2. **Button States**: Buttons show "Processing..." during operations
3. **Disabled States**: Buttons are disabled during API calls to prevent double-submission

## Authentication

The API service includes authentication token handling:

```javascript
const token = localStorage.getItem('auth_token')
if (token) {
  headers['Authorization'] = `Bearer ${token}`
}
```

In a production app, tokens would be obtained from Supabase Auth and stored securely.

## Development Mode

When the backend is not available, all components automatically fall back to mock data. This allows frontend development to continue without a running backend.

To use real API calls:
1. Start the FastAPI backend (see technical SOT for setup instructions)
2. Set `VITE_API_URL` in `.env` to point to your backend
3. Components will automatically use real API calls

## Testing

To test the API integration:

1. **With Backend Running**:
   ```bash
   # Start FastAPI backend
   cd backend
   uvicorn main:app --reload
   
   # Start frontend
   cd Front_blood_bridge
   npm run dev
   ```

2. **Without Backend**:
   - Components will use mock data
   - All UI features remain functional
   - API calls will fail gracefully with console errors

## Backend API Endpoints

The frontend expects the following backend endpoints (as defined in technical SOT):

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `POST /api/admin/approve-patient/{patient_id}` - Approve patient
- `POST /api/admin/reject-patient/{patient_id}` - Reject patient
- `GET /api/admin/pending-registrations` - Get pending registrations

### Donor Endpoints
- `GET /api/donors` - Get all donors
- `PATCH /api/donors/{donor_id}/status` - Update donor status

### Bridge Endpoints
- `GET /api/bridges` - Get all bridges
- `POST /api/bridges/{bridge_id}/assign-donor` - Assign donor to bridge

### Inventory Endpoints
- `GET /api/inventory` - Get blood stock
- `POST /api/inventory/log-donation` - Log donation

### Activity Endpoints
- `GET /api/activities/integration-events` - Get integration events
- `POST /api/activities/integration-events/{event_id}/approve` - Approve event
- `POST /api/activities/integration-events/{event_id}/request-date` - Request date change
- `POST /api/activities/combine-events` - Combine events
- `GET /api/activities/community-events` - Get community events
- `POST /api/activities/community-events` - Create community event

### Admin Endpoints
- `GET /api/admin/density-map` - Get density map
- `GET /api/admin/failure-reports` - Get failure reports
- `GET /api/admin/analytics` - Get analytics

### Cluster Endpoints
- `GET /api/clusters/meeting-requests` - Get meeting requests
- `POST /api/clusters/meeting-requests/{request_id}/approve` - Approve meeting
- `POST /api/clusters/meeting-requests/{request_id}/reject` - Reject meeting

## Troubleshooting

### API Calls Failing
- Check that `VITE_API_URL` is set correctly in `.env`
- Ensure backend is running and accessible
- Check browser console for error messages
- Verify CORS is configured on backend

### Components Not Updating
- Check that API calls are in `useEffect` hooks
- Verify state is being set correctly
- Check for console errors
- Ensure component is not using hardcoded data

### Mock Data Still Showing
- Backend may not be running
- `VITE_API_URL` may be incorrect
- API endpoints may not match backend
- Check browser network tab for failed requests

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket or polling for real-time data updates
2. **Optimistic UI**: Update UI immediately, rollback on error
3. **Request Cancellation**: Implement AbortController for cancelable requests
4. **Request Caching**: Cache API responses to reduce load
5. **Retry Logic**: Implement automatic retry for failed requests
6. **Request Queuing**: Queue requests when offline, sync when back online
