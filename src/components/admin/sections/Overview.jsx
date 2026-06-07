import { useState, useEffect } from 'react'
import MetricCard from '../../shared/MetricCard'
import FeedItem from '../../shared/FeedItem'
import { api } from '../../../services/api'

function PriorityQueue() {
  const registrations = [
    { id: 1, name: 'Ravi Kumar', bloodGroup: 'B+', hospital: 'City Hospital', submitted: '2h ago', priority: 'high' },
    { id: 2, name: 'Sunita Reddy', bloodGroup: 'O+', hospital: 'Gandhi Hospital', submitted: '5h ago', priority: 'medium' },
    { id: 3, name: 'Anonymous', bloodGroup: 'A+', hospital: 'Ameerpet Clinic', submitted: '1d ago', priority: 'high' },
  ]

  return (
    <div className="pq-wrap">
      <div className="pq-head">
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>⚑ New registrations needing review</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{registrations.length} pending</span>
      </div>
      {registrations.map((reg) => (
        <div key={reg.id} style={{ padding: '12px 18px', borderBottom: '1px solid #FEF2F2', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: reg.priority === 'high' ? '#FEF2F2' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: reg.priority === 'high' ? '#DC2626' : '#64748B' }}>
            {reg.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{reg.name}</div>
            <div style={{ fontSize: 10, color: '#64748B' }}>{reg.bloodGroup} · {reg.hospital} · {reg.submitted}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 12px', borderRadius: 6, background: '#16A34A', color: '#fff', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Approve</button>
            <button style={{ padding: '6px 12px', borderRadius: 6, background: 'transparent', color: '#64748B', fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', cursor: 'pointer' }}>Review</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Heatmap({ size = 'large', timestampOnly = false }) {
  const viewBox = size === 'large' ? '0 0 420 300' : '0 0 300 230'
  
  if (timestampOnly) {
    return <span style={{ fontSize: 10, color: '#64748B', marginLeft: 'auto' }}>Updated 2m ago</span>
  }
  
  return (
    <svg viewBox={viewBox} style={{ width: '100%', height: 'auto' }}>
      <rect width="420" height="300" fill="#F8FAFC" />
      <circle cx="201" cy="163" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="255" cy="173" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="191" cy="218" r="32" fill="#D97706" opacity="0.55" />
      <circle cx="229" cy="43" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="42" cy="123" r="32" fill="#DC2626" opacity="0.55" className="cring" />
      <text x="201" y="163" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">City</text>
      <text x="255" y="173" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Gandhi</text>
      <text x="191" y="218" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Nampally</text>
      <text x="229" y="43" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Secunderabad</text>
      <text x="42" y="123" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Ameerpet</text>
    </svg>
  )
}

export default function Overview({ totalUnits }) {
  const [overviewData, setOverviewData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOverviewData()
  }, [])

  const loadOverviewData = async () => {
    try {
      setLoading(true)
      const data = await api.getAnalyticsReport()
      setOverviewData(data)
    } catch (err) {
      console.error('Failed to load overview data:', err)
      // Use mock data for development when backend is not available
      setOverviewData({
        active_bridges: 80,
        critical_zones: 1,
        transfusions_in_5_days: 12,
        new_donors_this_week: 8,
        guest_conversion: { contacted: 180, responded: 47, converted: 3 },
        outcomes: { successful: 94, missed: 6 },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PriorityQueue />
      <div className="g4">
        <MetricCard value={overviewData?.active_bridges || 80} label="Active bridges" sub={{ text: '+2 this week', style: { color: '#16A34A' } }} />
        <MetricCard
          value={overviewData?.critical_zones || 1}
          label="Critical density zones"
          valueColor="#DC2626"
          borderLeft="#DC2626"
          sub={{ text: 'Ameerpet · 0 donors', style: { color: '#DC2626', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }, blink: true }}
        />
        <MetricCard
          value={overviewData?.transfusions_in_5_days || 12}
          label="Transfusions in 5 days"
          valueColor="#D97706"
          sub={{ text: <><span id="mu">{totalUnits}</span> units stored</>, style: { color: 'var(--muted)' } }}
        />
        <MetricCard value={overviewData?.new_donors_this_week || 8} label="New donors this week" sub={{ text: '3 guests converted', style: { color: '#16A34A' } }} />
      </div>
      <div className="g2">
        <div className="card">
          <div className="ctitle"><span className="dot dg blink" />Patient activity</div>
          <FeedItem initials="RK" avatarBg="#DCFCE7" avatarColor="#166534" name="Ramu K." badges={[{ variant: 'bg', text: 'Done ✓' }]} subtitle="B+ · 2u · Today 10:30 AM" />
          <FeedItem initials="PM" avatarBg="#EFF6FF" avatarColor="#1D4ED8" name="Priya M." badges={[{ variant: 'bb', text: '3 days' }, { variant: 'bg', text: 'Blood ready', mlAuto: true }]} subtitle="O+ · Jun 9 · 1/1 unit" />
          <FeedItem initials="AB" avatarBg="#FFFBEB" avatarColor="#92400E" name="Asha B." badges={[{ variant: 'ba', text: '5 days' }, { variant: 'br', text: '0 units', mlAuto: true }]} subtitle="A+ · Jun 11 · Cascade T3 active" />
          <FeedItem initials="VP" avatarBg="#FEF2F2" avatarColor="#991B1B" name="Vikram P." badges={[{ variant: 'br', text: 'Missed → rescheduled' }]} subtitle="AB+ · Jun 4 · Failure log entry" />
        </div>
        <div className="card">
          <div className="ctitle"><span className="dot db" />Donor activity</div>
          <FeedItem initials="SK" avatarBg="#FEF3C7" avatarColor="#B45309" name="Suresh K." badges={[{ variant: 'ba', text: '5th milestone 🎉' }]} subtitle="B+ · Art Workshop invite sent · 2h ago" />
          <FeedItem initials="LT" avatarBg="#DCFCE7" avatarColor="#166534" name="Lakshmi T." badges={[{ variant: 'bg', text: 'Joined Team Ramu' }]} subtitle="O+ · Integration event due Jun 14" />
          <FeedItem initials="RB" avatarBg="#EDE9FE" avatarColor="#6D28D9" name="Ramesh B." badges={[{ variant: 'bp', text: 'First donation' }]} subtitle={<>A+ · <span style={{ color: '#D97706', fontWeight: 600 }}>Blood test pending</span></>} />
          <div style={{ marginTop: 10, background: '#F8FAFC', borderRadius: 8, padding: 11 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Guest → Donor this month</div>
            <div style={{ display: 'flex', gap: 0, textAlign: 'center' }}>
              <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800 }}>{overviewData?.guest_conversion?.contacted || 180}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Contacted</div>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: '#D97706' }}>{overviewData?.guest_conversion?.responded || 47}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Responded</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 800, color: '#16A34A' }}>{overviewData?.guest_conversion?.converted || 3}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Converted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="g32">
        <div className="card">
          <div className="ctitle">
            <span className="dot dr blink" />
            Live density map · Hyderabad
            <Heatmap size="overview" timestampOnly />
          </div>
          <Heatmap size="overview" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="ctitle">Upcoming events</div>
            <div className="feed">
              <div style={{ width: 32, height: 32, background: '#EDE9FE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>🎨</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>Team Ramu Art Workshop</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Jun 10 · BW HQ · Vol: Lakshmi</div>
                <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>12 RSVPs confirmed</div>
              </div>
            </div>
            <div className="feed">
              <div style={{ width: 32, height: 32, background: '#F0FDF4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>🤝</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>City Hospital Group Meetup</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Jun 16 · City Hospital · COMBINED</div>
                <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Teams Ramu + Priya · 2 volunteers</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="ctitle">Outcomes this month</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
              <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 8, padding: 9, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#166534' }}>{overviewData?.outcomes?.successful || 94}%</div>
                <div style={{ fontSize: 10, color: '#16A34A' }}>Successful</div>
              </div>
              <div style={{ flex: 1, background: '#FEF2F2', borderRadius: 8, padding: 9, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#991B1B' }}>{overviewData?.outcomes?.missed || 6}%</div>
                <div style={{ fontSize: 10, color: '#DC2626' }}>Missed</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>60% rescheduled · 30% vol. stepped in · 10% failed</div>
          </div>
        </div>
      </div>
    </>
  )
}
