import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PatientPending from './pages/PatientPending'
import { ProtectedRoute } from './components/ProtectedRoute'
import AdminShell from './components/admin/AdminShell'
import DonorShell from './components/donor/DonorShell'
import PatientShell from './components/patient/PatientShell'
import VolunteerShell from './components/volunteer/VolunteerShell'

export default function App() {
  console.log('App.jsx: Rendering App component')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/pending" element={<PatientPending />} />

        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminShell />
          </ProtectedRoute>
        } />
        <Route path="/donor/*" element={
          <ProtectedRoute allowedRoles={['Guest', 'Bridge Donor', 'Emergency Donor']}>
            <DonorShell />
          </ProtectedRoute>
        } />
        <Route path="/patient/*" element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <PatientShell />
          </ProtectedRoute>
        } />
        <Route path="/volunteer/*" element={
          <ProtectedRoute allowedRoles={['Volunteer']}>
            <VolunteerShell />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
