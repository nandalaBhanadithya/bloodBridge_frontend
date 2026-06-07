import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import VolunteerSidebar from './VolunteerSidebar'
import TasksSection from './sections/TasksSection'
import BridgesSection from './sections/BridgesSection'
import EventsSection from './sections/EventsSection'
import AddNoteSection from './sections/AddNoteSection'

const TITLES = {
  tasks: 'Good morning, Lakshmi',
  bridges: 'My bridges',
  events: 'Events to oversee',
  note: 'Add a note',
}

const SECTIONS = {
  tasks: TasksSection,
  bridges: BridgesSection,
  events: EventsSection,
  note: AddNoteSection,
}

export default function VolunteerShell() {
  const { logout, user } = useAuth()
  const [section, setSection] = useState('tasks')
  const Section = SECTIONS[section]

  return (
    <div className="shell">
      <VolunteerSidebar section={section} onSectionChange={setSection} />
      <div className="main-area">
        <div style={{ background: '#1e3a5f', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 700, color: '#fff' }}>{TITLES[section]}</div>
            <div style={{ fontSize: 10, color: '#7DD3FC' }}>4 tasks today · Jun 6, 2026</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge" style={{ background: 'rgba(239,68,68,.2)', color: '#FCA5A5' }}>2 urgent</span>
            <span className="badge" style={{ background: 'rgba(125,211,252,.15)', color: '#7DD3FC' }}>8 bridges</span>
            <span className="badge" style={{ background: 'rgba(167,243,208,.15)', color: '#6EE7B7' }}>2 events</span>
            <div className="av" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', width: 32, height: 32 }}>{user?.name?.substring(0, 2).toUpperCase() || 'LV'}</div>
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
        <div className="scrollable">
          <div className="sec on">
            <Section />
          </div>
        </div>
      </div>
    </div>
  )
}
