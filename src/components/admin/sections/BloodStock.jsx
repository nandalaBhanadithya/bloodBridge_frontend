import { useState, useEffect } from 'react'
import MetricCard from '../../shared/MetricCard'
import Badge from '../../shared/Badge'
import ProgressBar from '../../shared/ProgressBar'
import { api } from '../../../services/api'

export default function BloodStock({ totalUnits, onLogDonation }) {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState(null)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const data = await api.getBloodStock()
      setInventory(data)
    } catch (err) {
      console.error('Failed to load blood stock:', err)
      // Use mock data for development when backend is not available
      setInventory({
        total_units: totalUnits,
        fresh_units: 41,
        low_stock_bridges: 4,
        critical_shortage: 2,
        bridges: [
          { name: 'Team Ramu', blood_group: 'B+', hospital: 'City Hospital', next_transfusion: 'Jun 20', stored: 1, target: 2, status: 'low' },
          { name: 'Team Priya', blood_group: 'O+', hospital: 'City Hospital', next_transfusion: 'Jun 9', stored: 1, target: 1, status: 'sufficient' },
          { name: 'Team Asha', blood_group: 'A+', hospital: 'City Hospital', next_transfusion: 'Jun 11', stored: 0, target: 1, status: 'critical' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLog = async () => {
    try {
      setLoading(true)
      const donorSelect = document.querySelector('select:first-of-type')
      const bridgeSelect = document.querySelector('select:nth-of-type(2)')
      const dateInput = document.querySelector('input[type="date"]')

      await api.logDonation({
        donor_id: donorSelect.value,
        bridge_id: bridgeSelect.value,
        donation_date: dateInput.value,
      })

      setLogged(true)
      onLogDonation()
      // Reload inventory after logging
      setTimeout(() => loadInventory(), 500)
    } catch (err) {
      console.error('Failed to log donation:', err)
      alert('Failed to log donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="g4">
        <MetricCard value={inventory?.total_units || totalUnits} label="Total units stored" sub={{ text: 'Across all blood banks', style: { color: '#16A34A' } }} />
        <MetricCard value={inventory?.fresh_units || 41} label="Fresh (<7 days)" valueColor="#16A34A" sub={{ text: 'Within Thalassemia target', style: { color: 'var(--muted)' } }} />
        <MetricCard value={inventory?.low_stock_bridges || 4} label="Low stock bridges" valueColor="#D97706" sub={{ text: 'Below buffer target', style: { color: 'var(--muted)' } }} />
        <MetricCard value={inventory?.critical_shortage || 2} label="Critical shortage" valueColor="#DC2626" sub={{ text: '0 units, transfusion soon', style: { color: 'var(--muted)' } }} />
      </div>
      <div className="card">
        <div className="ctitle">Log a donation (staff enters after donor visits blood bank)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label className="form-label">Donor</label>
            <select className="form-input">
              <option>Suresh K. — B+</option>
              <option>Donor B — O+</option>
              <option>Lakshmi T. — O+</option>
            </select>
          </div>
          <div>
            <label className="form-label">Bridge / Patient</label>
            <select className="form-input">
              <option>Team Ramu (B+)</option>
              <option>Team Priya (O+)</option>
              <option>Team Asha (A+)</option>
            </select>
          </div>
          <div>
            <label className="form-label">Donation date</label>
            <input type="date" className="form-input" defaultValue="2026-06-06" />
          </div>
          <button className={`btn btn-green ${logged ? 'btn-disabled' : ''}`} onClick={handleLog} disabled={loading || logged}>
            {loading ? 'Processing...' : logged ? 'Logged ✓' : 'Log donation'}
          </button>
        </div>
      </div>
      <div className="card">
        <div className="ctitle">Current inventory by bridge</div>
        <div className="inv-row" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Team Ramu · B+</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>City Hospital · Next: Jun 20</div></div>
          <ProgressBar pct={50} color="#D97706" width={120} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', minWidth: 40, textAlign: 'right' }}>1/2</span>
          <Badge variant="ba">Low · buffer missing</Badge>
        </div>
        <div className="inv-row" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Team Priya · O+</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>City Hospital · Next: Jun 9</div></div>
          <ProgressBar pct={100} color="#16A34A" width={120} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', minWidth: 40, textAlign: 'right' }}>1/1</span>
          <Badge variant="bg">Sufficient ✓</Badge>
        </div>
        <div className="inv-row" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Team Asha · A+</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>City Hospital · Next: Jun 11 — 5 DAYS</div></div>
          <ProgressBar pct={0} color="#DC2626" width={120} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', minWidth: 40, textAlign: 'right' }}>0/1</span>
          <Badge variant="br">CRITICAL · cascade active</Badge>
        </div>
      </div>
    </>
  )
}
