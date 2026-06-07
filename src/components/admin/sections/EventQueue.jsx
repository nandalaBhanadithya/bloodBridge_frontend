import { useState, useEffect } from 'react'
import Badge from '../../shared/Badge'
import Avatar from '../../shared/Avatar'
import { api } from '../../../services/api'

export default function EventQueue() {
  const [showBatch, setShowBatch] = useState(true)
  const [showPair, setShowPair] = useState(true)
  const [showCombined, setShowCombined] = useState(false)
  const [approved, setApproved] = useState({})
  const [diffDates, setDiffDates] = useState({})
  const [combinedConfirmed, setCombinedConfirmed] = useState(false)
  const [milestoneOpened, setMilestoneOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadIntegrationEvents()
  }, [])

  const loadIntegrationEvents = async () => {
    try {
      setLoading(true)
      const data = await api.getIntegrationEvents()
      setEvents(data.events || [])
    } catch (err) {
      console.error('Failed to load integration events:', err)
      // Use mock data for development when backend is not available
    } finally {
      setLoading(false)
    }
  }

  const combine = async () => {
    try {
      setLoading(true)
      await api.combineEvents(['ramu', 'priya'], {
        combined_date: '2026-06-16',
        volunteer_1: 'Lakshmi V.',
        volunteer_2: 'Ravi V.',
      })
      setShowBatch(false)
      setShowPair(false)
      setShowCombined(true)
    } catch (err) {
      console.error('Failed to combine events:', err)
      alert('Failed to combine events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const approveEvent = async (eventId) => {
    try {
      setLoading(true)
      await api.approveIntegrationEvent(eventId)
      setApproved((p) => ({ ...p, [eventId]: true }))
    } catch (err) {
      console.error('Failed to approve event:', err)
      alert('Failed to approve event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const requestDate = async (eventId) => {
    try {
      setLoading(true)
      await api.requestDateChange(eventId, '2026-06-20')
      setDiffDates((p) => ({ ...p, [eventId]: true }))
    } catch (err) {
      console.error('Failed to request date change:', err)
      alert('Failed to request date change. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showBatch && (
        <div className="batch-banner">
          <div style={{ fontSize: 22 }}>🔗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Batching opportunity detected</div>
            <div style={{ fontSize: 12, color: '#92400E', marginTop: 2 }}>
              Teams Ramu & Priya (both at City Hospital) want to meet within 2 days of each other. Combining saves volunteer time and creates a larger community event.
            </div>
          </div>
          <button className="btn btn-amber" onClick={combine} disabled={loading}>
            {loading ? 'Processing...' : 'Combine into 1 event'}
          </button>
          <button className="btn btn-ghost" onClick={() => setShowBatch(false)}>Keep separate</button>
        </div>
      )}
      {showPair && (
        <div className="event-pair">
          <div className="event-coord-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Badge variant="bg">Threshold met · 3/8 RSVPs (37%)</Badge>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>Raised by patient</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Team Ramu Group Meetup</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Jun 15 · City Hospital · 8 donors invited</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {[
                { i: 'PM', n: 'Patient (raised)', s: 'bg', t: 'Going' },
                { i: 'SK', n: 'Suresh K.', s: 'bg', t: 'Going' },
                { i: 'D2', n: 'Donor B', s: 'bg', t: 'Going' },
                { i: 'D3', n: 'Donor C', s: 'br', t: 'Not yet' },
                { i: '+5', n: '5 more', s: 'bk', t: 'Pending' },
              ].map((c) => (
                <div key={c.i} className="person-chip">
                  <Avatar initials={c.i} bg="#F1F5F9" color="#475569" size={20} />
                  <span>{c.n}</span>
                  <Badge variant={c.s} style={{ fontSize: 9 }}>{c.t}</Badge>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-green ${approved.ramu ? 'btn-disabled' : ''}`}
                style={{ flex: 1, fontSize: 11, ...(approved.ramu ? { background: '#16A34A', color: '#fff' } : {}) }}
                onClick={() => approveEvent('ramu')}
                disabled={loading}
              >
                {loading ? 'Processing...' : approved.ramu ? 'Approved ✓' : 'Approve Jun 15'}
              </button>
              <button
                className={`btn btn-ghost ${diffDates.ramu ? 'btn-disabled' : ''}`}
                style={{ fontSize: 11 }}
                onClick={() => requestDate('ramu')}
                disabled={loading}
              >
                {loading ? 'Processing...' : diffDates.ramu ? 'Date request sent ✓' : 'Request diff date'}
              </button>
            </div>
          </div>
          <div className="event-coord-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Badge variant="bg">Threshold met · 2/3 RSVPs (67%)</Badge>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>Raised by donor</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Team Priya Group Meetup</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Jun 17 · City Hospital · 3 donors invited</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {[
                { i: 'D1', n: 'Donor A (raised)', s: 'bg', t: 'Going' },
                { i: 'PM', n: 'Patient Priya', s: 'bg', t: 'Going' },
                { i: 'D3', n: 'Donor C', s: 'br', t: 'Declined' },
              ].map((c) => (
                <div key={c.i} className="person-chip">
                  <Avatar initials={c.i} bg="#F1F5F9" color="#475569" size={20} />
                  <span>{c.n}</span>
                  <Badge variant={c.s} style={{ fontSize: 9 }}>{c.t}</Badge>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-green ${approved.priya ? 'btn-disabled' : ''}`}
                style={{ flex: 1, fontSize: 11, ...(approved.priya ? { background: '#16A34A', color: '#fff' } : {}) }}
                onClick={() => approveEvent('priya')}
                disabled={loading}
              >
                {loading ? 'Processing...' : approved.priya ? 'Approved ✓' : 'Approve Jun 17'}
              </button>
              <button
                className={`btn btn-ghost ${diffDates.priya ? 'btn-disabled' : ''}`}
                style={{ fontSize: 11 }}
                onClick={() => requestDate('priya')}
                disabled={loading}
              >
                {loading ? 'Processing...' : diffDates.priya ? 'Date request sent ✓' : 'Request diff date'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCombined && (
        <div className="card">
          <div className="ctitle" style={{ color: '#16A34A' }}>Combined event — City Hospital Group Meetup</div>
          <div className="notice" style={{ marginBottom: 14 }}>
            Teams Ramu & Priya combined. Date set between Jun 15–17. 2 volunteers will be assigned — one per patient group.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div><label className="form-label">Event date</label><input type="date" className="form-input" defaultValue="2026-06-16" /></div>
            <div><label className="form-label">Volunteer 1 (Team Ramu)</label><select className="form-input"><option>Lakshmi V.</option><option>Ravi V.</option></select></div>
            <div><label className="form-label">Volunteer 2 (Team Priya)</label><select className="form-input"><option>Ravi V.</option><option>Lakshmi V.</option></select></div>
          </div>
          <button
            className={`btn btn-green ${combinedConfirmed ? 'btn-disabled' : ''}`}
            style={combinedConfirmed ? { background: '#166534', color: '#fff', width: '100%' } : {}}
            onClick={async () => {
              try {
                setLoading(true)
                await api.createCommunityEvent({
                  name: 'City Hospital Group Meetup',
                  date: '2026-06-16',
                  volunteers: ['Lakshmi V.', 'Ravi V.'],
                  teams: ['Ramu', 'Priya'],
                })
                setCombinedConfirmed(true)
              } catch (err) {
                console.error('Failed to confirm combined event:', err)
                alert('Failed to confirm combined event. Please try again.')
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : combinedConfirmed ? 'Combined event confirmed → Notifying 11 members via WhatsApp' : 'Confirm combined event → Notify all members'}
          </button>
        </div>
      )}
      <div className="card" style={{ marginTop: 4 }}>
        <div className="ctitle">Milestone donor events (Blood Warriors organised)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ width: 40, height: 40, background: '#EDE9FE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🎨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Blood Warriors Community Meet — 5+ donors</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Jun 10 · BW HQ · Donors only · No patients</div>
            <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600 }}>12 RSVPs · Lakshmi V. organising</div>
          </div>
          <Badge variant="bp">Milestone event</Badge>
          <button className="btn btn-ghost" style={{ fontSize: 11 }}>Details</button>
        </div>
        <button className="btn btn-purple" onClick={() => setMilestoneOpened(true)}>
          {milestoneOpened ? '+ Event form opened below' : '+ Organise new milestone event'}
        </button>
      </div>
    </>
  )
}
