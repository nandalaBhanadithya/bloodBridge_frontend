import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

export default function AdminSignup({ onBack }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateEmail = (email) => {
    // Enforce email domain validation - must end with @warriors.org
    const allowedDomain = '@warriors.org'
    return email.endsWith(allowedDomain)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate email domain
    if (!validateEmail(formData.email)) {
      setError('Admin email must end with @warriors.org')
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)
      await api.signupAdmin({
        name: formData.name,
        email: formData.email,
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{
            fontFamily: 'Syne',
            fontSize: 24,
            fontWeight: 800,
            color: '#1e3a5f',
            marginBottom: 8,
          }}>
            Admin Account Created
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
            Admin Registration
          </h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Register as a BloodBridge administrator
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
              placeholder="John Doe"
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
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
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
              Email <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@warriors.org"
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
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Must end with @warriors.org
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
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
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
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
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
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <p>Already have an account? <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#764ba2', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Login</button></p>
        </div>
      </div>
    </div>
  )
}
