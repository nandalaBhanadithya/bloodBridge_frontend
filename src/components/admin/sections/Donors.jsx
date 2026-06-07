import MetricCard from '../../shared/MetricCard'
import Badge from '../../shared/Badge'

export default function Donors() {
  return (
    <>
      <div className="g4">
        <MetricCard value="4,446" label="Total donors" sub={{ text: 'Active in system', style: { color: '#16A34A' } }} />
        <MetricCard value="6,351" label="Active status" valueColor="#16A34A" sub={{ text: '90.3% of all', style: { color: 'var(--muted)' } }} />
        <MetricCard value="682" label="Inactive" valueColor="#DC2626" sub={{ text: '361 lapsed · 321 avoidant', style: { color: 'var(--muted)' } }} />
        <MetricCard value="1,427" label="Overdue for contact" valueColor="#D97706" sub={{ text: 'Eligible, not contacted 60d+', style: { color: 'var(--muted)' } }} />
      </div>
      <div className="card">
        <div className="ctitle">Recent donor activity</div>
        <table className="tbl">
          <thead>
            <tr><th>Donor</th><th>Blood group</th><th>Status</th><th>Donations</th><th>Last donation</th><th>Next eligible</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><div style={{ fontWeight: 600 }}>Suresh K.</div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Bridge donor · Team Ramu</div></td>
              <td>B+</td><td><Badge variant="ba">Cooldown</Badge></td><td>5</td><td>Mar 15</td><td>Jun 15</td>
              <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>Profile</button></td>
            </tr>
            <tr>
              <td><div style={{ fontWeight: 600 }}>Lakshmi T.</div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Bridge donor · New</div></td>
              <td>O+</td><td><Badge variant="bg">Eligible</Badge></td><td>1</td><td>Jun 3</td><td>Sep 3</td>
              <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>Profile</button></td>
            </tr>
            <tr>
              <td><div style={{ fontWeight: 600 }}>Ramesh B.</div><div style={{ fontSize: 10, color: 'var(--muted)' }}>Emergency donor · First time</div></td>
              <td>A+</td><td><Badge variant="bp">Test pending</Badge></td><td>1</td><td>Jun 4</td><td>Sep 4</td>
              <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}>View test</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
