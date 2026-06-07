import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DonorHero from './DonorHero'
import DashboardTab from './sections/DashboardTab'
import TeamTab from './sections/TeamTab'
import MeetupTab from './sections/MeetupTab'
import HistoryTab from './sections/HistoryTab'
import ActivitiesTab from './sections/ActivitiesTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'team', label: 'My team' },
  { id: 'meetup', label: 'Request meetup' },
  { id: 'history', label: 'Donation history' },
  { id: 'activities', label: 'Activities' },
]

export default function DonorShell() {
  const { logout, user } = useAuth()
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="donor-view">
      <div style={{ background: '#7f1d1d', padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, color: '#fff' }}>
          BloodBridge<span style={{ color: '#FCA5A5' }}>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#FCA5A5', fontWeight: 600 }}>Team Ramu</span>
          <div className="av" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', width: 32, height: 32 }}>{user?.name?.substring(0, 2).toUpperCase() || 'SK'}</div>
          <button
            onClick={logout}
            style={{
              padding: '4px 10px',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,.3)',
              background: 'rgba(255,255,255,.1)',
              color: '#fff',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,.1)'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <DonorHero />
      <div className="tab-wrap">
        {TABS.map((t) => (
          <div key={t.id} className={`tab-item ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="sec on">
          {tab === 'dashboard' && <DashboardTab />}
          {tab === 'team' && <TeamTab onMeetupClick={() => setTab('meetup')} />}
          {tab === 'meetup' && <MeetupTab />}
          {tab === 'history' && <HistoryTab />}
          {tab === 'activities' && <ActivitiesTab />}
        </div>
      </div>
    </div>
  )
}
