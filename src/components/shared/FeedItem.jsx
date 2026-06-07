import Avatar from './Avatar'
import Badge from './Badge'

export default function FeedItem({ initials, avatarBg, avatarColor, name, badges = [], subtitle }) {
  return (
    <div className="feed">
      <Avatar initials={initials} bg={avatarBg} color={avatarColor} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {badges.map((b, i) => (
            <Badge key={i} variant={b.variant} className={b.mlAuto ? 'ml-auto' : ''} style={b.mlAuto ? { marginLeft: 'auto' } : {}}>
              {b.text}
            </Badge>
          ))}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 11 }}>{subtitle}</div>
      </div>
    </div>
  )
}
