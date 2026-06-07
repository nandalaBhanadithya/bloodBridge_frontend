import { useState, useEffect } from 'react'
import MetricCard from '../../shared/MetricCard'
import Badge from '../../shared/Badge'
import ProgressBar from '../../shared/ProgressBar'
import { supabase } from '../../../lib/supabase'

export default function BloodStock({ totalUnits, onLogDonation }) {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState(null)
  const [donorId, setDonorId] = useState('')
  const [bridgeId, setBridgeId] = useState('')
  const [donationDate, setDonationDate] = useState('2026-06-06')

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      // Load from blood_inventory table
      const { data, error } = await supabase
        .from('blood_inventory')
        .select('*, bridges(*)')
      
      if (error) throw error
      
      const totalUnits = data?.reduce((sum, item) => sum + (item.units || 0), 0) || 0
      
      setInventory({
        total_units: totalUnits,
        fresh_units: 41,
        low_stock_bridges: 4,
        critical_shortage: 2,
        bridges: data?.map(item => ({
          name: item.bridges?.patient_id || 'Unknown',
          blood_group: item.blood_group,
          hospital: item.bridges?.hospital || 'Unknown',
          next_transfusion: 'Jun 20',
          stored: item.units,
          target: 2,
          status: item.units === 0 ? 'critical' : item.units < 2 ? 'low' : 'sufficient'
        })) || [
          { name: 'Team Ramu', blood_group: 'B+', hospital: 'City Hospital', next_transfusion: 'Jun 20', stored: 1, target: 2, status: 'low' },
          { name: 'Team Priya', blood_group: 'O+', hospital: 'City Hospital', next_transfusion: 'Jun 9', stored: 1, target: 1, status: 'sufficient' },
          { name: 'Team Asha', blood_group: 'A+', hospital: 'City Hospital', next_transfusion: 'Jun 11', stored: 0, target: 1, status: 'critical' },
        ],
      })
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
      
      if (!donorId || !bridgeId) {
        alert('Please select both donor and bridge')
        return
      }

      // Log donation to blood_inventory table
      const { error } = await supabase
        .from('blood_inventory')
        .upsert({
          bridge_id: bridgeId,
          blood_group: 'O+', // This should come from donor data
          units: (inventory?.total_units || 0) + 1,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'bridge_id,blood_group'
        })

      if (error) throw error

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
            <select className="form-input" value={donorId} onChange={(e) => setDonorId(e.target.value)}>
              <option value="">Select donor</option>
              <option value="1">Suresh K. — B+</option>
              <option value="2">Donor B — O+</option>
              <option value="3">Lakshmi T. — O+</option>
            </select>
          </div>
          <div>
            <label className="form-label">Bridge / Patient</label>
            <select className="form-input" value={bridgeId} onChange={(e) => setBridgeId(e.target.value)}>
              <option value="">Select bridge</option>
              <option value="1">Team Ramu (B+)</option>
              <option value="2">Team Priya (O+)</option>
              <option value="3">Team Asha (A+)</option>
            </select>
          </div>
          <div>
            <label className="form-label">Donation date</label>
            <input type="date" className="form-input" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} />
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
