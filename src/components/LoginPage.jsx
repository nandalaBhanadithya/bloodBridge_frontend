import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminSignup from './signup/AdminSignup'
import DonorSignup from './signup/DonorSignup'
import PatientSignup from './signup/PatientSignup'
import VolunteerSignup from './signup/VolunteerSignup'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('login') // 'login', 'role-select', 'admin', 'donor', 'patient', 'volunteer'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Render signup components based on view
  if (view === 'admin') return <AdminSignup onBack={() => setView('role-select')} />
  if (view === 'donor') return <DonorSignup onBack={() => setView('role-select')} />
  if (view === 'patient') return <PatientSignup onBack={() => setView('role-select')} />
  if (view === 'volunteer') return <VolunteerSignup onBack={() => setView('role-select')} />

  if (view === 'role-select') {
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
            <h2 style={{
              fontFamily: 'Syne',
              fontSize: 24,
              fontWeight: 800,
              color: '#1e3a5f',
              marginBottom: 8,
            }}>
              Choose Your Role
            </h2>
            <p style={{ color: '#64748b', fontSize: 13 }}>
              Select your role to begin registration
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setView('admin')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #1e3a5f',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#1e3a5f10'
                e.target.style.borderColor = '#1e3a5f'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#1e3a5f'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>👤</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>Admin</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Manage patients, donors, and blood stock</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setView('donor')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #7f1d1d',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#7f1d1d10'
                e.target.style.borderColor = '#7f1d1d'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#7f1d1d'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>🩸</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#7f1d1d' }}>Donor</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Save lives through blood donation</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setView('patient')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #0c4a6e',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0c4a6e10'
                e.target.style.borderColor = '#0c4a6e'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#0c4a6e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>🏥</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e' }}>Patient</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Access blood donation coordination</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setView('volunteer')}
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #1e3a5f',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#1e3a5f10'
                e.target.style.borderColor = '#1e3a5f'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#1e3a5f'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>🤝</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>Volunteer</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Coordinate donor-patient bridges</div>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setView('login')}
            style={{
              marginTop: 20,
              width: '100%',
              padding: 12,
              borderRadius: 8,
              background: '#fff',
              color: '#64748b',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff'
            }}
          >
            ← Back to Login
          </button>
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
        maxWidth: 400,
        width: '100%',
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontFamily: 'Syne',
            fontSize: 32,
            fontWeight: 800,
            color: '#1e3a5f',
            marginBottom: 8,
          }}>
            BloodBridge<span style={{ color: '#764ba2' }}>AI</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Connecting blood donors with those who need it most
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              background: loading ? '#9ca3af' : '#764ba2',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#6b3a8f'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#764ba2'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <button
            onClick={() => setView('role-select')}
            style={{
              background: 'none',
              border: 'none',
              color: '#764ba2',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            New user? Create an account
          </button>
          <p style={{ marginTop: 8 }}>Your role will be determined automatically based on your account</p>
          <p style={{ marginTop: 4 }}>Demo: Enter any email and password to login</p>
        </div>
      </div>
    </div>
  )
}
