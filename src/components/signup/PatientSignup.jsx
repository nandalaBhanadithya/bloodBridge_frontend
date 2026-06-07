import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

export default function PatientSignup({ onBack }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image (JPG, PNG) or PDF file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setPrescriptionFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!prescriptionFile) {
      setError('Please upload your doctor\'s prescription card')
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
      setAnalyzing(true)
      
      // Submit to backend with prescription file
      await api.signupPatient(formData, prescriptionFile)
      
      setAnalyzing(false)
      setSuccess(true)
      
      // Note: Patient accounts require admin approval before login
      // User will be redirected to login after approval
    } catch (err) {
      setAnalyzing(false)
      setError('Signup failed. Please check your information and try again.')
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
          maxWidth: 450,
          width: '100%',
          padding: 40,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{
            fontFamily: 'Syne',
            fontSize: 24,
            fontWeight: 800,
            color: '#0c4a6e',
            marginBottom: 8,
          }}>
            Registration Submitted
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
            Your prescription is being analyzed by our AI system. An admin will review your information and approve your account.
          </p>
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: '#166534',
          }}>
            You will receive a confirmation via WhatsApp once your account is approved.
          </div>
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
            color: '#0c4a6e',
            marginBottom: 8,
          }}>
            Patient Registration
          </h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Register to access blood donation coordination
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
              placeholder="Priya Sharma"
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
              onFocus={(e) => e.target.style.borderColor = '#0c4a6e'}
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
              onFocus={(e) => e.target.style.borderColor = '#0c4a6e'}
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
              placeholder="priya@example.com"
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
              onFocus={(e) => e.target.style.borderColor = '#0c4a6e'}
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
              onFocus={(e) => e.target.style.borderColor = '#0c4a6e'}
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
              onFocus={(e) => e.target.style.borderColor = '#0c4a6e'}
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
              Doctor's Prescription Card <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onClick={() => document.getElementById('prescription-upload').click()}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#0c4a6e'
                e.target.style.background = '#F0F9FF'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.background = '#fff'
              }}
            >
              <input
                id="prescription-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {prescriptionFile ? (
                <div>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0c4a6e' }}>
                    {prescriptionFile.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                    Upload Prescription
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    JPG, PNG, or PDF (max 5MB)
                  </div>
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
              Our AI will extract your blood group and transfusion details from the prescription
            </div>
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
              background: loading ? '#9ca3af' : '#0c4a6e',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#0c4a6e'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#0c4a6e'
            }}
          >
            {analyzing ? 'Analyzing Prescription...' : loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          <p>Already have an account? <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0c4a6e', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Login</button></p>
        </div>
      </div>
    </div>
  )
}
