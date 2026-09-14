import React, { useMemo } from 'react';

export default function PRPDScatterPlot({ peakPC = 6800, pulsesPerCycle = 1420, acousticLocation = 'Tank Core Zone B-Upper' }) {
  // Generate deterministic cluster of PRPD scatter points reflecting inter-turn arcing
  const points = useMemo(() => {
    const pts = [];
    // Positive half-cycle cluster (30° - 110°)
    for (let i = 0; i < 90; i++) {
      const phase = 35 + (i * 0.8) + (Math.sin(i * 3.7) * 8);
      const amp = (peakPC * 0.35) + (Math.abs(Math.sin((phase / 180) * Math.PI)) * (peakPC * 0.65) * (0.6 + (Math.sin(i * 4.1) * 0.4)));
      pts.push({ phase, amp, cycle: 'pos' });
    }
    // Negative half-cycle cluster (210° - 290°)
    for (let i = 0; i < 80; i++) {
      const phase = 215 + (i * 0.9) + (Math.cos(i * 2.9) * 7);
      const amp = (peakPC * 0.3) + (Math.abs(Math.sin((phase / 180) * Math.PI)) * (peakPC * 0.6) * (0.55 + (Math.sin(i * 5.3) * 0.45)));
      pts.push({ phase, amp, cycle: 'neg' });
    }
    // Random background corona specks
    for (let i = 0; i < 25; i++) {
      const phase = (i * 14.4);
      const amp = 300 + (Math.sin(i * 1.9) * 200);
      pts.push({ phase, amp, cycle: 'corona' });
    }
    return pts;
  }, [peakPC]);

  const width = 340;
  const height = 170;
  const padding = { top: 20, right: 15, bottom: 25, left: 40 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Sine wave path
  const sinePath = useMemo(() => {
    let d = '';
    for (let x = 0; x <= plotW; x += 4) {
      const phase = (x / plotW) * 360;
      const rad = (phase / 180) * Math.PI;
      // Map sin (-1 to +1) to y
      const y = padding.top + (plotH / 2) - Math.sin(rad) * (plotH * 0.42);
      d += (x === 0 ? `M ${padding.left + x} ${y}` : ` L ${padding.left + x} ${y}`);
    }
    return d;
  }, [plotW, plotH, padding]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: width }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background */}
          <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="#f8fafc" stroke="#e2e8f0" rx="3" />

          {/* Reference Sine Wave */}
          <path d={sinePath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.75" />

          {/* Critical Threshold Line */}
          <line
            x1={padding.left}
            y1={padding.top + (plotH * (1 - peakPC / 8000))}
            x2={padding.left + plotW}
            y2={padding.top + (plotH * (1 - peakPC / 8000))}
            stroke="#e11d48"
            strokeDasharray="2,2"
            strokeWidth="1"
          />
          <text
            x={padding.left + plotW - 5}
            y={padding.top + (plotH * (1 - peakPC / 8000)) - 4}
            fill="#e11d48"
            fontSize="9"
            fontWeight="700"
            textAnchor="end"
          >
            Peak: {peakPC.toLocaleString()} pC
          </text>

          {/* Scatter points */}
          {points.map((pt, idx) => {
            const cx = padding.left + (pt.phase / 360) * plotW;
            const cy = padding.top + plotH - (pt.amp / 8000) * plotH;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={pt.amp > 5000 ? 2.8 : 2}
                fill={pt.amp > 5000 ? '#e11d48' : pt.amp > 2500 ? '#ea580c' : '#3b82f6'}
                opacity={0.8}
              />
            );
          })}

          {/* Axis Labels */}
          <text x={padding.left} y={height - 8} fill="#64748b" fontSize="9" fontWeight="600">0°</text>
          <text x={padding.left + (plotW / 4)} y={height - 8} fill="#64748b" fontSize="9" fontWeight="600">90°</text>
          <text x={padding.left + (plotW / 2)} y={height - 8} fill="#64748b" fontSize="9" fontWeight="600">180°</text>
          <text x={padding.left + (plotW * 0.75)} y={height - 8} fill="#64748b" fontSize="9" fontWeight="600">270°</text>
          <text x={padding.left + plotW} y={height - 8} fill="#64748b" fontSize="9" fontWeight="600" textAnchor="end">360°</text>

          {/* Y Axis Labels */}
          <text x={padding.left - 5} y={padding.top + 8} fill="#64748b" fontSize="8" fontWeight="600" textAnchor="end">8k pC</text>
          <text x={padding.left - 5} y={padding.top + (plotH / 2)} fill="#64748b" fontSize="8" fontWeight="600" textAnchor="end">4k</text>
          <text x={padding.left - 5} y={padding.top + plotH} fill="#64748b" fontSize="8" fontWeight="600" textAnchor="end">0</text>
        </svg>
      </div>

      <div style={{
        marginTop: '0.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: '0.72rem',
        color: '#475569'
      }}>
        <span>Acoustic TDOA: <strong style={{ color: '#be123c' }}>{acousticLocation}</strong></span>
        <span>Rate: <strong style={{ color: '#0f172a' }}>{pulsesPerCycle} pulses/cycle</strong></span>
      </div>
    </div>
  );
}
