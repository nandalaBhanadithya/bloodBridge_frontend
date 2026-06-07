import { useNavigate } from 'react-router-dom'

export default function Landing() {
  console.log('Landing.jsx: Rendering Landing component')
  const navigate = useNavigate()

  const handleDonateClick = () => navigate('/signup')
  const handlePatientClick = () => navigate('/signup')
  const handleLoginClick = () => navigate('/login')

  const handleDonateMouseEnter = (e) => { e.target.style.background = '#B91C1C' }
  const handleDonateMouseLeave = (e) => { e.target.style.background = '#DC2626' }
  const handlePatientMouseEnter = (e) => { e.target.style.background = '#1D4ED8' }
  const handlePatientMouseLeave = (e) => { e.target.style.background = '#2563EB' }
  const handleLoginMouseEnter = (e) => { e.target.style.background = 'rgba(255,255,255,0.1)' }
  const handleLoginMouseLeave = (e) => { e.target.style.background = 'transparent' }

  console.log('Landing.jsx: About to return JSX')
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 48,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 16,
        }}>
          BloodBridge<span style={{ color: '#60A5FA' }}>AI</span>
        </h1>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 24,
          fontWeight: 600,
          color: '#fff',
          marginBottom: 8,
        }}>
          Blood, on time, every time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
        <button
          onClick={handleDonateClick}
          onMouseEnter={handleDonateMouseEnter}
          onMouseLeave={handleDonateMouseLeave}
          style={{
            padding: '16px 32px',
            borderRadius: 12,
            background: '#DC2626',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          I want to donate blood
        </button>
        <button
          onClick={handlePatientClick}
          onMouseEnter={handlePatientMouseEnter}
          onMouseLeave={handlePatientMouseLeave}
          style={{
            padding: '16px 32px',
            borderRadius: 12,
            background: '#2563EB',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          My patient needs help
        </button>
      </div>

      <button
        onClick={handleLoginClick}
        onMouseEnter={handleLoginMouseEnter}
        onMouseLeave={handleLoginMouseLeave}
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          padding: '12px 24px',
          borderRadius: 8,
          background: 'transparent',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          border: '2px solid #fff',
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          transition: 'all 0.2s',
        }}
      >
        Login
      </button>

      <div style={{
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
        <p style={{ marginBottom: 8 }}>Blood Warriors staff? Login with your invite credentials.</p>
        <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>1,334</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Donors</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>84</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Patients Protected</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>2,847</div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Units Coordinated</div>
          </div>
        </div>
      </div>
    </div>
  )
}
