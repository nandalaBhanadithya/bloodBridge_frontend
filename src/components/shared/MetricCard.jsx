export default function MetricCard({ value, label, sub, valueColor, borderLeft }) {
  return (
    <div className="met" style={borderLeft ? { borderLeft: `3px solid ${borderLeft}` } : {}}>
      <div className="metv" style={valueColor ? { color: valueColor } : {}} id={value?.id}>
        {value?.text ?? value}
      </div>
      <div className="metl">{label}</div>
      {sub && (
        <div className="mett" style={sub.style || {}}>
          {sub.blink && <span className="dot dr blink" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} />}
          {sub.text}
        </div>
      )}
    </div>
  )
}
