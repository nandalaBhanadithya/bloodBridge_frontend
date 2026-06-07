import Badge from '../../shared/Badge'

const HISTORY = [
  { date: 'Mar 15, 2026', hospital: 'City Hospital', bridge: 'Team Ramu', units: 1, status: 'bg', label: 'Completed' },
  { date: 'Dec 18, 2025', hospital: 'City Hospital', bridge: 'Team Ramu', units: 1, status: 'bg', label: 'Completed' },
  { date: 'Sep 22, 2025', hospital: 'City Hospital', bridge: 'Team Ramu', units: 1, status: 'bg', label: 'Completed' },
  { date: 'Jun 24, 2025', hospital: 'City Hospital', bridge: 'Team Ramu', units: 1, status: 'bg', label: 'Completed' },
  { date: 'Mar 1, 2025', hospital: 'City Hospital', bridge: 'Team Ramu', units: 1, status: 'bg', label: 'First donation 🎉' },
]

export default function HistoryTab() {
  return (
    <div className="card">
      <div className="ctitle">Donation history · 5 donations</div>
      <table className="tbl">
        <thead>
          <tr><th>Date</th><th>Hospital</th><th>Bridge</th><th>Units</th><th>Status</th></tr>
        </thead>
        <tbody>
          {HISTORY.map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td><td>{row.hospital}</td><td>{row.bridge}</td><td>{row.units}</td>
              <td><Badge variant={row.status}>{row.label}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
