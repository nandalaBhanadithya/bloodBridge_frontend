import { useState, useEffect } from 'react'
import Avatar from '../shared/Avatar'
import Badge from '../shared/Badge'
import { api } from '../../services/api'

export default function PriorityQueue({ compact = false, title = '⚑ New patient registrations — immediate review required' }) {
  const [patients, setPatients] = useState([])
  const [approved, setApproved] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPendingRegistrations()
  }, [])

  const loadPendingRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getPendingRegistrations()
      setPatients(data.patients || [])
    } catch (err) {
      console.error('Failed to load pending registrations:', err)
      setError('Failed to load registrations')
      // Use mock data for development when backend is not available
      setPatients([
        {
          id: 'KR',
          initials: 'KR',
          avatarBg: '#FEE2E2',
          avatarColor: '#991B1B',
          name: 'Kavya Reddy, age 8',
          urgency: 'br',
          urgencyLabel: 'URGENT',
          time: '2h ago',
          hospital: 'City Hospital',
          blood: 'B+',
          bg: '#FEF2F2',
          border: '#FECACA',
          btnClass: 'btn-red',
          ai: 'Beta-thalassemia major. 21-day cycle, 2 units/session. Kell typing recommended. No alloantibodies.',
        },
        {
          id: 'AS',
          initials: 'AS',
          avatarBg: '#FEF3C7',
          avatarColor: '#92400E',
          name: 'Arjun Sharma, age 12',
          urgency: 'ba',
          urgencyLabel: 'HIGH',
          time: '5h ago',
          hospital: 'Gandhi Hospital',
          blood: 'O+',
          bg: '#FFFBEB',
          border: '#FDE68A',
          btnClass: 'btn-amber',
          ai: 'Thalassemia major. 28-day cycle, 1 unit. No antibodies. O+ pool is large at Gandhi (920 donors).',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id) => {
    try {
      await api.approvePatient(id)
      setApproved((prev) => ({ ...prev, [id]: true }))
      // Remove approved patient from list after a short delay
      setTimeout(() => {
        setPatients((prev) => prev.filter((p) => p.id !== id))
      }, 500)
    } catch (err) {
      console.error('Failed to approve patient:', err)
      alert('Failed to approve patient. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="pq-wrap">
        <div className="pq-head">
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{title}</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', marginLeft: 'auto' }}>
            Loading...
          </span>
        </div>
        <div style={{ padding: 20, textAlign: 'center', color: '#fff' }}>Loading pending registrations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pq-wrap">
        <div className="pq-head">
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{title}</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', marginLeft: 'auto' }}>
            Error
          </span>
        </div>
        <div style={{ padding: 20, textAlign: 'center', color: '#fff' }}>{error}</div>
      </div>
    )
  }

  const pendingCount = patients.length

  return (
    <div className="pq-wrap">
      <div className="pq-head">
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{title}</span>
        <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', marginLeft: 'auto' }}>
          {pendingCount} pending
        </span>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {patients.map((p) => {
          const isApproved = approved[p.id]
          const rowBg = isApproved ? '#F0FDF4' : p.bg
          const rowBorder = isApproved ? '#86EFAC' : p.border

          if (compact) {
            return (
              <div
                key={p.id}
                id={`pr-${p.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: rowBg,
                  border: `1px solid ${rowBorder}`,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <Avatar initials={p.initials} bg={p.avatarBg} color={p.avatarColor} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {p.hospital} · {p.blood} · AI: {p.ai.split('.')[0].replace('AI extracted: ', '')}
                  </div>
                </div>
                <Badge variant={p.urgency}>{p.urgencyLabel}</Badge>
                <button
                  className={`btn ${isApproved ? 'btn-green btn-disabled' : p.btnClass}`}
                  onClick={() => approve(p.id)}
                >
                  {isApproved ? 'Approved ✓' : 'Approve & onboard'}
                </button>
                <button className="btn btn-ghost" style={{ fontSize: 11 }}>Adjust</button>
              </div>
            )
          }

          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: 12,
                background: rowBg,
                border: `1px solid ${rowBorder}`,
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Avatar initials={p.initials} bg={p.avatarBg} color={p.avatarColor} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                  <Badge variant={p.urgency}>{p.urgencyLabel}</Badge>
                  <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{p.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
                  {p.hospital} · <strong>{p.blood}</strong>
                </div>
                <div style={{ fontSize: 11, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--muted)' }}>AI extracted: </span>
                  {p.ai}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                <button
                  className={`btn ${isApproved ? 'btn-green btn-disabled' : p.btnClass}`}
                  onClick={() => approve(p.id)}
                >
                  {isApproved ? 'Approved ✓' : 'Approve & onboard'}
                </button>
                <button className="btn btn-ghost" style={{ fontSize: 11 }}>Adjust details</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
