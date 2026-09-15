import React, { useState } from 'react';
import {
  CloudLightning,
  Wind,
  Droplets,
  AlertTriangle,
  Compass,
  TrendingUp,
  Activity,
  ShieldAlert,
  Radio,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { WEATHER_FUSION_DATA } from '../../data/weatherFusionData';
import confetti from 'canvas-confetti';

export default function WeatherSevereFusion({ onNavigateToAsset }) {
  const [activeResilienceHour, setActiveResilienceHour] = useState(3.5);
  const [resilienceExecuted, setResilienceExecuted] = useState(false);
  const [actionStates, setActionStates] = useState({
    lockout: false,
    dlr: false,
    aquaBarrier: false
  });

  const handleExecuteResilience = () => {
    setResilienceExecuted(true);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleAction = (key) => {
    setActionStates((p) => ({ ...p, [key]: true }));
    try {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.85 } });
    } catch (e) {}
  };

  // Dynamic simulation calculations based on the hour slider
  const avoidedMeters = Math.round(180000 + activeResilienceHour * 11000);
  const thermalReliefDelta = (18 + activeResilienceHour * 1.95).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Fusion ID & Combined Risk Coefficient */}
      <div className="eoc-card" style={{ borderLeft: '5px solid #e11d48' }}>
        <div className="eoc-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 6 }}>
              <span className="badge badge-critical">CODE RED: 4.5 HOURS TO IMPACT</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                FUSION ID {WEATHER_FUSION_DATA.fusionId}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>
              {WEATHER_FUSION_DATA.systemName}
            </h2>

            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, maxWidth: 780 }}>
              Active multi-physics vector fusion: Convective precipitation cell compounding on saturated coastal soil basins with sustained 68-78 mph gale fronts intersecting the primary 345kV North-South bulk transmission corridor.
            </p>

            {/* Badges strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.85rem', fontSize: '0.72rem', color: '#64748b' }}>
              <span>NEXRAD DUAL-POL: <strong style={{ color: '#059669' }}>LOCKED</strong></span>
              <span>LIGHTNING CLUSTER: <strong style={{ color: '#e11d48' }}>3,420/HR</strong></span>
              <span>INUNDATION CREST: <strong style={{ color: '#ea580c' }}>T+3.2H</strong></span>
              <span>CORRIDOR BAROMETRIC DROP: <strong style={{ color: '#0284c7' }}>-18.4 hPa</strong></span>
              <span>SPATIAL RESOLUTION: <strong style={{ color: '#0f172a' }}>250m Osmotic Grid</strong></span>
            </div>
          </div>

          {/* Combined Risk Score Circle */}
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 8,
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: 220
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#be123c', display: 'block' }}>
              Combined Risk Coefficient
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#e11d48', fontFamily: 'monospace', lineHeight: 1.1 }}>
              {WEATHER_FUSION_DATA.combinedRiskCoefficient}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#9f1239' }}>/ 100 SEVERE THREAT</span>

            <div style={{ fontSize: '0.68rem', color: '#be123c', marginTop: 8, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div>• Asset Thermal Strain: <strong>95.4%</strong></div>
              <div>• Wind Gust Cone: <strong>78 mph Max</strong></div>
              <div>• Precip Accumulation: <strong>3.5 in/hr</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Vector Dynamic Corridor GIS & 72h Synchronized Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Left: Vector Dynamic Corridor GIS Map */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Compass size={16} color="#0284c7" />
              Vector Dynamic Corridor GIS
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>Live Fusion</span>
              <span className="badge badge-normal" style={{ fontSize: '0.62rem' }}>Doppler Radar</span>
              <span className="badge badge-severe" style={{ fontSize: '0.62rem' }}>Wind Field</span>
              <span className="badge badge-critical" style={{ fontSize: '0.62rem' }}>Flood Contours</span>
            </div>
          </div>

          <div style={{ position: 'relative', height: 260, background: '#0a101f', overflow: 'hidden' }}>
            {/* SVG Corridor Graphic representing Line 502 High Sag & Substation Inundation */}
            <svg width="100%" height="100%" viewBox="0 0 450 260">
              {/* Flood Contours Gradient */}
              <defs>
                <linearGradient id="floodGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(2, 132, 199, 0.45)" />
                  <stop offset="70%" stopColor="rgba(225, 29, 72, 0.25)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0.05)" />
                </linearGradient>
              </defs>

              <path
                d="M 20 250 Q 140 180 260 210 T 430 140 L 450 260 L 20 260 Z"
                fill="url(#floodGrad)"
              />

              {/* Transmission Corridor Line 502 with Sag Arc */}
              <path
                d="M 50 80 Q 220 175 390 90"
                fill="none"
                stroke="#e11d48"
                strokeWidth="3.5"
              />

              {/* Ground clearance line (Safe clearance threshold) */}
              <path
                d="M 50 145 Q 220 145 390 145"
                fill="none"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Tower markers */}
              <circle cx="50" cy="80" r="5" fill="#3b82f6" />
              <circle cx="390" cy="90" r="5" fill="#3b82f6" />

              {/* Sag Deficit Tag */}
              <rect x="140" y="145" width="160" height="42" fill="rgba(255, 255, 255, 0.95)" rx="4" stroke="#e11d48" strokeWidth="1" />
              <text x="150" y="162" fill="#be123c" fontSize="9" fontWeight="800">
                LINE 502 (SPANS 48-54)
              </text>
              <text x="150" y="177" fill="#0f172a" fontSize="8" fontWeight="600">
                Sag: 24.2ft (Lim 22.0ft) • 68mph Gusts
              </text>

              {/* Substation 18 Inundation Node */}
              <circle cx="110" cy="220" r="7" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
              <rect x="125" y="208" width="150" height="34" fill="rgba(255, 255, 255, 0.95)" rx="4" stroke="#ea580c" strokeWidth="1" />
              <text x="133" y="222" fill="#c2410c" fontSize="8" fontWeight="800">
                SUBSTATION 18 — INUNDATION
              </text>
              <text x="133" y="234" fill="#64748b" fontSize="7.5" fontWeight="600">
                Elev: -2.3ft | Pump #2 Fault
              </text>
            </svg>
          </div>

          {/* Real-time Substation Gauges Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--bg-subtle)',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.72rem'
          }}>
            <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Substation 18 Water Level</span>
              <strong style={{ color: '#be123c' }}>{WEATHER_FUSION_DATA.corridorGauges.substation18FloodBerm}</strong>
            </div>

            <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Canopy Clearance Margin</span>
              <strong style={{ color: '#be123c' }}>{WEATHER_FUSION_DATA.corridorGauges.line502CanopyMargin}</strong>
            </div>

            <div style={{ background: '#fff7ed', padding: '0.45rem', borderRadius: 4, border: '1px solid #fed7aa' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Conductor Temp (DLR)</span>
              <strong style={{ color: '#ea580c' }}>{WEATHER_FUSION_DATA.corridorGauges.line502ConductorTemp}</strong>
            </div>

            <div style={{ background: '#f0f9ff', padding: '0.45rem', borderRadius: 4, border: '1px solid #bae6fd' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Corridor Real-Time Limit</span>
              <strong style={{ color: '#0284c7' }}>{WEATHER_FUSION_DATA.corridorGauges.corridorRealtimeLimit}</strong>
            </div>
          </div>
        </div>

        {/* Right: 72h Synchronized Multi-Parameter Curve & Zones */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Activity size={16} color="#0284c7" />
              72h Synchronized Multi-Parameter Curve
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>MODEL: NWS-ES-V4</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Correlates forecast severe atmospheric curves directly against real-time transmission thermal capacity and load surges.
            </p>

            {/* SVG 72h curve */}
            <div style={{ width: '100%', height: 140 }}>
              <svg width="100%" height="140" viewBox="0 0 340 140">
                {/* Background */}
                <rect x="25" y="10" width="300" height="100" fill="#f8fafc" stroke="#e2e8f0" rx="3" />

                {/* Storm Peak window */}
                <rect x="85" y="10" width="65" height="100" fill="rgba(225, 29, 72, 0.08)" />
                <text x="117" y="24" fill="#be123c" fontSize="7.5" fontWeight="800" textAnchor="middle">
                  STORM PEAK
                </text>

                {/* Wind curve (Red) */}
                <path
                  d="M 25 75 Q 85 60 115 25 T 180 60 T 260 85 T 325 95"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                />

                {/* Load MW curve (Blue) */}
                <path
                  d="M 25 50 Q 85 45 115 35 T 180 55 T 260 70 T 325 75"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                />

                {/* Exposure Curve (Amber) */}
                <path
                  d="M 25 65 Q 85 45 115 20 T 180 50 T 260 80 T 325 98"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />

                {/* X labels */}
                <text x="25" y="125" fill="#64748b" fontSize="7.5">T-0</text>
                <text x="115" y="125" fill="#be123c" fontSize="7.5" fontWeight="800" textAnchor="middle">T+4h (Peak)</text>
                <text x="180" y="125" fill="#64748b" fontSize="7.5" textAnchor="middle">T+12h</text>
                <text x="260" y="125" fill="#64748b" fontSize="7.5" textAnchor="middle">T+24h</text>
                <text x="325" y="125" fill="#64748b" fontSize="7.5" textAnchor="end">T+72h</text>
              </svg>
            </div>

            {/* Metric Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', fontSize: '0.72rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.4rem', borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.62rem', display: 'block' }}>PEAK WIND</span>
                <strong style={{ color: '#e11d48' }}>78.4 mph</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.4rem', borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.62rem', display: 'block' }}>GRID LOAD</span>
                <strong style={{ color: '#0284c7' }}>4,890 MW</strong>
              </div>
              <div style={{ background: '#fff1f2', padding: '0.4rem', borderRadius: 4, border: '1px solid #fecdd3', textAlign: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.62rem', display: 'block' }}>EXPOSURE</span>
                <strong style={{ color: '#be123c' }}>96.8 / 100</strong>
              </div>
            </div>

            {/* Zone Vulnerability Matrix Strip */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Zone Vulnerability Score (Z1-Z6)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.25rem' }}>
                {WEATHER_FUSION_DATA.zoneVulnerabilities.map((z, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.35rem 0.2rem',
                      textAlign: 'center',
                      borderRadius: 4,
                      background: z.color === 'critical' ? '#fff1f2' : z.color === 'severe' ? '#fff7ed' : '#f0fdf4',
                      border: `1px solid ${z.color === 'critical' ? '#fecdd3' : z.color === 'severe' ? '#fed7aa' : '#bbf7d0'}`,
                      fontSize: '0.68rem'
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '0.6rem', display: 'block' }}>Z{idx + 1}</span>
                    <strong style={{ color: z.color === 'critical' ? '#be123c' : z.color === 'severe' ? '#c2410c' : '#15803d' }}>
                      {z.score}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlated Failure Hazard Matrix Table */}
      <div className="eoc-card">
        <div className="eoc-card-header">
          <div className="eoc-card-title">
            <CloudLightning size={16} color="#e11d48" />
            Correlated Failure Hazard Matrix
          </div>
          <span className="badge badge-critical">3 ACTIVE CRITICAL INTERSECTIONS</span>
        </div>

        <div className="eoc-table-container">
          <table className="eoc-table">
            <thead>
              <tr>
                <th>Monitored Asset &amp; Coordinates</th>
                <th>Meteorological Threat Vector</th>
                <th>SCADA / IoT Sensor Telemetry</th>
                <th>Compounded Failure Consequence</th>
                <th>Outage ETA</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {WEATHER_FUSION_DATA.correlatedHazards.map((haz) => (
                <tr key={haz.id}>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{haz.asset}</strong>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{haz.voltage}</span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {haz.weatherVector}
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#be123c', fontFamily: 'monospace', fontWeight: 600 }}>
                    {haz.scadaTelemetry}
                  </td>
                  <td style={{ fontSize: '0.74rem', color: '#334155' }}>
                    {haz.compoundedConsequence}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#e11d48' }}>
                      {haz.outageEta}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${haz.urgency === 'CRITICAL' || haz.urgency === 'IMMINENT' ? 'critical' : 'severe'}`}>
                      {haz.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: 8-Hour Grid Resilience Simulator & Prescriptive Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.25rem' }}>
        {/* 8-Hour Grid Resilience Simulator */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Sliders size={16} color="#0284c7" />
              8-Hour Grid Resilience Simulator
            </div>
            <span className="badge badge-primary">AI ACTIVE</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.4 }}>
              Slide horizon forward to test predictive topological isolation, automated NERC load transfers, and emergency battery room de-energization before storm eye wall entry.
            </p>

            {/* Interactive Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                  Simulation +{activeResilienceHour} Hours (Pre-Convective Crest)
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                  T+{activeResilienceHour}h
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={activeResilienceHour}
                onChange={(e) => setActiveResilienceHour(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: 2 }}>
                <span>T+0h (Now)</span>
                <span>T+2h</span>
                <span>T+4h</span>
                <span>T+6h</span>
                <span>T+8h</span>
              </div>
            </div>

            {/* Dynamic Calculated Outcomes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '0.65rem' }}>
                <span style={{ fontSize: '0.62rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                  Avoided Customer Interruptions
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d', fontFamily: 'monospace', margin: '3px 0' }}>
                  {avoidedMeters.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.65rem', color: '#166534' }}>Meters Preserved</span>
              </div>

              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, padding: '0.65rem' }}>
                <span style={{ fontSize: '0.62rem', color: '#0369a1', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                  Transformer Thermal Relief
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', fontFamily: 'monospace', margin: '3px 0' }}>
                  -{thermalReliefDelta} °C
                </div>
                <span style={{ fontSize: '0.65rem', color: '#0369a1' }}>Winding Hotspot Reduction</span>
              </div>
            </div>

            <button
              className={`btn ${resilienceExecuted ? 'btn-outline' : 'btn-primary'}`}
              onClick={handleExecuteResilience}
              disabled={resilienceExecuted}
              style={{ width: '100%' }}
            >
              {resilienceExecuted ? (
                <><CheckCircle2 size={15} color="#059669" /> Resilience Response Executed &amp; Dispatched</>
              ) : (
                <>Execute 8-Hour Grid Resilience Response →</>
              )}
            </button>
          </div>
        </div>

        {/* Prescriptive Pre-Impact Actions */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <ShieldAlert size={16} color="#0284c7" />
              Prescriptive Pre-Impact Actions
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>CONFIDENCE: 94.2%</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Action 1 */}
            <div style={{
              border: '1px solid #fecdd3',
              background: '#fff1f2',
              borderRadius: 6,
              padding: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.78rem', color: '#9f1239' }}>
                  <span>1. Switch Coastal Sub 9 to Remote Automation Lockout</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#be123c', marginTop: 2 }}>
                  Pre-emptively isolate transfer of 5 feeder breakers to inland Ring Bus 12 before DC battery loss.
                </p>
              </div>
              <button
                className={`btn btn-sm ${actionStates.lockout ? 'btn-outline' : 'btn-danger'}`}
                onClick={() => handleAction('lockout')}
                disabled={actionStates.lockout}
                style={{ flexShrink: 0, marginLeft: 8 }}
              >
                {actionStates.lockout ? '✓ Armed' : 'Arm Lockout'}
              </button>
            </div>

            {/* Action 2 */}
            <div style={{
              border: '1px solid #bae6fd',
              background: '#f0f9ff',
              borderRadius: 6,
              padding: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.78rem', color: '#0369a1' }}>
                  <span>2. Apply Dynamic Line Rating (DLR) Curtailment on Line 502</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: 2 }}>
                  De-rate bulk load capacity by 250 MW to cool conductor core and regain +2.6 ft ground clearance.
                </p>
              </div>
              <button
                className={`btn btn-sm ${actionStates.dlr ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => handleAction('dlr')}
                disabled={actionStates.dlr}
                style={{ flexShrink: 0, marginLeft: 8 }}
              >
                {actionStates.dlr ? '✓ Dispatched' : 'Dispatch DLR'}
              </button>
            </div>

            {/* Action 3 */}
            <div style={{
              border: '1px solid #fef3c7',
              background: '#fffbeb',
              borderRadius: 6,
              padding: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.78rem', color: '#92400e' }}>
                  <span>3. Deploy Mobile Aqua-Barrier &amp; Aux Generators to Sub 18</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#b45309', marginTop: 2 }}>
                  Staged Unit Crew #4 (ETA 42m). Immediate fortification of pump bays against 100-year storm surge crest.
                </p>
              </div>
              <button
                className={`btn btn-sm ${actionStates.aquaBarrier ? 'btn-outline' : 'btn-warning'}`}
                onClick={() => handleAction('aquaBarrier')}
                disabled={actionStates.aquaBarrier}
                style={{ flexShrink: 0, marginLeft: 8 }}
              >
                {actionStates.aquaBarrier ? '✓ Rerouted' : 'Reroute Crew #4'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: 2 }}>
              <span>NERC Standard EOP-011-2 Action Checklist: Pre-Validated</span>
              <span style={{ color: '#be123c', fontWeight: 700 }}>Review Period Expires in 18:42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
