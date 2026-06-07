import Badge from '../../shared/Badge'

export default function Reports() {
  return (
    <>
      <div className="card">
        <div className="ctitle">AI failure analysis · Last 7 days</div>
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: '#166534' }}>Groq 70B analysis (Sunday Jun 1 – Jun 6): </span>
          Bridge Asha B. (A+, City Hospital) has failed 2 consecutive cycles. Both failures reached Tier 4 (guest outreach) before resolution. Root cause: only 2 bridge donors assigned, both frequently in cooldown simultaneously. Recommendation: recruit 2 additional A+ donors within 8km of City Hospital. Ameerpet Clinic remains CRITICAL — immediate guest conversion campaign recommended within 10km radius.
        </div>
      </div>
      <div className="card">
        <div className="ctitle">Failure log</div>
        <table className="tbl">
          <thead>
            <tr><th>Bridge</th><th>Date</th><th>Max tier</th><th>Outcome</th><th>Days notice</th></tr>
          </thead>
          <tbody>
            <tr><td>Team Vikram P. (AB+)</td><td>Jun 4</td><td>Tier 4</td><td><Badge variant="ba">Rescheduled</Badge></td><td>3 days</td></tr>
            <tr><td>Team Asha B. (A+)</td><td>May 22</td><td>Tier 4</td><td><Badge variant="ba">Vol. intervened</Badge></td><td>5 days</td></tr>
            <tr><td>Team Asha B. (A+)</td><td>May 1</td><td>Tier 3</td><td><Badge variant="br">Failed</Badge></td><td>2 days</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
