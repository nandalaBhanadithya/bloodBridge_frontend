import { useState } from 'react'
import Badge from '../../shared/Badge'
import Avatar from '../../shared/Avatar'

export default function ActivitiesTab() {
  const [rsvpYes, setRsvpYes] = useState(false)
  const [rsvpNo, setRsvpNo] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const events = [
    {
      id: 1,
      icon: '🎨',
      title: 'Blood Warriors Art Workshop',
      date: 'Jun 10',
      location: 'BW HQ',
      description: 'Donors with 5+ donations only',
      subtitle: 'Celebrate, share your story, invite a friend',
      color: '#7C3AED',
      bg: '#EDE9FE',
      border: '#DDD6FE',
      attendees: [
        { name: 'Suresh K.', status: 'Going', initials: 'SK' },
        { name: 'Lakshmi T.', status: 'Going', initials: 'LT' },
        { name: 'Donor A', status: 'Going', initials: 'DA' },
        { name: 'Donor B', status: 'Pending', initials: 'DB' },
        { name: 'Donor C', status: 'Going', initials: 'DC' },
      ],
    },
    {
      id: 2,
      icon: '🤝',
      title: 'Team Ramu Group Meetup (pending admin)',
      date: 'Jun 15 (proposed)',
      location: 'City Hospital',
      description: 'Whole team',
      subtitle: 'Admin coordinating — you&apos;ll get WhatsApp confirmation',
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      attendees: [
        { name: 'Ramu (patient)', status: 'Confirmed', initials: 'RK' },
        { name: 'Suresh K.', status: 'Confirmed', initials: 'SK' },
        { name: 'Lakshmi T.', status: 'Confirmed', initials: 'LT' },
      ],
    },
  ]

  return (
    <div className="card">
      <div className="ctitle">Your upcoming events</div>
      {events.map((event) => (
        <div
          key={event.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: event.bg,
            border: '1px solid ' + event.border,
            borderRadius: 10,
            padding: 14,
            marginBottom: event.id === 1 ? 10 : 0,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
        >
          <div style={{ width: 40, height: 40, background: event.id === 1 ? '#F5F3FF' : '#DCFCE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {event.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{event.title}</div>
            <div style={{ fontSize: 11, color: event.color }}>{event.date} · {event.location} · {event.description}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{event.subtitle}</div>
          </div>
          {event.id === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <button
                className={`btn btn-purple ${rsvpYes ? 'btn-green btn-disabled' : ''}`}
                onClick={(e) => { e.stopPropagation(); setRsvpYes(true); setRsvpNo(false) }}
              >
                {rsvpYes ? 'Going ✓' : 'RSVP Yes'}
              </button>
              {!rsvpYes && (
                <button
                  className={`btn btn-ghost ${rsvpNo ? 'btn-disabled' : ''}`}
                  style={{ fontSize: 11 }}
                  onClick={(e) => { e.stopPropagation(); setRsvpNo(true) }}
                >
                  {rsvpNo ? 'Declined' : 'Decline'}
                </button>
              )}
            </div>
          ) : (
            <Badge variant="bt">Your request</Badge>
          )}
        </div>
      ))}

      {selectedEvent && (
        <div style={{
          marginTop: 12,
          padding: 12,
          background: '#F8FAFC',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
            Members interested in attending ({events.find(e => e.id === selectedEvent)?.attendees.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {events.find(e => e.id === selectedEvent)?.attendees.map((attendee, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 8,
                  background: '#fff',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                }}
              >
                <Avatar initials={attendee.initials} bg="#F1F5F9" color="#475569" size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{attendee.name}</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>{attendee.status}</div>
                </div>
                <Badge variant={attendee.status === 'Going' || attendee.status === 'Confirmed' ? 'bg' : 'bb'}>
                  {attendee.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
