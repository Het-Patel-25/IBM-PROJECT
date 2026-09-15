import React from 'react';

export default function ThermalCurveChart({ currentHotspot = 134.1, currentTopOil = 98.2, limit = 110.0 }) {
  const width = 340;
  const height = 150;
  const padding = { top: 20, right: 20, bottom: 25, left: 35 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Temperature range 40°C to 160°C
  const minTemp = 40;
  const maxTemp = 160;

  const getY = (temp) => padding.top + plotH - ((temp - minTemp) / (maxTemp - minTemp)) * plotH;

  // 7 Points across timeline: -14d, -7d, -2d, NOW, +1d, +2d, +3d
  const hotspotPoints = [
    { day: '-14d', x: 0, temp: 92 },
    { day: '-7d', x: plotW * 0.22, temp: 104 },
    { day: '-2d', x: plotW * 0.42, temp: 118 },
    { day: 'NOW', x: plotW * 0.58, temp: currentHotspot, isNow: true },
    { day: '+1d', x: plotW * 0.72, temp: 140, isProj: true },
    { day: '+2d', x: plotW * 0.86, temp: 146, isProj: true },
    { day: '+3d', x: plotW, temp: 152, isProj: true }
  ];

  const topOilPoints = [
    { day: '-14d', x: 0, temp: 72 },
    { day: '-7d', x: plotW * 0.22, temp: 80 },
    { day: '-2d', x: plotW * 0.42, temp: 89 },
    { day: 'NOW', x: plotW * 0.58, temp: currentTopOil, isNow: true },
    { day: '+1d', x: plotW * 0.72, temp: 102, isProj: true },
    { day: '+2d', x: plotW * 0.86, temp: 106, isProj: true },
    { day: '+3d', x: plotW, temp: 110, isProj: true }
  ];

  const createPath = (pts) => pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${padding.left + p.x} ${getY(p.temp)}`, '');

  const hotspotPath = createPath(hotspotPoints);
  const topOilPath = createPath(topOilPoints);
  const limitY = getY(limit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Grid */}
        <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="#f8fafc" stroke="#e2e8f0" rx="3" />

        {/* Projection zone fill (from NOW to +3d) */}
        <rect
          x={padding.left + (plotW * 0.58)}
          y={padding.top}
          width={plotW * 0.42}
          height={plotH}
          fill="rgba(225, 29, 72, 0.05)"
          stroke="none"
        />
        <text x={padding.left + (plotW * 0.78)} y={padding.top + 12} fill="#be123c" fontSize="8" fontWeight="700" textAnchor="middle">
          AI Projection
        </text>

        {/* IEEE 110°C Safe Limit Line */}
        <line x1={padding.left} y1={limitY} x2={padding.left + plotW} y2={limitY} stroke="#dc2626" strokeDasharray="3,3" strokeWidth="1.2" />
        <text x={padding.left + 4} y={limitY - 4} fill="#dc2626" fontSize="8" fontWeight="700">
          IEEE Limit 110°C
        </text>

        {/* Top Oil Temp Line */}
        <path d={topOilPath} fill="none" stroke="#d97706" strokeWidth="2" />

        {/* Hotspot Temp Line */}
        <path d={hotspotPath} fill="none" stroke="#e11d48" strokeWidth="2.5" />

        {/* NOW indicator vertical bar */}
        <line
          x1={padding.left + (plotW * 0.58)}
          y1={padding.top}
          x2={padding.left + (plotW * 0.58)}
          y2={padding.top + plotH}
          stroke="#0f172a"
          strokeDasharray="2,2"
          strokeWidth="1"
        />

        {/* Active Points */}
        <circle cx={padding.left + (plotW * 0.58)} cy={getY(currentHotspot)} r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx={padding.left + (plotW * 0.58)} cy={getY(currentTopOil)} r="4" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />

        {/* Catastrophic Projected Peak Indicator */}
        <circle cx={padding.left + (plotW * 0.86)} cy={getY(146)} r="3.5" fill="#be123c" />
        <text x={padding.left + (plotW * 0.86)} y={getY(146) - 5} fill="#be123c" fontSize="8" fontWeight="800" textAnchor="middle">
          146°C
        </text>

        {/* X Axis Labels */}
        <text x={padding.left} y={height - 7} fill="#64748b" fontSize="8" fontWeight="600">-14 Days</text>
        <text x={padding.left + (plotW * 0.58)} y={height - 7} fill="#0f172a" fontSize="8" fontWeight="800" textAnchor="middle">Today</text>
        <text x={padding.left + plotW} y={height - 7} fill="#64748b" fontSize="8" fontWeight="600" textAnchor="end">+3 Days</text>

        {/* Y Axis Labels */}
        <text x={padding.left - 4} y={getY(140)} fill="#64748b" fontSize="7" textAnchor="end">140°C</text>
        <text x={padding.left - 4} y={getY(100)} fill="#64748b" fontSize="7" textAnchor="end">100°C</text>
        <text x={padding.left - 4} y={getY(60)} fill="#64748b" fontSize="7" textAnchor="end">60°C</text>
      </svg>

      <div style={{
        marginTop: '0.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        padding: '0.25rem 0.5rem',
        background: '#fff1f2',
        borderRadius: 4,
        border: '1px solid #fecdd3'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ color: '#e11d48', fontWeight: 700 }}>● Hotspot: {currentHotspot}°C</span>
          <span style={{ color: '#d97706', fontWeight: 600 }}>● Top Oil: {currentTopOil}°C</span>
        </div>
        <span style={{ color: '#9f1239', fontWeight: 700 }}>Cooling: Saturated (0% Margin)</span>
      </div>
    </div>
  );
}
