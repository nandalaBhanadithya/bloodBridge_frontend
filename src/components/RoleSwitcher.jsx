const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'donor', label: 'Donor' },
  { id: 'patient', label: 'Patient' },
  { id: 'volunteer', label: 'Volunteer' },
]

export default function RoleSwitcher({ role, onRoleChange }) {
  return (
    <div className="rolebar">
      <span style={{ color: '#475569', fontSize: 11, marginRight: 4 }}>Role →</span>
      {ROLES.map((r) => (
        <button
          key={r.id}
          className={`rpill ${role === r.id ? 'on' : ''}`}
          onClick={() => onRoleChange(r.id)}
        >
          {r.label}
        </button>
      ))}
      <span style={{ color: '#334155', fontSize: 10, marginLeft: 'auto' }}>
        BloodBridge AI · bloodbridge.ai
      </span>
    </div>
  )
}
