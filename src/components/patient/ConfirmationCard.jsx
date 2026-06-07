export default function ConfirmationCard() {
  const stats = [
    { label: 'Hospital', value: 'City Hospital' },
    { label: 'Blood group', value: 'O+' },
    { label: 'Ready', value: '1 of 1' },
    { label: 'Blood age', value: '4 days (fresh)' },
    { label: 'Days away', value: '3 days' },
  ]

  return (
    <div className="p-confirm">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 7 }}>
        <div style={{ width: 30, height: 30, background: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>✓</span>
        </div>
        <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: '#166534' }}>
          Your Jun 9 transfusion is confirmed
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#16A34A', marginBottom: 14 }}>
        1 unit of O+ blood is reserved and fresh at City Hospital
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
