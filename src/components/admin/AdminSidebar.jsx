const NAV = [
  { id: 'overview', icon: '◉', label: 'Overview' },
  { id: 'patients', icon: '◎', label: 'Patients', dot: 'dr' },
  { id: 'donors', icon: '◎', label: 'Donors' },
  { id: 'stock', icon: '◎', label: 'Blood stock' },
  { id: 'map', icon: '◎', label: 'Density map', dot: 'dr' },
  { id: 'events', icon: '◎', label: 'Event queue', dot: 'da' },
  { id: 'reports', icon: '◎', label: 'Reports' },
]

export default function AdminSidebar({ section, onSectionChange }) {
  return (
    <div className="sidebar" style={{ background: '#0F172A' }}>
      <div className="logo-area">
        <div className="logo-txt">BloodBridge<span style={{ color: '#EF4444' }}>AI</span></div>
        <div className="logo-sub">Admin command center</div>
      </div>
      {NAV.map((item) => (
        <div
          key={item.id}
          className={`nitem ${section === item.id ? 'on' : ''}`}
          onClick={() => onSectionChange(item.id)}
        >
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          {item.label}
          {item.dot && <span className={`ndot ${item.dot} blink`} />}
        </div>
      ))}
      <div className="sbottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="av" style={{ background: '#1E3A5F', color: '#93C5FD', width: 34, height: 34, fontSize: 10 }}>BW</div>
          <div>
            <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 600 }}>Blood Warriors</div>
            <div style={{ fontSize: 10, color: '#64748B' }}>Admin · Hyderabad</div>
          </div>
        </div>
      </div>
    </div>
  )
}
