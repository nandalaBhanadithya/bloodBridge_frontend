import { useState, useEffect } from 'react'
import ProgressBar from '../../shared/ProgressBar'
import { api } from '../../../services/api'

export default function DashboardTab() {
  const [donorData, setDonorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDisbandModal, setShowDisbandModal] = useState(false)
  const [disbandReason, setDisbandReason] = useState('')
  const [disbanding, setDisbanding] = useState(false)

  useEffect(() => {
    loadDonorData()
  }, [])

  const loadDonorData = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get the donor ID from auth context
      const data = await api.getDonors()
      // For now, use first donor or mock data
      setDonorData(data.donors?.[0] || {
        eligibility_pct: 30,
        eligible_date: 'Jun 15',
        days_left: 9,
        next_transfusion: 'Jun 20',
        blood_stored: 1,
        blood_target: 2,
        donations_done: 5,
        next_milestone: 10,
        units_donated: 5,
        days_protection: 365,
        lives_protected: 1,
        years_donating: 2,
        status: 'active',
      })
    } catch (err) {
      console.error('Failed to load donor data:', err)
      // Use mock data for development
      setDonorData({
        eligibility_pct: 30,
        eligible_date: 'Jun 15',
        days_left: 9,
        next_transfusion: 'Jun 20',
        blood_stored: 1,
        blood_target: 2,
        donations_done: 5,
        next_milestone: 10,
        units_donated: 5,
        days_protection: 365,
        lives_protected: 1,
        years_donating: 2,
        status: 'active',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDisband = async () => {
    if (!disbandReason) {
      alert('Please select a reason')
      return
    }

    try {
      setDisbanding(true)
      // In a real app, you'd get the donor ID from auth context
      await api.reportMedicalDisband('donor_id', disbandReason)
      setShowDisbandModal(false)
      setDisbandReason('')
      alert('Your request has been submitted. You will be removed from the donation program.')
      // In production, this would log the user out
    } catch (err) {
      console.error('Failed to submit disband request:', err)
      alert('Failed to submit request. Please try again.')
    } finally {
      setDisbanding(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading donor data...</div>
  }

  const milestonePct = (donorData.donations_done / donorData.next_milestone) * 100
  const bloodPct = (donorData.blood_stored / donorData.blood_target) * 100

  if (donorData.status === 'disbanded') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <h2 style={{
          fontFamily: 'Syne',
          fontSize: 24,
          fontWeight: 800,
          color: '#7f1d1d',
          marginBottom: 8,
        }}>
          Account Disbanded
        </h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Your donation account has been deactivated. Thank you for your service.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="g3">
        <div className="card" style={{ borderTop: '3px solid #DC2626' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Eligibility</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="26" cy="26" r="22" fill="none" stroke="#DC2626" strokeWidth="4" strokeDasharray="138.2" strokeDashoffset={138.2 * (1 - donorData.eligibility_pct / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
              <text x="26" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0F172A" fontFamily="system-ui">{donorData.eligibility_pct}%</text>
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>In cooldown</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Eligible {donorData.eligible_date}</div>
              <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>{donorData.days_left} days left</div>
            </div>
          </div>
          <ProgressBar pct={donorData.eligibility_pct} color="#DC2626" />
        </div>
        <div className="card" style={{ borderTop: '3px solid #D97706' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Ramu&apos;s next need</div>
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 9, padding: 11, textAlign: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#92400E' }}>{donorData.next_transfusion}</div>
            <div style={{ fontSize: 11, color: '#B45309' }}>City Hospital · B+ · {donorData.blood_target} units</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Blood stored:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <ProgressBar pct={bloodPct} color="#D97706" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>{donorData.blood_stored}/{donorData.blood_target}</span>
          </div>
          <button className="btn btn-disabled btn-red" style={{ width: '100%', marginTop: 10, fontSize: 11 }}>Book slot (eligible {donorData.eligible_date})</button>
        </div>
        <div className="card" style={{ borderTop: '3px solid #7C3AED' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Milestone journey</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
            <div style={{ flex: 1, textAlign: 'center', background: '#F5F3FF', borderRadius: 7, padding: 8 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: '#5B21B6' }}>{donorData.donations_done}</div>
              <div style={{ fontSize: 10, color: '#6D28D9' }}>Done</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: '#F5F3FF', borderRadius: 7, padding: 8 }}>
              <div style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 800, color: '#5B21B6' }}>{donorData.next_milestone}</div>
              <div style={{ fontSize: 10, color: '#6D28D9' }}>Next badge</div>
            </div>
          </div>
          <ProgressBar pct={milestonePct} color="#7C3AED" />
          <div style={{ marginTop: 9, background: '#F5F3FF', borderRadius: 7, padding: 8, fontSize: 11, color: '#5B21B6', fontWeight: 700 }}>
            Art Workshop unlocked! RSVP via WhatsApp.
          </div>
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>Total impact</div>
        <div style={{ display: 'flex' }}>
          {[
            { v: donorData.units_donated, c: '#DC2626', l: 'Units donated' },
            { v: donorData.days_protection, c: '#16A34A', l: 'Days of protection' },
            { v: donorData.lives_protected, c: '#D97706', l: 'Life protected' },
            { v: donorData.years_donating, c: '#7C3AED', l: 'Years donating' },
          ].map((s, i) => (
            <div key={s.l} style={{ flex: 1, textAlign: 'center', padding: 12, borderRight: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {showDisbandModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            maxWidth: 400,
            width: '90%',
          }}>
            <h3 style={{
              fontFamily: 'Syne',
              fontSize: 18,
              fontWeight: 800,
              color: '#7f1d1d',
              marginBottom: 12,
            }}>
              Request Account Disband
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              If you can no longer donate due to medical reasons, please select a reason below. Your information will be kept private and you will be removed from all donation communications.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 8,
              }}>
                Reason for disband
              </label>
              <select
                value={disbandReason}
                onChange={(e) => setDisbandReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  outline: 'none',
                }}
              >
                <option value="">Select a reason</option>
                <option value="medical_permanent">Medical reason (permanent)</option>
                <option value="medical_temporary">Medical reason (temporary)</option>
                <option value="personal">Personal reasons</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setShowDisbandModal(false); setDisbandReason('') }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#64748b',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDisband}
                disabled={disbanding}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  background: disbanding ? '#9ca3af' : '#DC2626',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: disbanding ? 'not-allowed' : 'pointer',
                }}
              >
                {disbanding ? 'Submitting...' : 'Confirm Disband'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <button
          onClick={() => setShowDisbandModal(true)}
          style={{
            fontSize: 11,
            color: '#64748b',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Unable to donate? Request account disband
        </button>
      </div>
    </>
  )
}
