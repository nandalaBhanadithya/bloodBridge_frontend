import Avatar from '../../shared/Avatar'
import Badge from '../../shared/Badge'

const MEMBERS = [
  { i: 'SK', bg: '#FEE2E2', c: '#991B1B', name: 'You (Suresh Kumar)', sub: '5 donations · In cooldown', rowBg: '#FEE2E2', badge: 'ba', badgeText: 'Cooldown' },
  { i: 'D2', bg: '#DCFCE7', c: '#166534', name: 'Donor B · 8 donations', sub: 'Long-term member', rowBg: '#F0FDF4', badge: 'bg', badgeText: 'Eligible' },
  { i: 'D3', bg: '#DCFCE7', c: '#166534', name: 'Donor C · 5 donations', sub: 'Milestone reached', rowBg: '#F0FDF4', badge: 'bg', badgeText: 'Eligible' },
  { i: 'D4', bg: '#FEF3C7', c: '#92400E', name: 'Donor D · 2 donations', sub: 'Growing member', rowBg: '#FFFBEB', badge: 'ba', badgeText: 'Cooldown' },
  { i: 'LT', bg: '#EDE9FE', c: '#6D28D9', name: 'Lakshmi T. · 1 donation (new!)', sub: 'Joined Jun 3 · Integration event pending', rowBg: '#F5F3FF', badge: 'bp', badgeText: 'New member' },
]

export default function TeamTab({ onMeetupClick }) {
  return (
    <div className="card">
      <div className="ctitle">Team Ramu · 8 bridge donors · Patient age 8</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {MEMBERS.map((m) => (
          <div key={m.i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: m.rowBg, borderRadius: 8, padding: 10 }}>
            <Avatar initials={m.i} bg={m.bg} color={m.c} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{m.sub}</div>
            </div>
            <Badge variant={m.badge}>{m.badgeText}</Badge>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-blue" style={{ width: '100%', marginTop: 12 }} onClick={onMeetupClick}>
        Request a group meetup with Team Ramu
      </button>
    </div>
  )
}
