import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import AdminSidebar from './AdminSidebar'
import Overview from './sections/Overview'
import Patients from './sections/Patients'
import Donors from './sections/Donors'
import BloodStock from './sections/BloodStock'
import DensityMap from './sections/DensityMap'
import EventQueue from './sections/EventQueue'
import Reports from './sections/Reports'
import Badge from '../shared/Badge'

const TITLES = {
  overview: 'Command overview',
  patients: 'Patient management',
  donors: 'Donor management',
  stock: 'Blood stock inventory',
  map: 'Density map',
  events: 'Event coordination queue',
  reports: 'Failure reports & AI analysis',
}

const SECTIONS = {
  overview: Overview,
  patients: Patients,
  donors: Donors,
  stock: BloodStock,
  map: DensityMap,
  events: EventQueue,
  reports: Reports,
}

export default function AdminShell() {
  const { logout, user } = useAuth()
  const [section, setSection] = useState('overview')
  const [totalUnits, setTotalUnits] = useState(47)

  const logDonation = () => setTotalUnits((u) => u + 1)

  const Section = SECTIONS[section]

  return (
    <div className="shell">
      <AdminSidebar section={section} onSectionChange={setSection} />
      <div className="main-area">
        <div className="topbar">
          <div>
            <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 700 }}>{TITLES[section]}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>
              Jun 6, 2026 · <span className="dot db blink" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} />
              <span style={{ color: '#2563EB', fontWeight: 600 }}>Live</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge variant="br" blink>1 critical zone</Badge>
            <Badge variant="ba">12 in 5 days</Badge>
            <div className="av" style={{ background: '#EFF6FF', color: '#1D4ED8', width: 32, height: 32 }}>{user?.name?.substring(0, 2).toUpperCase() || 'AD'}</div>
            <button
              onClick={logout}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9'
                e.target.style.borderColor = '#cbd5e1'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff'
                e.target.style.borderColor = '#e2e8f0'
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="scrollable">
          <div className="sec on">
            {section === 'overview' && <Overview totalUnits={totalUnits} />}
            {section === 'stock' && <BloodStock totalUnits={totalUnits} onLogDonation={logDonation} />}
            {section !== 'overview' && section !== 'stock' && <Section />}
          </div>
        </div>
      </div>
    </div>
  )
}
