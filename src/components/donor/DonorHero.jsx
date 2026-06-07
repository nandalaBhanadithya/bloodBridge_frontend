export default function DonorHero() {
  return (
    <div className="d-hero">
      <div className="d-hero-acc1" />
      <div className="d-hero-acc2" />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, color: '#FCA5A5', fontWeight: 600, marginBottom: 5 }}>Welcome back, Suresh</div>
        <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          You&apos;re protecting Ramu
        </div>
        <div style={{ fontSize: 12, color: '#FECACA', marginBottom: 18 }}>
          Age 8 · B+ every 21 days · 2 units per session
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Syne', fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1 }}>9</div>
            <div style={{ fontSize: 11, color: '#FCA5A5' }}>days until eligible</div>
          </div>
          <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,.2)' }} />
          <div>
            <div style={{ fontFamily: 'Syne', fontSize: 44, fontWeight: 800, color: '#FBBF24', lineHeight: 1 }}>5</div>
            <div style={{ fontSize: 11, color: '#FCA5A5' }}>lifetime donations</div>
          </div>
          <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,.2)' }} />
          <div style={{ background: 'rgba(251,191,36,.14)', border: '1px solid rgba(251,191,36,.28)', borderRadius: 9, padding: '10px 14px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FBBF24' }}>5th donation milestone!</div>
            <div style={{ fontSize: 11, color: '#FCA5A5' }}>Art Workshop invite sent via WhatsApp</div>
          </div>
        </div>
      </div>
    </div>
  )
}
