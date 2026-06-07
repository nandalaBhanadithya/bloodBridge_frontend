import { useLiveTick } from '../../hooks/useLiveTick'

export default function Heatmap({ size = 'overview', timestampOnly = false }) {
  const timestamp = useLiveTick()
  const large = size === 'large'

  if (timestampOnly) {
    return (
      <span
        style={{
          fontSize: 10,
          color: 'var(--muted)',
          fontWeight: 400,
          marginLeft: 'auto',
          textTransform: 'none',
          letterSpacing: 0,
        }}
      >
        {timestamp}
      </span>
    )
  }

  return large ? (
        <svg width="100%" viewBox="0 0 420 300" style={{ background: '#EFF6FF', borderRadius: 8, display: 'block' }}>
          <ellipse cx="220" cy="155" rx="190" ry="130" fill="#DBEAFE" opacity=".5" />
          <line x1="0" y1="100" x2="420" y2="100" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="0" y1="200" x2="420" y2="200" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="140" y1="0" x2="140" y2="300" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="280" y1="0" x2="280" y2="300" stroke="#BFDBFE" strokeWidth=".5" />
          <circle cx="281" cy="212" r="55" fill="#86EFAC" opacity=".18" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="357" cy="225" r="52" fill="#86EFAC" opacity=".16" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="268" cy="283" r="42" fill="#FEF08A" opacity=".28" stroke="#CA8A04" strokeWidth=".5" />
          <circle cx="321" cy="56" r="47" fill="#86EFAC" opacity=".15" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="59" cy="160" r="34" fill="#FCA5A5" opacity=".22" stroke="#DC2626" strokeWidth=".5" />
          <circle className="cring" cx="59" cy="160" r="40" fill="none" stroke="#DC2626" strokeWidth="1.5" />
          <circle cx="281" cy="212" r="18" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <text x="281" y="216" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="system-ui">73P</text>
          <circle cx="357" cy="225" r="12" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <text x="357" y="229" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="system-ui">7P</text>
          <circle cx="268" cy="283" r="10" fill="#CA8A04" stroke="#fff" strokeWidth="2" />
          <text x="268" y="287" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">2P</text>
          <circle cx="321" cy="56" r="10" fill="#16A34A" stroke="#fff" strokeWidth="2" />
          <text x="321" y="60" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">1P</text>
          <circle cx="59" cy="160" r="12" fill="#DC2626" stroke="#fff" strokeWidth="2.5" />
          <text x="59" y="164" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="system-ui">!</text>
          <text x="281" y="238" textAnchor="middle" fill="#166534" fontSize="9" fontFamily="system-ui">City Hosp. · 1,334D</text>
          <text x="365" y="246" textAnchor="middle" fill="#166534" fontSize="9" fontFamily="system-ui">Gandhi · 920D</text>
          <text x="255" y="278" textAnchor="end" fill="#713F12" fontSize="9" fontFamily="system-ui">Nampally · 25D</text>
          <text x="321" y="44" textAnchor="middle" fill="#166534" fontSize="9" fontFamily="system-ui">Secunderabad · 27D</text>
          <text x="59" y="145" textAnchor="middle" fill="#991B1B" fontSize="9" fontWeight="700" fontFamily="system-ui">CRITICAL</text>
          <text x="59" y="180" textAnchor="middle" fill="#991B1B" fontSize="8" fontFamily="system-ui">Ameerpet · 0 donors</text>
        </svg>
      ) : (
        <svg width="100%" viewBox="0 0 300 230" style={{ background: '#EFF6FF', borderRadius: 8, display: 'block' }}>
          <ellipse cx="160" cy="118" rx="128" ry="97" fill="#DBEAFE" opacity=".5" />
          <line x1="0" y1="80" x2="300" y2="80" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="0" y1="148" x2="300" y2="148" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="100" y1="0" x2="100" y2="230" stroke="#BFDBFE" strokeWidth=".5" />
          <line x1="200" y1="0" x2="200" y2="230" stroke="#BFDBFE" strokeWidth=".5" />
          <circle cx="201" cy="163" r="44" fill="#86EFAC" opacity=".2" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="255" cy="173" r="42" fill="#86EFAC" opacity=".18" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="191" cy="218" r="33" fill="#FEF08A" opacity=".28" stroke="#CA8A04" strokeWidth=".5" />
          <circle cx="229" cy="43" r="38" fill="#86EFAC" opacity=".17" stroke="#16A34A" strokeWidth=".5" />
          <circle cx="42" cy="123" r="26" fill="#FCA5A5" opacity=".25" stroke="#DC2626" strokeWidth=".5" />
          <circle className="cring" cx="42" cy="123" r="32" fill="none" stroke="#DC2626" strokeWidth="1.5" />
          <circle cx="201" cy="163" r="14" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <text x="201" y="167" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="system-ui">73P</text>
          <circle cx="255" cy="173" r="10" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <text x="255" y="177" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">7P</text>
          <circle cx="191" cy="218" r="8" fill="#CA8A04" stroke="#fff" strokeWidth="2" />
          <text x="191" y="222" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">2P</text>
          <circle cx="229" cy="43" r="8" fill="#16A34A" stroke="#fff" strokeWidth="2" />
          <text x="229" y="47" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">1P</text>
          <circle cx="42" cy="123" r="10" fill="#DC2626" stroke="#fff" strokeWidth="2.5" />
          <text x="42" y="127" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="system-ui">!</text>
          <text x="207" y="184" textAnchor="middle" fill="#166534" fontSize="8" fontFamily="system-ui">City Hosp.</text>
          <text x="269" y="190" textAnchor="middle" fill="#166534" fontSize="8" fontFamily="system-ui">Gandhi</text>
          <text x="178" y="212" textAnchor="end" fill="#713F12" fontSize="8" fontFamily="system-ui">Nampally</text>
          <text x="229" y="31" textAnchor="middle" fill="#166534" fontSize="8" fontFamily="system-ui">Secunderabad</text>
          <text x="42" y="110" textAnchor="middle" fill="#991B1B" fontSize="8" fontWeight="700" fontFamily="system-ui">CRITICAL</text>
          <text x="42" y="141" textAnchor="middle" fill="#991B1B" fontSize="7" fontFamily="system-ui">Ameerpet · 0 donors</text>
          <circle cx="9" cy="221" r="4" fill="#16A34A" />
          <text x="16" y="224" fill="#374151" fontSize="7" fontFamily="system-ui">Good</text>
          <circle cx="48" cy="221" r="4" fill="#CA8A04" />
          <text x="55" y="224" fill="#374151" fontSize="7" fontFamily="system-ui">Medium</text>
          <circle cx="96" cy="221" r="4" fill="#DC2626" />
          <text x="103" y="224" fill="#374151" fontSize="7" fontFamily="system-ui">Critical</text>
          <text x="296" y="226" textAnchor="end" fill="#94A3B8" fontSize="7" fontFamily="system-ui">84 patients · Hyderabad</text>
        </svg>
      )
}
