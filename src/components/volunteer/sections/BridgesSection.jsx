import { useState } from 'react'
import Avatar from '../../shared/Avatar'
import Badge from '../../shared/Badge'

const BRIDGES = [
  { i: 'RK', bg: '#FEF3C7', c: '#92400E', name: 'Ramu K. · B+', sub: 'Jun 20 · City Hospital · 8 donors', rowBg: '#FFFBEB', border: '1px solid #FDE68A', badge: 'ba', badgeText: 'Low stock (1/2)', btn: 'ghost', btnText: 'View bridge' },
  { i: 'PM', bg: '#DCFCE7', c: '#166534', name: 'Priya M. · O+', sub: 'Jun 9 · City Hospital · 3 donors', rowBg: '#F0FDF4', border: '1px solid #BBF7D0', badge: 'bg', badgeText: 'Confirmed ✓', btn: 'ghost', btnText: 'View bridge' },
  { i: 'AB', bg: '#FEE2E2', c: '#991B1B', name: 'Asha B. · A+', sub: 'Jun 11 · City Hospital · 2 donors', rowBg: '#FEF2F2', border: '1px solid #FECACA', badge: 'br', badgeText: 'Critical · 0 units', btn: 'red', btnText: 'Escalate', escalate: true },
  { i: 'AM', bg: '#FEE2E2', c: '#991B1B', name: 'Anonymous (Ameerpet) · A+', sub: 'Jun 18 · Ameerpet Clinic · 0 donors!', rowBg: '#FEF2F2', border: '2px solid #DC2626', badge: 'br', badgeText: '0 donors — CRITICAL', btn: 'red', btnText: 'Campaign', campaign: true },
]

export default function BridgesSection() {
  const [actions, setActions] = useState({})

  return (
    <div className="card">
      <div className="ctitle">My bridges · patient status overview</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {BRIDGES.map((b, i) => (
          <div key={b.i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: b.rowBg, border: b.border, borderRadius: 9, padding: 11 }}>
            <Avatar initials={b.i} bg={b.bg} color={b.c} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.sub}</div>
            </div>
            <Badge variant={b.badge}>{b.badgeText}</Badge>
            <button
              className={`btn btn-${b.btn} ${actions[i] ? 'btn-disabled' : ''}`}
              style={{ fontSize: 11, padding: '5px 10px', ...(actions[i] && b.campaign ? { background: '#991B1B' } : {}) }}
              onClick={() => b.escalate || b.campaign ? setActions((p) => ({ ...p, [i]: true })) : undefined}
            >
              {actions[i] ? (b.escalate ? 'Escalated ✓' : 'Campaign started') : b.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
