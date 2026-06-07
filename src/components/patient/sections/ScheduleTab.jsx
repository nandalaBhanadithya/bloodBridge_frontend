import Badge from '../../shared/Badge'

const ITEMS = [
  { day: '09', month: 'Jun', green: true, title: 'Next transfusion', badge: 'bg', badgeText: 'Blood confirmed', sub: '1 unit O+ reserved · City Hospital · 4 days old (fresh)' },
  { day: '30', month: 'Jun', title: 'Upcoming', badge: 'bb', badgeText: 'Planned', sub: 'Donor outreach scheduled to start Jun 23' },
  { day: '21', month: 'Jul', muted: true, title: 'Future', sub: '21-day cycle continues automatically' },
  { day: '11', month: 'Aug', muted: true, title: 'Future', sub: '21-day cycle continues' },
]

export default function ScheduleTab() {
  return (
    <div className="card">
      <div className="ctitle" style={{ color: '#0C4A6E' }}>Full transfusion schedule</div>
      {ITEMS.map((t) => (
        <div key={t.day + t.month} className="titem">
          <div className="datebox" style={t.green ? { background: '#F0FDF4', borderColor: '#86EFAC' } : {}}>
            <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, color: t.muted ? '#94A3B8' : (t.green ? '#166534' : undefined) }}>{t.day}</div>
            <div style={{ fontSize: 9, color: t.muted ? '#94A3B8' : (t.green ? '#16A34A' : 'var(--muted)') }}>{t.month}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: t.muted ? '#94A3B8' : undefined }}>{t.title}</span>
              {t.badge && <Badge variant={t.badge}>{t.badgeText}</Badge>}
            </div>
            <div style={{ fontSize: 11, color: t.muted ? '#94A3B8' : 'var(--muted)' }}>{t.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
