import Badge from '../../shared/Badge'

export default function EventsTab() {
  return (
    <div className="card">
      <div className="ctitle" style={{ color: '#0C4A6E' }}>Upcoming events</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 14 }}>
        <div style={{ width: 38, height: 38, background: '#DCFCE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤝</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Team Priya Group Meetup (your request)</div>
          <div style={{ fontSize: 11, color: '#16A34A' }}>Jun 20 (proposed) · City Hospital · Admin coordinating</div>
        </div>
        <Badge variant="bt">Awaiting admin</Badge>
      </div>
    </div>
  )
}
