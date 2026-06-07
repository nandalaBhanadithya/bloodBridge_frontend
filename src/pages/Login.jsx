import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    try {
      setLoading(true)
      
      // Sign in with Supabase
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (!session) {
        throw new Error('No session returned')
      }

      // Fetch user profile to get role from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Failed to fetch user profile')
      }

      // Get user metadata for role
      const role = user.user_metadata?.role || 'Patient'
      const onboardingStatus = user.user_metadata?.onboarding_status || 'pending_verification'

      console.log('Login: User role:', role)
      console.log('Login: User metadata:', user.user_metadata)

      // Redirect based on role and onboarding status
      if (role === 'admin') {
        navigate('/admin/overview')
      } else if (role === 'Bridge Donor' || role === 'Emergency Donor' || role === 'Guest') {
        navigate('/donor/dashboard')
      } else if (role === 'Patient') {
        if (onboardingStatus === 'pending_verification') {
          navigate('/patient/pending')
        } else if (onboardingStatus === 'approved') {
          navigate('/patient/dashboard')
        } else {
          navigate('/patient/pending')
        }
      } else if (role === 'Volunteer') {
        navigate('/volunteer/tasks')
      } else {
        console.log('Login: Unknown role, defaulting to Patient')
        navigate('/patient/pending')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: 420,
        width: '100%',
        padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: 8,
          }}>
            BloodBridge<span style={{ color: '#60A5FA' }}>AI</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>
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
                border: '1px solid #E2E8F0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
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
                border: '1px solid #E2E8F0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              color: '#991B1B',
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
              background: loading ? '#9CA3AF' : '#2563EB',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            New here? Create an account
          </button>
          <p style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {/* TODO: Implement password reset */}}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: 12,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
