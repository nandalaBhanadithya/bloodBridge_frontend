import { useState } from 'react'
import Badge from '../../shared/Badge'

export default function EventsSection() {
  const [viewed, setViewed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="card">
      <div className="ctitle">Events I&apos;m overseeing</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🎨</span>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Blood Warriors Art Workshop</div>
            <Badge variant="bp" style={{ marginLeft: 'auto' }}>Milestone event</Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Jun 10 · BW HQ · Donors with 5+ donations · No patients</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
            <span><strong>12</strong> RSVPs</span>
            <span><strong>1</strong> volunteer (you)</span>
          </div>
          <button className={`btn btn-purple ${viewed ? '' : ''}`} style={{ width: '100%', marginTop: 10 }} onClick={() => setViewed(true)}>
            {viewed ? 'Details viewed' : 'View attendee list'}
          </button>
        </div>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🤝</span>
            <div style={{ fontWeight: 700, fontSize: 13 }}>City Hospital Group Meetup</div>
            <Badge variant="bg" style={{ marginLeft: 'auto' }}>Combined event</Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Jun 16 · City Hospital · Teams Ramu & Priya · 2 volunteers assigned</div>
          <div style={{ fontSize: 12, color: '#16A34A', marginBottom: 8, fontWeight: 600 }}>Pending admin final confirmation</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
            <span><strong>5</strong> confirmed so far</span>
            <span><strong>2</strong> patients</span>
            <span><strong>11</strong> donors invited</span>
          </div>
          <button className={`btn btn-green ${confirmed ? 'btn-disabled' : ''}`} style={{ width: '100%', marginTop: 10 }} onClick={() => setConfirmed(true)}>
            {confirmed ? 'You are confirmed as overseer ✓' : 'Confirm as overseer'}
          </button>
        </div>
      </div>
    </div>
  )
}
