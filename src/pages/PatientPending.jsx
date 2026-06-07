import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PatientPending() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: 500,
        width: '100%',
        padding: 48,
        textAlign: 'center',
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#0c4a6e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <span style={{ fontSize: 40 }}>⏳</span>
        </div>

        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 24,
          fontWeight: 800,
          color: '#0c4a6e',
          marginBottom: 16,
        }}>
          Your registration is being reviewed
        </h2>

        <p style={{
          fontSize: 14,
          color: '#64748B',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          Blood Warriors team will verify your medical report and set up your care plan. You'll get a WhatsApp message when ready.
        </p>

        <div style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#0369A1',
            marginBottom: 12,
          }}>
            Your submitted details
          </div>
          <div style={{ fontSize: 13, color: '#0C4A6E', marginBottom: 8 }}>
            <strong>Blood Group:</strong> B+
          </div>
          <div style={{ fontSize: 13, color: '#0C4A6E' }}>
            <strong>Hospital Preference:</strong> City Hospital
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            background: '#0c4a6e',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.background = '#075985'}
          onMouseLeave={(e) => e.target.style.background = '#0c4a6e'}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
