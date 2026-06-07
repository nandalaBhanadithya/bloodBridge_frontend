import Heatmap from '../Heatmap'
import ProgressBar from '../../shared/ProgressBar'

const BANKS = [
  { name: 'City Hospital', ratio: '18.3', color: '#16A34A', patients: 73, donors: 1334, pct: 92 },
  { name: 'Gandhi Hospital', ratio: '131.4', color: '#16A34A', patients: 7, donors: 920, pct: 100 },
  { name: 'Nampally / Secunderabad', ratio: '12.5', color: '#D97706', patients: 3, donors: 52, pct: 60 },
  { name: 'Ameerpet Clinic', ratio: '0', color: '#DC2626', patients: 1, donors: 0, pct: 0, critical: true },
]

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
