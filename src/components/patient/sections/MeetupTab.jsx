import { useState } from 'react'
import Badge from '../../shared/Badge'
import Avatar from '../../shared/Avatar'
import { useRsvpSimulation } from '../../../hooks/useRsvpSimulation'

const DONORS = [
  { i: 'D1', name: 'Donor A' },
  { i: 'D2', name: 'Donor B' },
  { i: 'D3', name: 'Donor C' },
]

export default function MeetupTab() {
  const [phase, setPhase] = useState('idle')
  const rsvp = useRsvpSimulation({
    total: 3,
    threshold: 2,
    initialCount: 0,
    updates: [
      ['bg', 'Going ✓'],
      ['bg', 'Going ✓'],
      ['br', 'Declined'],
    ],
  })

  const submit = () => {
    setPhase('tracker')
    rsvp.start()
  }

  if (phase === 'tracker') {
    return (
      <div className="rsvp-card">
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>Invites sent to your 3 donors!</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Event proceeds when 2+ confirm (67% for a group of 3).
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1D4ED8' }}>{rsvp.count} of 3 confirmed</span>
          <Badge variant={rsvp.statusBadge.cls}>{rsvp.statusBadge.text}</Badge>
        </div>
        <div className="rsvp-bar-wrap">
          <div className="rsvp-bar-fill" style={{ width: `${rsvp.pct}%` }} />
        </div>
        <div className="person-grid">
          {DONORS.map((d, idx) => (
            <div key={d.i} className="person-chip">
              <Avatar initials={d.i} bg="#F1F5F9" color="#475569" size={20} />
              <span>{d.name}</span>
              <Badge variant={rsvp.chipStatuses[idx]?.cls || 'bk'} style={{ fontSize: 9 }}>
                {rsvp.chipStatuses[idx]?.text || 'Sent'}
              </Badge>
            </div>
          ))}
        </div>
        {rsvp.thresholdMet && (
          <div className="success-banner" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Your team wants to meet! 🤝</div>
            <div style={{ fontSize: 12, color: '#16A34A', marginTop: 3 }}>
              Sent to admin for coordination. A volunteer will oversee the meetup.
            </div>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'form') {
    return (
      <div className="card">
        <div className="ctitle" style={{ color: '#0C4A6E' }}>Invite your team</div>
        <div className="form-group">
          <label className="form-label">When would you like to meet?</label>
          <input type="date" className="form-input" defaultValue="2026-06-20" />
        </div>
        <div className="form-group">
          <label className="form-label">Anything you want to say? (optional)</label>
          <textarea className="form-input" placeholder="e.g. I'd love to say thank you in person to everyone who has shown up for me..." />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-blue" style={{ flex: 1 }} onClick={submit}>Send invites to all 3 donors</button>
          <button className="btn btn-ghost" onClick={() => setPhase('idle')}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="ctitle" style={{ color: '#0C4A6E' }}>Invite your team to meet</div>
      <div style={{ background: '#EFF6FF', border: '1px solid #BAE6FD', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 12, color: '#1D4ED8', lineHeight: 1.7 }}>
        <strong>Everyone is welcome, no conditions.</strong> When you raise this, all 3 donors get an invite — whether they&apos;ve donated once or many times. The event happens if at least 2 of your team (67% threshold for your small group) confirm they&apos;re coming.
      </div>
      <button className="btn btn-blue" style={{ width: '100%', padding: 11 }} onClick={() => setPhase('form')}>
        Invite my donor team to meet
      </button>
    </div>
  )
}
