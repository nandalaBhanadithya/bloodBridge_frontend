const NAV = [
  { id: 'tasks', icon: '◉', label: 'My tasks' },
  { id: 'bridges', icon: '◎', label: 'My bridges' },
  { id: 'events', icon: '◎', label: 'Events to oversee', dot: 'db' },
  { id: 'note', icon: '◎', label: 'Add note' },
]

export default function VolunteerSidebar({ section, onSectionChange }) {
  return (
    <div className="sidebar" style={{ background: '#1e3a5f' }}>
      <div className="logo-area">
        <div className="logo-txt">BloodBridge<span style={{ color: '#7DD3FC' }}>AI</span></div>
        <div className="logo-sub">Volunteer portal</div>
      </div>
      {NAV.map((item) => (
        <div
          key={item.id}
          className={`vnitem ${section === item.id ? 'on' : ''}`}
          onClick={() => onSectionChange(item.id)}
        >
          {item.icon} {item.label}
          {item.dot && <span className={`ndot ${item.dot} blink`} style={{ marginLeft: 'auto' }} />}
        </div>
      ))}
      <div className="sbottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="av" style={{ background: '#0C4A6E', color: '#7DD3FC', width: 34, height: 34, fontSize: 10 }}>LV</div>
          <div>
            <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 600 }}>Lakshmi V.</div>
            <div style={{ fontSize: 10, color: '#64748B' }}>Volunteer · 8 bridges</div>
          </div>
        </div>
      </div>
    </div>
  )
}
