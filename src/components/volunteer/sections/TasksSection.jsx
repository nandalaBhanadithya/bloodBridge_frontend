import { useState, useEffect } from 'react'
import Badge from '../../shared/Badge'
import { api } from '../../../services/api'

export default function TasksSection() {
  const [tasks, setTasks] = useState([])
  const [done, setDone] = useState({})
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get volunteer ID from auth context
      const data = await api.getIntegrationEvents()
      // For now, use mock data for development
      setTasks([
        { id: 1, border: '#DC2626', badge: 'br', badgeText: 'Urgent · Campaign', due: 'Due Jun 8', title: 'Guest conversion drive — Ameerpet area', desc: 'CRITICAL zone. 1 patient, 0 donors. Contact guests within 10km. This patient needs B+ donors urgently.', btn: 'btn-red', btnText: 'Start outreach campaign', doneText: 'Campaign started ✓' },
        { id: 2, border: '#EA580C', badge: 'ba', badgeText: 'Urgent · Field visit', due: 'Due Jun 10', title: 'Visit Ameerpet Clinic blood bank', desc: 'Assess capacity. Help patient register. Submit field report after.', btn: 'btn-amber', btnText: 'Mark in progress', doneText: 'Marked as in progress', progress: true },
        { id: 3, border: '#7C3AED', badge: 'bp', badgeText: 'Integration · Mandatory', due: null, dueBadge: '14 days remaining', title: 'New donor intro — Team Ramu', desc: 'Lakshmi T. joined Jun 3. Arrange first supervised meetup within 30 days of assignment (protocol).', btn: 'btn-purple', btnText: 'Schedule intro meeting', doneText: 'Meeting scheduled ✓' },
        { id: 4, border: '#2563EB', badge: 'bb', badgeText: 'Event', due: 'Due Jun 9', title: 'Art Workshop setup — Team Ramu milestone', desc: 'Jun 10 @ BW HQ. 12 RSVPs. Coordinate venue + materials.', btn: 'btn-blue', btnText: 'Confirm setup', doneText: 'Setup confirmed ✓' },
      ])
    } catch (err) {
      console.error('Failed to load tasks:', err)
      // Use mock data for development
      setTasks([
        { id: 1, border: '#DC2626', badge: 'br', badgeText: 'Urgent · Campaign', due: 'Due Jun 8', title: 'Guest conversion drive — Ameerpet area', desc: 'CRITICAL zone. 1 patient, 0 donors. Contact guests within 10km. This patient needs B+ donors urgently.', btn: 'btn-red', btnText: 'Start outreach campaign', doneText: 'Campaign started ✓' },
        { id: 2, border: '#EA580C', badge: 'ba', badgeText: 'Urgent · Field visit', due: 'Due Jun 10', title: 'Visit Ameerpet Clinic blood bank', desc: 'Assess capacity. Help patient register. Submit field report after.', btn: 'btn-amber', btnText: 'Mark in progress', doneText: 'Marked as in progress', progress: true },
        { id: 3, border: '#7C3AED', badge: 'bp', badgeText: 'Integration · Mandatory', due: null, dueBadge: '14 days remaining', title: 'New donor intro — Team Ramu', desc: 'Lakshmi T. joined Jun 3. Arrange first supervised meetup within 30 days of assignment (protocol).', btn: 'btn-purple', btnText: 'Schedule intro meeting', doneText: 'Meeting scheduled ✓' },
        { id: 4, border: '#2563EB', badge: 'bb', badgeText: 'Event', due: 'Due Jun 9', title: 'Art Workshop setup — Team Ramu milestone', desc: 'Jun 10 @ BW HQ. 12 RSVPs. Coordinate venue + materials.', btn: 'btn-blue', btnText: 'Confirm setup', doneText: 'Setup confirmed ✓' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAction = async (task) => {
    try {
      // In a real app, you'd call the appropriate API endpoint based on task type
      if (task.badge.includes('Integration')) {
        await api.approveIntegrationEvent(task.id)
      }
      if (task.progress) setProgress((p) => ({ ...p, [task.id]: true }))
      else setDone((p) => ({ ...p, [task.id]: true }))
    } catch (err) {
      console.error('Failed to complete task:', err)
      alert('Failed to complete task. Please try again.')
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading tasks...</div>
  }

  return (
    <>
      {tasks.map((t) => {
        const isDone = done[t.id]
        const isProgress = progress[t.id]
        return (
          <div key={t.id} className="tcard" style={{ borderLeftColor: t.border }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
              <Badge variant={t.badge}>{t.badgeText}</Badge>
              {t.due && <span style={{ fontSize: 10, color: 'var(--muted)' }}>{t.due}</span>}
              {t.dueBadge && <Badge variant="bp" style={{ background: '#F5F3FF', color: '#5B21B6' }}>{t.dueBadge}</Badge>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{t.desc}</div>
            <button
              className={`btn ${t.btn} ${isDone ? 'btn-disabled' : ''}`}
              style={isProgress && !isDone ? { background: '#92400E' } : {}}
              onClick={() => handleTaskAction(t)}
            >
              {isDone ? t.doneText : isProgress ? t.doneText : t.btnText}
            </button>
          </div>
        )
      })}
    </>
  )
}
