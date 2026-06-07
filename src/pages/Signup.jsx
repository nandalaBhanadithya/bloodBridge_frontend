import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'A1+', 'A2+', 'A1B+', 'A2B-', 'A2B+', 'Bombay', "I don't know yet"]

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [accountForm, setAccountForm] = useState({
    email: '',
    password: '',
    phone: '',
  })

  const [donorForm, setDonorForm] = useState({
    bloodGroup: '',
  })

  const [patientForm, setPatientForm] = useState({
    fullName: '',
    bloodGroup: '',
    hospital: '',
    frequency: '',
  })

  const [medicalReport, setMedicalReport] = useState(null)

  const handleRoleSelect = (role) => {
    // Map UI role to expected role values
    const roleMap = {
      'Donor': 'Bridge Donor',
      'Patient': 'Patient',
      'Volunteer': 'Volunteer',
      'Admin': 'admin',
    }
    setSelectedRole(roleMap[role] || role)
  }

  const handleContinue = () => {
    if (!selectedRole) return
    if (selectedRole === 'Patient') {
      setStep(2) // Go to patient step 2b-1
    } else {
      setStep(3) // Go to step 2a for donor/volunteer/admin
    }
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!accountForm.email || !accountForm.password || !accountForm.phone) {
      setError('Please fill in all fields')
      return
    }

    if (accountForm.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)

      const metadata = {
        role: selectedRole,
      }

      console.log('Signup: Creating user with simplified metadata:', metadata)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: accountForm.email,
        password: accountForm.password,
        options: {
          data: metadata,
        },
      })

      if (signUpError) {
        console.error('Signup: Supabase error:', signUpError)
        console.error('Signup: Error details:', JSON.stringify(signUpError, null, 2))
        throw signUpError
      }

      // Show success message
      setStep(4)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientAccountSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!accountForm.email || !accountForm.password || !accountForm.phone) {
      setError('Please fill in all fields')
      return
    }

    if (accountForm.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: accountForm.email,
        password: accountForm.password,
        options: {
          data: {
            role: 'Patient',
            phone: accountForm.phone,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      setStep(3) // Go to patient step 2b-2 (medical details)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientMedicalSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!patientForm.fullName || !patientForm.bloodGroup || !patientForm.hospital) {
      setError('Please fill in all required fields')
      return
    }

    setStep(4) // Go to patient step 2b-3 (upload report)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      return
    }

    setMedicalReport(file)
  }

  const handleMedicalReportSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!medicalReport) {
      setError('Please upload your medical report')
      return
    }

    try {
      setLoading(true)

      // Upload to Supabase Storage
      const fileName = `${Date.now()}_${medicalReport.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, medicalReport)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(fileName)

      // Submit to API
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          medical_report_url: publicUrl,
          onboarding_status: 'pending_verification',
          full_name: patientForm.fullName,
          blood_group: patientForm.bloodGroup,
          hospital_preference: patientForm.hospital,
          frequency_in_days: patientForm.frequency || null,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit patient registration')
      }

      setStep(5) // Success screen
    } catch (err) {
      console.error('Report upload error:', err)
      setError(err.message || 'Failed to upload report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Role Selection
  if (step === 1) {
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
          maxWidth: 480,
          width: '100%',
          padding: 40,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Who are you?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { role: 'Donor', icon: '🩸', label: "I'm a donor", desc: "I want to donate blood to help patients" },
              { role: 'Patient', icon: '💙', label: "I need blood", desc: "I or my family member needs regular transfusions" },
              { role: 'Volunteer', icon: '🤝', label: "I'm a volunteer", desc: "I coordinate between donors and patients" },
              { role: 'Admin', icon: '🏥', label: "I'm Blood Warriors staff", desc: "I manage the coordination system" },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleSelect(item.role)}
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: selectedRole === item.role ? '2px solid #DC2626' : '2px solid #E2E8F0',
                  background: selectedRole === item.role ? '#FEF2F2' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{item.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              background: selectedRole ? '#2563EB' : '#CBD5E1',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Continue
          </button>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
            Already have an account? <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>Login</button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2a: Donor/Volunteer/Admin Account Creation
  if (step === 3 && selectedRole !== 'Patient') {
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
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Create {selectedRole} Account
            </h2>
          </div>

          <form onSubmit={handleAccountSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Password (min 8 characters)
              </label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={accountForm.phone}
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                placeholder="+91XXXXXXXXXX"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            {selectedRole === 'Donor' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                  Blood Group
                </label>
                <select
                  value={donorForm.bloodGroup}
                  onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    fontSize: 14,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>← Back</button>
          </div>
        </div>
      </div>
    )
  }

  // Success screen for donor/volunteer/admin
  if (step === 4 && selectedRole !== 'Patient') {
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
          padding: 48,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✓</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#16A34A',
            marginBottom: 16,
          }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>
            We've sent a verification link to your email. Click it to verify your account, then login.
          </p>
          {selectedRole === 'Volunteer' || selectedRole === 'Admin' ? (
            <p style={{ fontSize: 13, color: '#D97706', marginBottom: 24 }}>
              Note: Your account will need admin approval before you can access the dashboard.
            </p>
          ) : null}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: '#2563EB',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Patient Step 2b-1: Account
  if (step === 2 && selectedRole === 'Patient') {
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
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Step 1 of 3: Account
            </h2>
          </div>

          <form onSubmit={handlePatientAccountSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Password (min 8 characters)
              </label>
              <input
                type="password"
                value={accountForm.password}
                onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={accountForm.phone}
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                placeholder="+91XXXXXXXXXX"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
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
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>← Back</button>
          </div>
        </div>
      </div>
    )
  }

  // Patient Step 2b-2: Medical Details
  if (step === 3 && selectedRole === 'Patient') {
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
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Step 2 of 3: Medical Details
            </h2>
          </div>

          <form onSubmit={handlePatientMedicalSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientForm.fullName}
                onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                placeholder="Full name"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Blood Group
              </label>
              <select
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Hospital Preference
              </label>
              <select
                value={patientForm.hospital}
                onChange={(e) => setPatientForm({ ...patientForm, hospital: e.target.value })}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <option value="">Select hospital</option>
                <option value="City Hospital">City Hospital</option>
                <option value="Gandhi Hospital">Gandhi Hospital</option>
                <option value="Nampally Center">Nampally Center</option>
                <option value="Secunderabad Medical">Secunderabad Medical</option>
                <option value="Ameerpet Clinic">Ameerpet Clinic</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Frequency (optional)
              </label>
              <input
                type="text"
                value={patientForm.frequency}
                onChange={(e) => setPatientForm({ ...patientForm, frequency: e.target.value })}
                placeholder="e.g., every 21 days"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 14,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
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
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
            <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>← Back</button>
          </div>
        </div>
      </div>
    )
  }

  // Patient Step 2b-3: Upload Medical Report
  if (step === 4 && selectedRole === 'Patient') {
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
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Step 3 of 3: Upload Medical Report
            </h2>
          </div>

          <form onSubmit={handleMedicalReportSubmit}>
            <div
              style={{
                border: '2px dashed #BFDBFE',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                marginBottom: 24,
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>
                Upload your doctor's prescription or transfusion record (PDF)
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8' }}>Max 5MB, PDF only</p>
              {medicalReport && (
                <p style={{ fontSize: 12, color: '#16A34A', marginTop: 12 }}>
                  ✓ {medicalReport.name}
                </p>
              )}
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !medicalReport}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                background: loading || !medicalReport ? '#9CA3AF' : '#2563EB',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: loading || !medicalReport ? 'not-allowed' : 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {loading ? 'Uploading...' : 'Submit Registration'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
            <button type="button" onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>← Back</button>
          </div>
        </div>
      </div>
    )
  }

  // Patient Success Screen
  if (step === 5 && selectedRole === 'Patient') {
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
          maxWidth: 480,
          width: '100%',
          padding: 48,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✓</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 24,
            fontWeight: 800,
            color: '#0c4a6e',
            marginBottom: 16,
          }}>
            Thank you!
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
            Your registration is being reviewed by Blood Warriors team. You'll receive a WhatsApp message once approved — usually within 24 hours.
          </p>
          <button
            onClick={() => navigate('/login')}
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
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}
