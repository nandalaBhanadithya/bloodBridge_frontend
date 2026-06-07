import { useState, useEffect } from 'react'
import ConfirmationCard from '../ConfirmationCard'
import Badge from '../../shared/Badge'
import Avatar from '../../shared/Avatar'
import { api } from '../../../services/api'

export default function PatientDashboardTab({ onMeetupClick }) {
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatientData()
  }, [])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get the patient ID from auth context
      const data = await api.getPatients()
      // For now, use first patient or mock data
      setPatientData(data.patients?.[0] || {
        transfusions: [
          { day: '09', month: 'Jun', monthColor: '#16A34A', dayColor: '#166534', bg: '#F0FDF4', border: '#86EFAC', title: 'Next transfusion', badge: 'bg', badgeText: 'Blood ready ✓', sub: '1 unit O+ · City Hospital' },
          { day: '30', month: 'Jun', title: 'Scheduled', badge: 'bb', badgeText: 'Upcoming', sub: 'Outreach starts Jun 23' },
          { day: '21', month: 'Jul', muted: true, title: 'Future cycle', sub: '21-day interval continues' },
        ],
        donors: [
          { i: 'D1', bg: '#DCFCE7', c: '#166534', name: 'Donor A · 8 donations', sub: 'Eligible now', rowBg: '#F0FDF4', dot: 'dg' },
          { i: 'D2', bg: '#FEF3C7', c: '#92400E', name: 'Donor B · 3 donations', sub: 'Cooldown · eligible Jun 18', rowBg: '#FFFBEB', dot: 'da' },
          { i: 'D3', bg: '#DCFCE7', c: '#166534', name: 'Donor C · 5 donations', sub: 'Eligible now', rowBg: '#F0FDF4', dot: 'dg' },
        ],
      })
    } catch (err) {
      console.error('Failed to load patient data:', err)
      // Use mock data for development
      setPatientData({
        transfusions: [
          { day: '09', month: 'Jun', monthColor: '#16A34A', dayColor: '#166534', bg: '#F0FDF4', border: '#86EFAC', title: 'Next transfusion', badge: 'bg', badgeText: 'Blood ready ✓', sub: '1 unit O+ · City Hospital' },
          { day: '30', month: 'Jun', title: 'Scheduled', badge: 'bb', badgeText: 'Upcoming', sub: 'Outreach starts Jun 23' },
          { day: '21', month: 'Jul', muted: true, title: 'Future cycle', sub: '21-day interval continues' },
        ],
        donors: [
          { i: 'D1', bg: '#DCFCE7', c: '#166534', name: 'Donor A · 8 donations', sub: 'Eligible now', rowBg: '#F0FDF4', dot: 'dg' },
          { i: 'D2', bg: '#FEF3C7', c: '#92400E', name: 'Donor B · 3 donations', sub: 'Cooldown · eligible Jun 18', rowBg: '#FFFBEB', dot: 'da' },
          { i: 'D3', bg: '#DCFCE7', c: '#166534', name: 'Donor C · 5 donations', sub: 'Eligible now', rowBg: '#F0FDF4', dot: 'dg' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading patient data...</div>
  }

  const transfusions = patientData.transfusions
  const donors = patientData.donors

  return (
    <>
      <ConfirmationCard />
      <div className="g2">
        <div className="card">
          <div className="ctitle" style={{ color: '#0C4A6E' }}>Next 3 transfusions</div>
          {transfusions.map((t) => (
            <div key={t.day + t.month} className="titem">
              <div
                className="datebox"
                style={t.bg ? { background: t.bg, borderColor: t.border } : {}}
              >
                <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, color: t.muted ? '#94A3B8' : (t.dayColor || '#374151') }}>{t.day}</div>
                <div style={{ fontSize: 9, color: t.muted ? '#94A3B8' : (t.monthColor || 'var(--muted)') }}>{t.month}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontWeight: 600, color: t.muted ? '#94A3B8' : undefined }}>{t.title}</span>
                  {t.badge && <Badge variant={t.badge}>{t.badgeText}</Badge>}
                </div>
                <div style={{ fontSize: 11, color: t.muted ? '#94A3B8' : 'var(--muted)' }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="ctitle" style={{ color: '#0C4A6E' }}>Your donor team · 3 donors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {donors.map((d) => (
              <div key={d.i} style={{ background: d.rowBg, borderRadius: 8, padding: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar initials={d.i} bg={d.bg} color={d.c} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.c }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: d.dot === 'dg' ? '#16A34A' : '#D97706' }}>{d.sub}</div>
                </div>
                <span className={`dot ${d.dot}`} />
              </div>
            ))}
          </div>
          <button className="btn btn-outline-cyan" style={{ width: '100%', marginTop: 11 }} onClick={onMeetupClick}>
            Invite my team to meet
          </button>
        </div>
      </div>
    </>
  )
}
