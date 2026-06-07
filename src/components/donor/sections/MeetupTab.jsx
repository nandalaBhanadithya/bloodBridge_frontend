import { useState } from 'react'
import Badge from '../../shared/Badge'
import Avatar from '../../shared/Avatar'
import { useRsvpSimulation } from '../../../hooks/useRsvpSimulation'
import { api } from '../../../services/api'

const INVITEES = ['Ramu (patient)', 'You (Suresh)', 'Donor B', 'Donor C', 'Donor D', 'Lakshmi T.', '+2 more']
const RSVP_CHIPS = [
  { i: 'RK', name: 'Ramu' },
  { i: 'SK', name: 'You', fixed: { cls: 'bg', text: 'Going ✓' } },
  { i: 'D2', name: 'Donor B' },
  { i: 'D3', name: 'Donor C' },
  { i: 'D4', name: 'Donor D' },
  { i: 'LT', name: 'Lakshmi T.' },
]

export default function MeetupTab() {
  const [phase, setPhase] = useState('idle')
  const [loading, setLoading] = useState(false)
  const rsvp = useRsvpSimulation({
    total: 8,
    threshold: 3,
    initialCount: 1,
    updates: [
      ['bg', 'Going ✓'],
      ['bg', 'Going ✓'],
      ['br', 'Declined'],
      ['bg', 'Going ✓'],
    ],
  })

  const submit = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get donor ID from auth context
      await api.createCommunityEvent({
        name: 'Team Ramu Group Meetup',
        type: 'meetup',
        team_id: 'ramu',
        requested_date: '2026-06-15',
        message: 'Would love to finally meet everyone and thank you all in person...',
      })
      setPhase('tracker')
      rsvp.start()
    } catch (err) {
      console.error('Failed to create meetup request:', err)
      alert('Failed to create meetup request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (phase === 'tracker') {
    return (
      <div className="rsvp-card">
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>Invites sent to all 8 team members!</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Watching RSVPs come in... Event proceeds when 3+ confirm (30% threshold).
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1D4ED8' }}>{rsvp.count} of 8 confirmed</span>
          <Badge variant={rsvp.statusBadge.cls}>{rsvp.statusBadge.text}</Badge>
        </div>
        <div className="rsvp-bar-wrap">
          <div className="rsvp-bar-fill" style={{ width: `${rsvp.pct}%` }} />
        </div>
        <div className="person-grid">
          {RSVP_CHIPS.map((chip, idx) => {
            const rsvpMap = { 0: 0, 2: 1, 3: 2, 4: 3, 5: 4 }
            const display = chip.fixed
              ? chip.fixed
              : rsvp.chipStatuses[rsvpMap[idx]] || { cls: 'bk', text: 'Sent' }
            return (
              <div key={chip.i} className="person-chip">
                <Avatar initials={chip.i} bg="#F1F5F9" color="#475569" size={20} />
                <span>{chip.name}</span>
                <Badge variant={display.cls} style={{ fontSize: 9 }}>{display.text}</Badge>
              </div>
            )
          })}
        </div>
        {rsvp.thresholdMet && (
          <div className="success-banner" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Threshold reached! 🎉</div>
            <div style={{ fontSize: 12, color: '#16A34A', marginTop: 3 }}>
              3+ members confirmed. Request sent to Blood Warriors admin for coordination.
            </div>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'form') {
    return (
      <div className="card">
        <div className="ctitle">Request group meetup</div>
        <div className="form-group">
          <label className="form-label">Your preferred date</label>
          <input type="date" className="form-input" defaultValue="2026-06-15" />
        </div>
        <div className="form-group">
          <label className="form-label">Message to your team (optional)</label>
          <textarea className="form-input" placeholder="e.g. Would love to finally meet everyone and thank you all in person..." />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-blue" style={{ flex: 1 }} onClick={submit} disabled={loading}>
            {loading ? 'Processing...' : 'Send invites to all 8 members'}
          </button>
          <button className="btn btn-ghost" onClick={() => setPhase('idle')}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="ctitle">Group meetup · Team Ramu</div>
      <div className="notice" style={{ marginBottom: 14 }}>
        When you request a meetup, <strong>everyone in Team Ramu</strong> (all 8 donors + Ramu) gets an invite. There are no restrictions based on how many times you&apos;ve donated — every member of the team is equally welcome. The event proceeds if 30% of the group (3+ people) confirm.
      </div>
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#166534', marginBottom: 8 }}>Who gets invited</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {INVITEES.map((name) => (
            <div key={name} className="person-chip">
              <span className="dot dg" />
              {name}
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-blue" style={{ width: '100%', padding: 11 }} onClick={() => setPhase('form')}>
        Request a group meetup
      </button>
    </div>
  )
}
