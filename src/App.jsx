import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import AdminShell from './components/admin/AdminShell'
import DonorShell from './components/donor/DonorShell'
import PatientShell from './components/patient/PatientShell'
import VolunteerShell from './components/volunteer/VolunteerShell'

const VIEWS = {
  admin: AdminShell,
  donor: DonorShell,
  patient: PatientShell,
  volunteer: VolunteerShell,
}

function AppContent() {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ color: '#fff', fontSize: 18 }}>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const View = VIEWS[role]

  if (!View) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ color: '#fff', fontSize: 18 }}>Invalid role</div>
      </div>
    )
  }

  return <View />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
