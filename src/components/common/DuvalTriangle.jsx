import React from 'react';

export default function DuvalTriangle({ ch4 = 340, c2h4 = 485, c2h2 = 210, assetName = 'Asset' }) {
  const sum = (ch4 || 0) + (c2h4 || 0) + (c2h2 || 0) || 1;
  const pctCH4 = Math.round((ch4 / sum) * 100);
  const pctC2H4 = Math.round((c2h4 / sum) * 100);
  const pctC2H2 = Math.round((c2h2 / sum) * 100);

  // Barycentric coordinates to cartesian (Triangle: Top(150,20), Left(20,245), Right(280,245))
  // Top = 100% %CH4, Left = 100% %C2H2, Right = 100% %C2H4
  const ptX = (150 * pctCH4 + 280 * pctC2H4 + 20 * pctC2H2) / 100;
  const ptY = (20 * pctCH4 + 245 * pctC2H4 + 245 * pctC2H2) / 100;

  // Determine fault category
  let faultZone = 'D2';
  let faultName = 'D2 - High Energy Electrical Arc';
  let faultColor = '#e11d48';

  if (pctC2H2 > 13) {
    if (pctC2H4 >= 38) {
      faultZone = 'D2';
      faultName = 'D2: High Energy Arcing (Severe Inter-Turn Breakdown)';
      faultColor = '#e11d48';
    } else {
      faultZone = 'D1';
      faultName = 'D1: Low Energy Sparking / Partial Arcing';
      faultColor = '#ea580c';
    }
  } else if (pctCH4 > 98) {
    faultZone = 'PD';
    faultName = 'PD: Partial Discharge';
    faultColor = '#8b5cf6';
  } else if (pctC2H4 < 23) {
    faultZone = 'T1';
    faultName = 'T1: Thermal Fault < 300°C';
    faultColor = '#3b82f6';
  } else if (pctC2H4 < 50) {
    faultZone = 'T2';
    faultName = 'T2: Thermal Fault 300°C - 700°C';
    faultColor = '#f59e0b';
  } else {
    faultZone = 'T3';
    faultName = 'T3: Thermal Fault > 700°C';
    faultColor = '#dc2626';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 300, height: 265 }}>
        <svg width="300" height="265" viewBox="0 0 300 265" style={{ overflow: 'visible' }}>
          {/* Main Triangle Outer boundary */}
          <polygon
            points="150,20 280,245 20,245"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* D2 Zone Polygon: High Energy Arc (Bottom Center/Right area) */}
          <polygon
            points="130,165 240,245 105,245"
            fill="rgba(225, 29, 72, 0.18)"
            stroke="#e11d48"
            strokeWidth="1.2"
          />
          <text x="160" y="225" fill="#be123c" fontSize="11" fontWeight="700" textAnchor="middle">
            D2 (Arcing)
          </text>

          {/* D1 Zone: Low Energy Discharge (Bottom Left) */}
          <polygon
            points="95,145 130,165 105,245 20,245"
            fill="rgba(234, 88, 12, 0.14)"
            stroke="#ea580c"
            strokeWidth="1"
          />
          <text x="75" y="215" fill="#c2410c" fontSize="10" fontWeight="600" textAnchor="middle">
            D1
          </text>

          {/* T3 Zone: High Temp Thermal >700C (Right side) */}
          <polygon
            points="180,95 280,245 240,245 130,165"
            fill="rgba(245, 158, 11, 0.15)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <text x="215" y="195" fill="#b45309" fontSize="10" fontWeight="600" textAnchor="middle">
            T3
          </text>

          {/* T2 & T1 Zones */}
          <polygon
            points="150,45 180,95 130,165 95,145"
            fill="rgba(59, 130, 246, 0.12)"
            stroke="#3b82f6"
            strokeWidth="1"
          />
          <text x="140" y="115" fill="#1d4ed8" fontSize="10" fontWeight="600" textAnchor="middle">
            T2/T1
          </text>

          {/* PD Zone at Apex */}
          <polygon
            points="150,20 160,45 140,45"
            fill="rgba(139, 92, 246, 0.2)"
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <text x="150" y="38" fill="#6d28d9" fontSize="8" fontWeight="700" textAnchor="middle">
            PD
          </text>

          {/* Vertex Labels */}
          <text x="150" y="12" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="middle">
            %CH4 (100%)
          </text>
          <text x="10" y="260" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="start">
            %C2H2 (100%)
          </text>
          <text x="290" y="260" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="end">
            %C2H4 (100%)
          </text>

          {/* Grid Guideline to active point */}
          <line x1="20" y1="245" x2={ptX} y2={ptY} stroke="#e11d48" strokeDasharray="2,2" strokeWidth="1" opacity="0.6" />
          <line x1="280" y1="245" x2={ptX} y2={ptY} stroke="#e11d48" strokeDasharray="2,2" strokeWidth="1" opacity="0.6" />
          <line x1="150" y1="20" x2={ptX} y2={ptY} stroke="#e11d48" strokeDasharray="2,2" strokeWidth="1" opacity="0.6" />

          {/* Target Active Data Point with Pulse */}
          <circle cx={ptX} cy={ptY} r="9" fill={faultColor} opacity="0.25" />
          <circle cx={ptX} cy={ptY} r="5" fill={faultColor} stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div style={{
        marginTop: '0.75rem',
        padding: '0.4rem 0.75rem',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: '4px',
        fontSize: '0.74rem',
        color: '#be123c',
        fontWeight: 600,
        textAlign: 'center',
        width: '100%'
      }}>
        Fault Diagnostic: <strong style={{ color: faultColor }}>{faultName}</strong>
      </div>
    </div>
  );
}
