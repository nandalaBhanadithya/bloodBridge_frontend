import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

export default function VolunteerSignup({ onBack }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteToken: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validatingToken, setValidatingToken] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateInviteToken = async () => {
    if (!formData.inviteToken) {
      setError('Please enter your invite token')
      return
    }

    setValidatingToken(true)
    setError('')

    try {
      // In production, this would validate the token with the backend
      // For demo, we'll simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo validation - token should start with 'BWVOL-'
      if (!formData.inviteToken.startsWith('BWVOL-')) {
        setError('Invalid invite token. Please check with your admin.')
        setValidatingToken(false)
        return
      }

      setValidatingToken(false)
    } catch (err) {
      setError('Failed to validate invite token. Please try again.')
      setValidatingToken(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.inviteToken) {
      setError('Please enter your invite token')
      return
    }

    if (!formData.inviteToken.startsWith('BWVOL-')) {
      setError('Invalid invite token format')
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
      await api.signupVolunteer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      }, formData.inviteToken)
      setSuccess(true)
      // Auto-login after successful signup
      setTimeout(async () => {
        await login(formData.email, formData.password)
      }, 1500)
    } catch (err) {
      setError('Signup failed. Please check your invite token and try again.')
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
          <h2 style={{
            fontFamily: 'Syne',
            fontSize: 24,
            fontWeight: 800,
            color: '#1e3a5f',
            marginBottom: 8,
          }}>
            Volunteer Account Created
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
        maxWidth: 450,
        width: '100%',
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontFamily: 'Syne',
            fontSize: 28,
            fontWeight: 800,
            color: '#1e3a5f',
            marginBottom: 8,
          }}>
            Volunteer Registration
          </h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Register as a BloodBridge volunteer
          </p>
        </div>

        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
          fontSize: 12,
          color: '#92400E',
        }}>
          <strong>Note:</strong> Volunteer registration is by invitation only. You must have a valid invite token from an admin to register.
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
              Invite Token <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                name="inviteToken"
                value={formData.inviteToken}
                onChange={handleChange}
                placeholder="BWVOL-XXXXXXXX"
                required
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={validateInviteToken}
                disabled={validatingToken}
                style={{
                  padding: '0 16px',
                  borderRadius: 8,
                  background: validatingToken ? '#9ca3af' : '#1e3a5f',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: validatingToken ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!validatingToken) e.target.style.background = '#1e3a5f'
                }}
                onMouseLeave={(e) => {
                  if (!validatingToken) e.target.style.background = '#1e3a5f'
                }}
              >
                {validatingToken ? '...' : 'Verify'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Token format: BWVOL-XXXXXXXX
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Lakshmi T."
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
              onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
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
              onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
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
              placeholder="lakshmi@example.com"
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
              onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
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
              onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
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
              onFocus={(e) => e.target.style.borderColor = '#1e3a5f'}
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
              background: loading ? '#9ca3af' : '#1e3a5f',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#1e3a5f'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#1e3a5f'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Volunteer Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <p>Already have an account? <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1e3a5f', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Login</button></p>
          <p style={{ marginTop: 8 }}>Need an invite? Contact your BloodBridge admin.</p>
        </div>
      </div>
    </div>
  )
}
