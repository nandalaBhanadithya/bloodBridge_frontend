import { useState, useEffect } from 'react'
import PriorityQueue from '../PriorityQueue'
import MetricCard from '../../shared/MetricCard'
import FeedItem from '../../shared/FeedItem'
import Heatmap from '../Heatmap'
import { api } from '../../../services/api'

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
