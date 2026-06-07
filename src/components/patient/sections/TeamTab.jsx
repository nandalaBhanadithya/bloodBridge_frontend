import Avatar from '../../shared/Avatar'

const DONORS = [
  { i: 'D1', bg: '#DCFCE7', c: '#166534', name: 'Donor A', sub: '8 donations · Has donated for you since Aug 2024', status: 'Eligible and ready to donate', rowBg: '#F0FDF4', dot: 'dg' },
  { i: 'D2', bg: '#FEF3C7', c: '#92400E', name: 'Donor B', sub: '3 donations · Growing member of your team', status: 'In cooldown · eligible Jun 18', rowBg: '#FFFBEB', dot: 'da' },
  { i: 'D3', bg: '#DCFCE7', c: '#166534', name: 'Donor C', sub: '5 donations · Milestone reached', status: 'Eligible and ready to donate', rowBg: '#F0FDF4', dot: 'dg' },
]

export default function TeamTab() {
  return (
    <div className="card">
      <div className="ctitle" style={{ color: '#0C4A6E' }}>Your donor team · 3 dedicated people</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
        All these people show up for you, every time. They are identified only by initials to protect everyone&apos;s privacy.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {DONORS.map((d) => (
          <div key={d.i} style={{ background: d.rowBg, borderRadius: 9, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials={d.i} bg={d.bg} color={d.c} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: d.c }}>{d.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.sub}</div>
              <div style={{ fontSize: 11, color: d.dot === 'dg' ? '#16A34A' : '#D97706', fontWeight: 600 }}>{d.status}</div>
            </div>
            <span className={`dot ${d.dot}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
