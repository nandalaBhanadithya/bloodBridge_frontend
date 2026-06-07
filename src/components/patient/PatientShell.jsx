import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import PatientHero from './PatientHero'
import DashboardTab from './sections/DashboardTab'
import ScheduleTab from './sections/ScheduleTab'
import TeamTab from './sections/TeamTab'
import MeetupTab from './sections/MeetupTab'
import EventsTab from './sections/EventsTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'schedule', label: 'My schedule' },
  { id: 'team', label: 'My donors' },
  { id: 'meetup', label: 'Request meetup' },
  { id: 'events', label: 'Events' },
]

export default function PatientShell() {
  const { logout, user } = useAuth()
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="patient-view">
      <div style={{ background: '#0c4a6e', padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 800, color: '#fff' }}>
          BloodBridge<span style={{ color: '#7DD3FC' }}>AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#7DD3FC', fontWeight: 600 }}>Welcome, {user?.name || 'Priya'}</span>
          <div className="av" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', width: 32, height: 32 }}>{user?.name?.substring(0, 2).toUpperCase() || 'PM'}</div>
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
      <PatientHero />
      <div className="tab-wrap" style={{ background: '#fff', borderBottom: '1px solid #BAE6FD' }}>
        {TABS.map((t) => (
          <div key={t.id} className={`tab-item ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="sec on">
          {tab === 'dashboard' && <DashboardTab onMeetupClick={() => setTab('meetup')} />}
          {tab === 'schedule' && <ScheduleTab />}
          {tab === 'team' && <TeamTab />}
          {tab === 'meetup' && <MeetupTab />}
          {tab === 'events' && <EventsTab />}
        </div>
      </div>
    </div>
  )
}
