export default function Avatar({ initials, bg, color, size = 30, style = {} }) {
  return (
    <div
      className="av"
      style={{
        background: bg,
        color,
        width: size,
        height: size,
        fontSize: size <= 24 ? 8 : 10,
        ...style,
      }}
    >
      {initials}
    </div>
  )
}
