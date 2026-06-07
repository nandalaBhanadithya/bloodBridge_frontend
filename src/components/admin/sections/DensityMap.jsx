import ProgressBar from '../../shared/ProgressBar'

const BANKS = [
  { name: 'City Hospital', ratio: '18.3', color: '#16A34A', patients: 73, donors: 1334, pct: 92 },
  { name: 'Gandhi Hospital', ratio: '131.4', color: '#16A34A', patients: 7, donors: 920, pct: 100 },
  { name: 'Nampally / Secunderabad', ratio: '12.5', color: '#D97706', patients: 3, donors: 52, pct: 60 },
  { name: 'Ameerpet Clinic', ratio: '0', color: '#DC2626', patients: 1, donors: 0, pct: 0, critical: true },
]

function Heatmap({ size = 'large' }) {
  const viewBox = size === 'large' ? '0 0 420 300' : '0 0 300 230'
  
  return (
    <svg viewBox={viewBox} style={{ width: '100%', height: 'auto' }}>
      {/* Background */}
      <rect width="420" height="300" fill="#F8FAFC" />
      
      {/* Blood bank positions */}
      <circle cx="201" cy="163" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="255" cy="173" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="191" cy="218" r="32" fill="#D97706" opacity="0.55" />
      <circle cx="229" cy="43" r="32" fill="#16A34A" opacity="0.55" />
      <circle cx="42" cy="123" r="32" fill="#DC2626" opacity="0.55" className="cring" />
      
      {/* Labels */}
      <text x="201" y="163" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">City</text>
      <text x="255" y="173" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Gandhi</text>
      <text x="191" y="218" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Nampally</text>
      <text x="229" y="43" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Secunderabad</text>
      <text x="42" y="123" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle">Ameerpet</text>
    </svg>
  )
}

export default function DensityMap() {
  return (
    <>
      <div className="card">
        <div className="ctitle">Blood bank density — all 5 hospitals · Hyderabad metro</div>
        <Heatmap size="large" />
      </div>
      <div className="g4">
        {BANKS.map((b) => (
          <div key={b.name} className="card" style={b.critical ? { borderLeft: '3px solid #DC2626' } : {}}>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{b.name}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: b.color, margin: '6px 0' }}>{b.ratio}</div>
            <div style={{ fontSize: 11, color: b.critical ? '#DC2626' : 'var(--muted)', fontWeight: b.critical ? 600 : 400 }}>
              {b.critical ? `CRITICAL · ${b.patients} patient · ${b.donors} donors` : `density ratio · ${b.patients} patients · ${b.donors.toLocaleString()} donors`}
            </div>
            <ProgressBar pct={b.pct} color={b.color} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    </>
  )
}
