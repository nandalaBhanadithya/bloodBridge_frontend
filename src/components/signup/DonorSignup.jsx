import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function DonorSignup({ onBack }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bloodGroup: '',
    facilityName: '',
    facilityCoordinates: { lat: '', lng: '' },
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLocationChange = (field, value) => {
    setFormData({
      ...formData,
      facilityCoordinates: { ...formData.facilityCoordinates, [field]: value }
    })
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            facilityCoordinates: {
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString()
            }
          })
          setGettingLocation(false)
        },
        (error) => {
          setError('Unable to get your location. Please enter coordinates manually.')
          setGettingLocation(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser. Please enter coordinates manually.')
      setGettingLocation(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.bloodGroup) {
      setError('Please select your blood group')
      return
    }

    if (!formData.facilityName) {
      setError('Please enter your registration facility name')
      return
    }

    if (!formData.facilityCoordinates.lat || !formData.facilityCoordinates.lng) {
      setError('Please provide facility coordinates or use your current location')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)
      await api.signupDonor({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        blood_group: formData.bloodGroup,
        facility_name: formData.facilityName,
        facility_coordinates: formData.facilityCoordinates,
        password: formData.password,
      })
      setSuccess(true)
      // Auto-login after successful signup
      setTimeout(async () => {
        await login(formData.email, formData.password)
      }, 1500)
    } catch (err) {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 20,
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: 400,
          width: '100%',
          padding: 40,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🩸</div>
          <h2 style={{
            fontFamily: 'Syne',
            fontSize: 24,
            fontWeight: 800,
            color: '#7f1d1d',
            marginBottom: 8,
          }}>
            Donor Account Created
          </h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: 500,
        width: '100%',
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontFamily: 'Syne',
            fontSize: 28,
            fontWeight: 800,
            color: '#7f1d1d',
            marginBottom: 8,
          }}>
            Donor Registration
          </h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Register to save lives through blood donation
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Suresh Kumar"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="suresh@example.com"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Blood Group <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
                background: '#fff',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select your blood group</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Registration Facility Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              placeholder="City Hospital Blood Bank"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Facility Coordinates <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Latitude"
                value={formData.facilityCoordinates.lat}
                onChange={(e) => handleLocationChange('lat', e.target.value)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={formData.facilityCoordinates.lng}
                onChange={(e) => handleLocationChange('lng', e.target.value)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                background: gettingLocation ? '#9ca3af' : '#FEF3C7',
                color: '#92400E',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid #FDE68A',
                cursor: gettingLocation ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!gettingLocation) e.target.style.background = '#FDE68A'
              }}
              onMouseLeave={(e) => {
                if (!gettingLocation) e.target.style.background = '#FEF3C7'
              }}
            >
              {gettingLocation ? 'Getting Location...' : '📍 Use My Current Location'}
            </button>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
              This helps us match you with patients nearby
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 8,
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: 12,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              background: loading ? '#9ca3af' : '#7f1d1d',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#7f1d1d'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#7f1d1d'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Donor Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <p>Already have an account? <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#7f1d1d', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Login</button></p>
        </div>
      </div>
    </div>
  )
}
