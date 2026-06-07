import { useState, useEffect } from 'react'
import PriorityQueue from '../PriorityQueue'
import Badge from '../../shared/Badge'
import { api } from '../../../services/api'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getPatients()
      setPatients(data.patients || [])
    } catch (err) {
      console.error('Failed to load patients:', err)
      setError('Failed to load patients')
      // Use mock data for development when backend is not available
      setPatients([
        { id: 1, name: 'Ramu K.', team: 'Team Ramu', donors: 8, blood_group: 'B+', hospital: 'City Hospital', next_transfusion: 'Jun 20', stock_status: 'low', stored: 1, target: 2, eligible_donors: 6 },
        { id: 2, name: 'Priya M.', team: 'Team Priya', donors: 3, blood_group: 'O+', hospital: 'City Hospital', next_transfusion: 'Jun 9', stock_status: 'sufficient', stored: 1, target: 1, eligible_donors: 2 },
        { id: 3, name: 'Asha B.', team: 'Team Asha', donors: 2, blood_group: 'A+', hospital: 'City Hospital', next_transfusion: 'Jun 11', stock_status: 'critical', stored: 0, target: 1, eligible_donors: 2 },
        { id: 4, name: 'Anonymous Patient', team: 'Ameerpet Clinic', donors: 0, blood_group: 'A+', hospital: 'Ameerpet Clinic', next_transfusion: 'Jun 18', stock_status: 'critical', stored: 0, target: 1, eligible_donors: 0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <PriorityQueue compact title="⚑ New registrations needing review" />
        <div className="card">
          <div className="ctitle">All patients</div>
          <div style={{ padding: 40, textAlign: 'center' }}>Loading patients...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <PriorityQueue compact title="⚑ New registrations needing review" />
        <div className="card">
          <div className="ctitle">All patients</div>
          <div style={{ padding: 40, textAlign: 'center', color: '#DC2626' }}>{error}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <PriorityQueue compact title="⚑ New registrations needing review" />
      <div className="card">
        <div className="ctitle">All patients ({patients.length} total)</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Patient</th><th>Blood group</th><th>Hospital</th><th>Next transfusion</th><th>Blood stock</th><th>Donors</th><th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const stockBadge = patient.stock_status === 'critical' ? 'br' : patient.stock_status === 'low' ? 'ba' : 'bg'
              const stockText = patient.stock_status === 'critical' ? `0/${patient.target} CRITICAL` : patient.stock_status === 'low' ? `${patient.stored}/${patient.target}` : `${patient.stored}/${patient.target} ✓`
              const actionButton = patient.eligible_donors === 0 ? 'Campaign' : patient.stock_status === 'critical' ? 'Escalate' : 'View'
              const buttonClass = patient.eligible_donors === 0 || patient.stock_status === 'critical' ? 'btn-red' : 'btn-ghost'

              return (
                <tr key={patient.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{patient.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{patient.team} · {patient.donors} donors</div>
                  </td>
                  <td><Badge variant="bk">{patient.blood_group}</Badge></td>
                  <td>{patient.hospital}</td>
                  <td>{patient.next_transfusion}</td>
                  <td><Badge variant={stockBadge}>{stockText}</Badge></td>
                  <td>{patient.eligible_donors} eligible</td>
                  <td><button className={`btn ${buttonClass}`} style={{ fontSize: 11, padding: '5px 10px' }}>{actionButton}</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
