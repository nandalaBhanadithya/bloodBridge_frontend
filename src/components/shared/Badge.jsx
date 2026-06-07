export default function Badge({ variant = 'bk', children, className = '', blink }) {
  const dotClass = variant === 'br' ? 'dr' : variant === 'ba' ? 'da' : variant === 'bg' ? 'dg' : 'db'
  return (
    <span className={`badge ${variant} ${className}`}>
      {blink && <span className={`dot ${dotClass} blink`} />}
      {children}
    </span>
  )
}
