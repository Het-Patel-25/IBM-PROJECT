import React from 'react';

export default function FFTHarmonicsChart({ harmonics = [], velocityRMS = 7.4, oltcNoise = 'Loose Laminate Detected' }) {
  const maxAmp = 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Harmonic Bar Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 110,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        padding: '0.75rem 0.5rem 0.25rem',
        position: 'relative'
      }}>
        {/* Safe Threshold Line (2.5 mm/s) */}
        <div style={{
          position: 'absolute',
          bottom: `${(2.5 / maxAmp) * 100}%`,
          left: 0,
          right: 0,
          borderTop: '1px dashed #d97706',
          zIndex: 1
        }}>
          <span style={{
            position: 'absolute',
            right: 4,
            bottom: 2,
            fontSize: '0.62rem',
            color: '#d97706',
            fontWeight: 700
          }}>
            Limit 2.5 mm/s
          </span>
        </div>

        {harmonics.map((h, idx) => {
          const heightPct = Math.min(100, (h.amp / maxAmp) * 100);
          const isOver = h.amp > 2.5;
          const color = h.amp > 6 ? '#e11d48' : h.amp > 3.5 ? '#ea580c' : '#10b981';

          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '16%',
              zIndex: 2
            }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: isOver ? '#be123c' : '#475569',
                marginBottom: 2
              }}>
                {h.amp}
              </span>
              <div style={{
                width: '100%',
                maxWidth: 24,
                height: `${heightPct}%`,
                minHeight: 4,
                backgroundColor: color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.3s ease'
              }} />
              <span style={{
                fontSize: '0.65rem',
                color: '#64748b',
                marginTop: 4,
                fontWeight: 600
              }}>
                {h.freq}
              </span>
            </div>
          );
        })}
      </div>

      {/* Diagnostics summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
        marginTop: '0.65rem',
        fontSize: '0.72rem'
      }}>
        <div style={{ padding: '0.35rem 0.5rem', background: '#fff1f2', borderRadius: 4, border: '1px solid #fecdd3' }}>
          <span style={{ color: '#64748b' }}>Velocity RMS: </span>
          <strong style={{ color: '#be123c', fontFamily: 'var(--font-mono)' }}>{velocityRMS} mm/s</strong>
          <span style={{ color: '#9f1239', fontSize: '0.65rem' }}> (Limit: 2.5)</span>
        </div>
        <div style={{ padding: '0.35rem 0.5rem', background: '#fffbeb', borderRadius: 4, border: '1px solid #fef3c7' }}>
          <span style={{ color: '#64748b' }}>Clamping / Tap: </span>
          <strong style={{ color: '#b45309' }}>{oltcNoise}</strong>
        </div>
      </div>
    </div>
  );
}
