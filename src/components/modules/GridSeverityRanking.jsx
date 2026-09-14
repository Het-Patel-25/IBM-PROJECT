import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  TrendingDown,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Truck,
  CheckCircle2,
  FileText,
  Radio,
  Printer,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { CREW_STAGING_DATA, STAGING_METRICS } from '../../data/crewStagingData';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import confetti from 'canvas-confetti';

export default function GridSeverityRanking({
  assets,
  onNavigateToAsset,
  onOpenWorkOrder,
  onOpenNercAlert,
  onOpenIncidentReport
}) {
  const [expandedAssetId, setExpandedAssetId] = useState('xfmr-pv-500-1');
  const [voltageFilter, setVoltageFilter] = useState('ALL');
  const [planApproved, setPlanApproved] = useState(false);

  const filteredAssets = assets.filter((a) => {
    if (voltageFilter === 'ALL') return true;
    return a.voltageClass.includes(voltageFilter);
  });

  const handleApproveAll = () => {
    setPlanApproved(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.85 }
      });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Opcon Level 1 */}
      <div className="opcon-banner defcon-dark">
        <div className="opcon-badge-wrap">
          <div className="opcon-tag">CRITICAL STAGING MATRIX ACTIVE</div>
          <div className="opcon-text-wrap">
            <div className="opcon-title">
              <span className="pulsing-dot red" />
              EOC OPCON LEVEL 1 — NERC EOP-011 PROTOCOL
            </div>
            <div className="opcon-subtitle">
              Dynamic multi-physics grid impact ranking synthesized with weather vectors and N-1 dynamic load contingency.
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Title & Core Projected Metric Deltas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Grid Impact Severity Ranking &amp; Pre-Positioning Engine
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6, lineHeight: 1.45 }}>
            Algorithmic asset risk synthesis blending telemetry, N-1 dynamic load contingency models, and hurricane wind vectors to execute real-time crew pre-staging.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'white',
            border: '1px solid #bae6fd',
            borderRadius: 6,
            padding: '0.65rem 1rem',
            minWidth: 160
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#0369a1', display: 'block' }}>
              Interruption Avoidance
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }}>
              ${(STAGING_METRICS.interruptionAvoidanceDollars / 1000000).toFixed(1)}M
            </div>
            <span style={{ fontSize: '0.68rem', color: '#0284c7' }}>~ AI projected delta</span>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #a7f3d0',
            borderRadius: 6,
            padding: '0.65rem 1rem',
            minWidth: 160
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', display: 'block' }}>
              Restoration Reduction
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>
              -{STAGING_METRICS.restorationReductionPercent}%
            </div>
            <span style={{ fontSize: '0.68rem', color: '#059669' }}>
              {STAGING_METRICS.restorationReductionHours}h saved / node
            </span>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #fed7aa',
            borderRadius: 6,
            padding: '0.65rem 1rem',
            minWidth: 160
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#c2410c', display: 'block' }}>
              Crew Safety Buffer
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ea580c', fontFamily: 'monospace' }}>
              {STAGING_METRICS.crewSafetyBufferHours}h
            </div>
            <span style={{ fontSize: '0.68rem', color: '#c2410c' }}>Pre-45mph sustained</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.85rem',
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={14} color="#64748b" />
            <span style={{ fontWeight: 700, color: '#64748b' }}>FILTERS:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#64748b' }}>Voltage:</span>
            <select
              value={voltageFilter}
              onChange={(e) => setVoltageFilter(e.target.value)}
              style={{ padding: '2px 6px', fontSize: '0.75rem', borderRadius: 4, border: '1px solid #cbd5e1' }}
            >
              <option value="ALL">All Classes</option>
              <option value="500kV">500kV Bulk</option>
              <option value="345kV">345kV</option>
              <option value="230kV">230kV</option>
              <option value="138kV">138kV</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
          <strong>{filteredAssets.length} Prioritized Strategic Assets Evaluated</strong> • SCADA Merging v4.26
        </span>
      </div>

      {/* Strategic Assets Evaluated Table */}
      <div className="eoc-card">
        <div className="eoc-table-container">
          <table className="eoc-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank / Score</th>
                <th>Monitored Grid Asset</th>
                <th>Failure Prob</th>
                <th>Downstream Criticality</th>
                <th>N-1 Contingency Exposure</th>
                <th>Financial Risk</th>
                <th>Dispatch Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const isExpanded = expandedAssetId === asset.id;
                const tel = asset.telemetry || {};
                const dga = tel.dga || {};
                const weath = tel.weatherExposure || {};

                return (
                  <React.Fragment key={asset.id}>
                    <tr
                      onClick={() => setExpandedAssetId(isExpanded ? null : asset.id)}
                      style={{ cursor: 'pointer', background: isExpanded ? '#f0f9ff' : 'transparent' }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            background: asset.score > 90 ? '#fff1f2' : asset.score > 80 ? '#fff7ed' : '#fffbeb',
                            color: asset.score > 90 ? '#e11d48' : asset.score > 80 ? '#ea580c' : '#d97706',
                            border: `1px solid ${asset.score > 90 ? '#fecdd3' : asset.score > 80 ? '#fed7aa' : '#fef3c7'}`
                          }}>
                            #{asset.rank} {asset.score}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginTop: 2 }}>
                          {asset.tier} TIER
                        </span>
                      </td>

                      <td>
                        <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.85rem' }}>{asset.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {asset.voltageClass} • {asset.type} • {asset.substation}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: asset.failureProb > 85 ? '#e11d48' : '#ea580c', fontFamily: 'monospace' }}>
                            {asset.failureProb}%
                          </span>
                        </div>
                        <div style={{ width: 60, height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 3 }}>
                          <div style={{ width: `${asset.failureProb}%`, height: '100%', background: asset.failureProb > 85 ? '#e11d48' : '#ea580c', borderRadius: 2 }} />
                        </div>
                      </td>

                      <td style={{ maxWidth: 220, fontSize: '0.74rem', color: '#334155' }}>
                        {asset.downstreamCriticality}
                      </td>

                      <td style={{ maxWidth: 200, fontSize: '0.74rem' }}>
                        <span style={{ color: asset.tier === 'CRITICAL' ? '#be123c' : '#c2410c', fontWeight: 600 }}>
                          {asset.n1Contingency}
                        </span>
                      </td>

                      <td>
                        <strong style={{ fontFamily: 'monospace', color: '#0f172a', fontSize: '0.82rem' }}>
                          ${(asset.financialExposurePerHour || 0).toLocaleString()}/hr
                        </strong>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                          <span className={`badge badge-${asset.stagingStatus.includes('Transit') ? 'primary' : asset.stagingStatus.includes('Staged') ? 'normal' : 'elevated'}`}>
                            {asset.stagingStatus}
                          </span>
                          {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Deep Telemetry Drawer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ padding: 0, background: '#f8fafc', borderBottom: '2px solid #bae6fd' }}>
                          <div style={{
                            padding: '1rem 1.25rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr) auto',
                            gap: '1rem',
                            alignItems: 'center'
                          }}>
                            {/* DGA Snippet */}
                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 4 }}>
                                Real-Time DGA Telemetry
                              </span>
                              <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>
                                Acetylene (C2H2): <strong style={{ color: '#e11d48' }}>{dga.acetylene} ppm ({dga.duvalZone || 'High Arcing'})</strong>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                                Hydrogen (H2): <strong>{dga.hydrogen} ppm</strong> • CO: <strong>{dga.carbonMonoxide} ppm</strong>
                              </div>
                            </div>

                            {/* Thermal Snippet */}
                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 4 }}>
                                Thermal Loading Status
                              </span>
                              <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>
                                Winding Hotspot: <strong style={{ color: '#e11d48' }}>{tel.windingHotspot}°C</strong> (Limit {tel.hotspotLimit}°C)
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                                Top Oil Temp: <strong>{tel.topOilTemp}°C</strong> • Cooling: {tel.coolingStatus}
                              </div>
                            </div>

                            {/* Atmospheric Exposure */}
                            <div style={{ background: 'white', padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 4 }}>
                                Atmospheric Exposure
                              </span>
                              <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>
                                Sustained Wind: <strong style={{ color: '#ea580c' }}>{weath.sustainedWindMph} mph</strong> (Gusts {weath.gustWindMph} mph)
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                                Lightning Flashes (25mi): <strong>{weath.lightningFlashesPerMin}/min</strong>
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToAsset && onNavigateToAsset(asset.id);
                                }}
                              >
                                View SCADA &amp; DGA Diagnostics →
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenWorkOrder && onOpenWorkOrder(asset);
                                }}
                              >
                                Dispatch &amp; Pre-position Heavy Crew
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Tactical GIS Staging Vector & Crew Dossiers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Tactical Pre-Positioning Map / GIS Vector */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <MapPin size={16} color="#0284c7" />
              Tactical Pre-Positioning Map / GIS Staging Vector
            </div>
            <span style={{ fontSize: '0.7rem', color: '#e11d48', fontWeight: 800 }}>
              STORM EYE 84 MILES SW (MOVING 18 MPH)
            </span>
          </div>

          <div style={{ position: 'relative', height: 260, background: '#0b1329', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 450 260">
              {/* Map grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Storm Vector Track (Trajectory Arrow) */}
              <path
                d="M 60 230 Q 180 160 320 60"
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />

              {/* Storm front cone */}
              <path
                d="M 30 250 L 140 130 L 220 220 Z"
                fill="rgba(225, 29, 72, 0.18)"
              />

              {/* City Label: Houston Metro Corridor */}
              <text x="210" y="145" fill="#f8fafc" fontSize="13" fontWeight="800">
                Houston
              </text>
              <text x="210" y="160" fill="#94a3b8" fontSize="8" fontWeight="600">
                Bulk 500kV Loop
              </text>

              {/* Staging yards */}
              <circle cx="160" cy="110" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="172" y="114" fill="#a7f3d0" fontSize="8" fontWeight="700">Yard 4 (Alpha Staged)</text>

              <circle cx="280" cy="90" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text x="292" y="94" fill="#bae6fd" fontSize="8" fontWeight="700">Sector 33 (Bravo)</text>

              {/* Sentinel-2 InSAR overlay badge */}
              <rect x="230" y="195" width="180" height="45" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1" />
              <text x="240" y="213" fill="#38bdf8" fontSize="9" fontWeight="800">
                Sentinel-2 &amp; InSAR Sync Active
              </text>
              <text x="240" y="228" fill="#94a3b8" fontSize="7.5">
                Soil Saturation: 94% • High-Sag Spans Flagged
              </text>
            </svg>

            {/* GIS Overlay Legend */}
            <div style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #1e293b',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: '0.65rem',
              color: '#cbd5e1'
            }}>
              GIS Overlays: High-Sag Spans • Flood 100-yr Plain • Traffic Routing Clear
            </div>

            <div style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #1e293b',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: '0.65rem',
              color: '#94a3b8',
              fontFamily: 'monospace'
            }}>
              LAT 29.7604 N • LON 95.3698 W
            </div>
          </div>
        </div>

        {/* Tactical Crew Staging Dossiers */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Truck size={16} color="#0284c7" />
              Tactical Crew Staging
            </div>
            <span className="badge badge-normal">3 ACTIVE MOBILIZATIONS</span>
          </div>

          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: 280, overflowY: 'auto' }}>
            {CREW_STAGING_DATA.slice(0, 3).map((crew) => (
              <div
                key={crew.id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 6,
                  padding: '0.65rem',
                  background: 'var(--bg-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                    {crew.name}
                  </span>
                  <span className={`badge badge-${crew.status.includes('Transit') ? 'elevated' : 'normal'}`} style={{ fontSize: '0.62rem' }}>
                    {crew.status} {crew.etaMinutes > 0 && `(ETA ${crew.etaMinutes}m)`}
                  </span>
                </div>

                <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 4 }}>
                  {crew.specialty} ({crew.headcount} Technicians)
                </div>

                <div style={{ fontSize: '0.7rem', color: '#334155', lineHeight: 1.35 }}>
                  <div>Target: <strong>{crew.targetYard}</strong></div>
                  <div>Assigned: <strong>{crew.assignedAsset}</strong></div>
                  <div style={{ color: '#64748b', fontSize: '0.65rem', marginTop: 2 }}>Equipment: {crew.equipment}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 4, fontSize: '0.68rem' }}>
                  <span style={{ color: '#64748b', fontFamily: 'monospace' }}>Comm: {crew.radioChannel}</span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onOpenWorkOrder && onOpenWorkOrder(assets.find(a => a.id === crew.assetId))}
                    style={{ fontSize: '0.65rem', padding: '1px 6px' }}
                  >
                    View Staging Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 8
      }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
            Downtime Mitigated
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
            {STAGING_METRICS.restorationReductionHours} Hours / Node
          </div>
          <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>68% Speed Acceleration</span>
        </div>

        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
            Critical Fleet Positioned
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
            {STAGING_METRICS.criticalFleetPositioned}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 700 }}>3 Heavy, 3 Line, 2 Hydro</span>
        </div>

        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
            Safety Cutoff Compliance
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
            {STAGING_METRICS.safetyCutoffCompliance}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 700 }}>Zero bucket work in &gt;45mph</span>
        </div>
      </div>

      {/* Executive Command Bar */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 34,
            height: 34,
            background: '#0284c7',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
              Executive Incident Command Execution
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Authorized by Dir. K. Vance • SCADA Interlock Level 4 • Mutually Assured Reserve Sharing Enabled
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${planApproved ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleApproveAll}
            disabled={planApproved}
          >
            {planApproved ? (
              <><CheckCircle2 size={14} color="#059669" /> Pre-Positioning Approved (3 Teams Mobilized)</>
            ) : (
              <>Approve Full Pre-Positioning Plan (3 Teams)</>
            )}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onOpenWorkOrder && onOpenWorkOrder(assets[0])}
          >
            <FileText size={14} /> Dispatch Digital Work Orders
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={onOpenNercAlert}
          >
            <Radio size={14} /> Transmit NERC EOP-011 Notification
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={onOpenIncidentReport}
          >
            <Printer size={14} /> Incident Briefing (Print/Export)
          </button>
        </div>
      </div>
    </div>
  );
}
