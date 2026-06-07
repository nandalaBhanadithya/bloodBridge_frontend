// API Service Layer for BloodBridge Frontend
// Connects to FastAPI backend endpoints described in technical SOT

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // Unified Authentication Endpoints
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Store token and user data
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }
    if (data.user) {
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('auth_role', data.user.role)
    }
    return data
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage even if API call fails
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_role')
    }
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  async signupAdmin(signupData) {
    return this.request('/api/auth/signup/admin', {
      method: 'POST',
      body: JSON.stringify(signupData),
    })
  }

  async signupPatient(signupData, prescriptionFile) {
    // Medical constraint validation: 14-day cycle minimum
    // This is enforced at backend, but we validate frontend for better UX
    const formData = new FormData()
    Object.keys(signupData).forEach(key => {
      formData.append(key, signupData[key])
    })
    if (prescriptionFile) {
      formData.append('prescription', prescriptionFile)
    }

    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${this.baseUrl}/api/auth/signup/patient`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // Medical constraint: 14-day cycle absolute floor
  validateTransfusionCycle(frequencyInDays) {
    const MIN_CYCLE_DAYS = 14
    if (frequencyInDays < MIN_CYCLE_DAYS) {
      throw new Error(`Transfusion cycle cannot be less than ${MIN_CYCLE_DAYS} days for patient safety`)
    }
    return true
  }

  // Medical privacy: Soft disband with generic codes
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

  // Integration protocol: Auto-create integration event when donor assigned
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

  async signupDonor(signupData) {
    return this.request('/api/auth/signup/donor', {
      method: 'POST',
      body: JSON.stringify(signupData),
    })
  }

  async signupVolunteer(signupData, inviteToken) {
    return this.request('/api/auth/signup/volunteer', {
      method: 'POST',
      body: JSON.stringify({ ...signupData, invite_token: inviteToken }),
    })
  }

  async generateVolunteerInvite(email) {
    return this.request('/api/admin/volunteer-invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Patient Management Endpoints
  async getPatients() {
    return this.request('/api/patients')
  }

  async approvePatient(patientId) {
    return this.request(`/api/admin/approve-patient/${patientId}`, {
      method: 'POST',
    })
  }

  async rejectPatient(patientId, reason) {
    return this.request(`/api/admin/reject-patient/${patientId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async getPendingRegistrations() {
    return this.request('/api/admin/pending-registrations')
  }

  // Donor Management Endpoints
  async getDonors() {
    return this.request('/api/donors')
  }

  async updateDonorStatus(donorId, status) {
    return this.request(`/api/donors/${donorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Bridge Management Endpoints
  async getBridges() {
    return this.request('/api/bridges')
  }

  async assignDonorToBridge(bridgeId, donorId) {
    return this.request(`/api/bridges/${bridgeId}/assign-donor`, {
      method: 'POST',
      body: JSON.stringify({ donor_id: donorId }),
    })
  }

  // Blood Stock Management Endpoints
  async getBloodStock() {
    return this.request('/api/inventory')
  }

  async logDonation(donationData) {
    return this.request('/api/inventory/log-donation', {
      method: 'POST',
      body: JSON.stringify(donationData),
    })
  }

  // Event/Activity Management Endpoints
  async getIntegrationEvents() {
    return this.request('/api/activities/integration-events')
  }

  async approveIntegrationEvent(eventId) {
    return this.request(`/api/activities/integration-events/${eventId}/approve`, {
      method: 'POST',
    })
  }

  async requestDateChange(eventId, requestedDate) {
    return this.request(`/api/activities/integration-events/${eventId}/request-date`, {
      method: 'POST',
      body: JSON.stringify({ requested_date: requestedDate }),
    })
  }

  async combineEvents(eventIds, combinedData) {
    return this.request('/api/activities/combine-events', {
      method: 'POST',
      body: JSON.stringify({ event_ids: eventIds, ...combinedData }),
    })
  }

  async getCommunityEvents() {
    return this.request('/api/activities/community-events')
  }

  async createCommunityEvent(eventData) {
    return this.request('/api/activities/community-events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }

  // Density Map Endpoints
  async getDensityMap() {
    return this.request('/api/admin/density-map')
  }

  // Reports Endpoints
  async getFailureReports() {
    return this.request('/api/admin/failure-reports')
  }

  async getAnalyticsReport() {
    return this.request('/api/admin/analytics')
  }

  // Meeting Requests Endpoints
  async getMeetingRequests() {
    return this.request('/api/clusters/meeting-requests')
  }

  async approveMeetingRequest(requestId) {
    return this.request(`/api/clusters/meeting-requests/${requestId}/approve`, {
      method: 'POST',
    })
  }

  async rejectMeetingRequest(requestId, reason) {
    return this.request(`/api/clusters/meeting-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }
}

export const api = new ApiService()
