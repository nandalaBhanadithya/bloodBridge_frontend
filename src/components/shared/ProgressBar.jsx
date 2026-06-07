export default function ProgressBar({ pct, color = '#2563EB', width, style = {} }) {
  return (
    <div className="pbt" style={{ width, ...style }}>
      <div className="pbf" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}
