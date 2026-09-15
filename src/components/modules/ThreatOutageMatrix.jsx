import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Zap,
  TrendingUp,
  DollarSign,
  Wind,
  ShieldCheck,
  Radio,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Sliders,
  CheckCircle
} from 'lucide-react';
import ThreatRadarCanvas from '../common/ThreatRadarCanvas';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { INITIAL_STREAM_EVENTS, DYNAMIC_EVENT_POOL } from '../../data/telemetryStream';
import confetti from 'canvas-confetti';

export default function ThreatOutageMatrix({
  assets,
  onNavigateToAsset,
  onOpenNercAlert,
  onOpenWorkOrder
}) {
  const [timeStep, setTimeStep] = useState('NOW');
  const [events, setEvents] = useState(INITIAL_STREAM_EVENTS);
  const [protocolStates, setProtocolStates] = useState({
    loadShift: false,
    mobileSub: false,
    crewStage: false
  });

  // Dynamic live stream ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = DYNAMIC_EVENT_POOL[Math.floor(Math.random() * DYNAMIC_EVENT_POOL.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setEvents((prev) => [
        {
          id: 'evt-' + Date.now(),
          time: timeStr,
          severity: randomEvent.severity,
          source: randomEvent.source,
          detail: randomEvent.detail
        },
        ...prev.slice(0, 15)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleExecuteProtocol = (key) => {
    setProtocolStates((prev) => ({ ...prev, [key]: true }));
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: DEFCON 2 Inbound Threat */}
      <div className="opcon-banner defcon-dark">
        <div className="opcon-badge-wrap">
          <div className="opcon-tag">CRITICAL THREAT TIER</div>
          <div className="opcon-text-wrap">
            <div className="opcon-title">
              <span className="pulsing-dot red" />
              EOC DEFCON 2: SEVERE CONVECTIVE SQUALL LINE INBOUND
            </div>
            <div className="opcon-subtitle">
              Front intersection vector ETA: <strong>04h 28m</strong> • Sustained shear 74-88 mph • 3 Bulk Electric System (BES) 500kV corridors at cascade risk
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b' }}>EOC Incident Commander</span>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>T. Sterling • Sector 87 Lead</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={onOpenNercAlert}>
            <Radio size={14} /> Broadcast NERC Alert
          </button>
        </div>
      </div>

      {/* 5 Executive Metric Cards */}
      <div className="kpi-grid-5">
        <div className="kpi-card critical">
          <div className="kpi-header">
            <span className="kpi-label">Total Imminent Outage Risk</span>
            <AlertTriangle size={15} color="#e11d48" />
          </div>
          <div className="kpi-value" style={{ color: '#e11d48' }}>91.4%</div>
          <div className="kpi-delta" style={{ color: '#be123c' }}>▲ +18.2% vs 6h baseline</div>
          <div className="kpi-subtext">3 BES Substation Nodes Unstable</div>
        </div>

        <div className="kpi-card severe">
          <div className="kpi-header">
            <span className="kpi-label">Financial Exposure</span>
            <DollarSign size={15} color="#ea580c" />
          </div>
          <div className="kpi-value">$2.4M<span style={{ fontSize: '0.9rem', color: '#64748b' }}>/hr</span></div>
          <div className="kpi-delta" style={{ color: '#c2410c' }}>Worst-case 24h: $18.8M</div>
          <div className="kpi-subtext">Metro Biotech corridor at tier-1 peak</div>
        </div>

        <div className="kpi-card elevated">
          <div className="kpi-header">
            <span className="kpi-label">Failure Signatures</span>
            <Zap size={15} color="#d97706" />
          </div>
          <div className="kpi-value">42 <span style={{ fontSize: '0.85rem', color: '#64748b' }}>ASSETS</span></div>
          <div className="kpi-delta" style={{ color: '#b45309' }}>14 Critical • 28 Watchlist</div>
          <div className="kpi-subtext">C2H2 spikes & thermal anomalies</div>
        </div>

        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-label">Weather Convergence</span>
            <Wind size={15} color="#0284c7" />
          </div>
          <div className="kpi-value">78 <span style={{ fontSize: '0.85rem', color: '#64748b' }}>MPH</span></div>
          <div className="kpi-delta" style={{ color: '#0369a1' }}>4.5h to Impact</div>
          <div className="kpi-subtext">Front Echo intercepting 3 bulk yards</div>
        </div>

        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">Preventative Savings</span>
            <ShieldCheck size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>$12.6M</div>
          <div className="kpi-delta" style={{ color: '#059669' }}>11 averted cascade trips</div>
          <div className="kpi-subtext">Auto pre-positioning operational</div>
        </div>
      </div>

      {/* Main Command Middle Row: Geospatial BES Threat Radar & Watchlist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
        {/* Left: Geospatial BES Threat Radar */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Zap size={16} color="#0284c7" />
              Geospatial BES Threat Radar
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#64748b' }}>
              <span>PROJECTION: EPSG:3857</span>
            </div>
          </div>

          <div style={{ position: 'relative', height: 380, background: '#0a101f' }}>
            <ThreatRadarCanvas
              activeTimeStep={timeStep}
              onSelectAsset={(id) => onNavigateToAsset && onNavigateToAsset(id)}
            />

            {/* Floating Popover Snapshot for Cedar Creek T-1 */}
            <div style={{
              position: 'absolute',
              top: 55,
              right: 25,
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '0.65rem 0.85rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: 220,
              zIndex: 20
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Cedar Creek T-1</span>
                <span className="badge badge-critical" style={{ fontSize: '0.62rem', padding: '1px 4px' }}>CRITICAL 500kV</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 6 }}>Autotransformer Bank</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 2 }}>
                <span style={{ color: '#64748b' }}>Failure Prob:</span>
                <strong style={{ color: '#e11d48' }}>88.4% (&lt;10 hrs)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 2 }}>
                <span style={{ color: '#64748b' }}>Active Load:</span>
                <strong style={{ color: '#0f172a' }}>450 MW (89.2% nameplate)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span style={{ color: '#64748b' }}>Downstream:</span>
                <strong style={{ color: '#0f172a' }}>240,000 Customers</strong>
              </div>
            </div>
          </div>

          {/* Timeline Scrubber Bar */}
          <div style={{
            padding: '0.6rem 1rem',
            background: 'var(--bg-subtle)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              <Clock size={14} /> PREDICTION SCRUB:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[
                { key: 'NOW', label: 'NOW (T-0)' },
                { key: '+2h', label: '+2h Convective' },
                { key: '+6h', label: '+6h Peak Gust' },
                { key: '+12h', label: '+12h Surge' },
                { key: '+24h', label: '+24h Recovery' },
                { key: '+48h', label: '+48h Post-Event' }
              ].map((step) => (
                <button
                  key={step.key}
                  onClick={() => setTimeStep(step.key)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: timeStep === step.key ? '#0284c7' : '#cbd5e1',
                    background: timeStep === step.key ? '#0284c7' : 'white',
                    color: timeStep === step.key ? 'white' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Priority Risk Watchlist */}
        <div className="eoc-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <AlertTriangle size={16} color="#e11d48" />
              Priority Risk Watchlist
            </div>
            <span className="badge badge-critical">4 IMMINENT FAILURES</span>
          </div>

          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflowY: 'auto', maxHeight: 420 }}>
            {/* Asset 1: Pine Valley */}
            <div
              onClick={() => onNavigateToAsset && onNavigateToAsset('xfmr-pv-500-1')}
              style={{
                border: '1px solid #fecdd3',
                background: '#fff1f2',
                borderRadius: 6,
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9f1239' }}>
                  ● PINE VALLEY 500kV • T1
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e11d48', fontFamily: 'monospace' }}>
                  94.2% POF
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#be123c', marginBottom: 6 }}>
                Step-Down Autotransformer Bank
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.72rem', marginBottom: 6 }}>
                <div>
                  <span style={{ color: '#64748b' }}>DISSOLVED GAS:</span>
                  <div style={{ fontWeight: 700, color: '#9f1239' }}>185 ppm C2H2 (Thermal Arc)</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>WINDING TEMP:</span>
                  <div style={{ fontWeight: 700, color: '#9f1239' }}>118°C (Overload)</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', borderTop: '1px solid #fecdd3', paddingTop: 4 }}>
                <span style={{ color: '#64748b' }}>Exposure: <strong>$1.8M/hr</strong></span>
                <span style={{ color: '#0284c7', fontWeight: 700 }}>Rec: Reroute 200MW + Mobile XFMR →</span>
              </div>
            </div>

            {/* Asset 2: Red Bluff */}
            <div
              onClick={() => onNavigateToAsset && onNavigateToAsset('red-bluff-bkr-230')}
              style={{
                border: '1px solid #ffedd5',
                background: '#fff7ed',
                borderRadius: 6,
                padding: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9a3412' }}>
                  ● RED BLUFF • BKR-230-04
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c', fontFamily: 'monospace' }}>
                  86.1% POF
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#c2410c', marginBottom: 6 }}>
                SF6 High-Voltage Gas Breaker
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.72rem', marginBottom: 6 }}>
                <div>
                  <span style={{ color: '#64748b' }}>SF6 PRESSURE:</span>
                  <div style={{ fontWeight: 700, color: '#9a3412' }}>28 PSI (-32% Nom)</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>VIBRATION ANOMALY:</span>
                  <div style={{ fontWeight: 700, color: '#9a3412' }}>7.4 mm/s RMS</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', borderTop: '1px solid #fed7aa', paddingTop: 4 }}>
                <span style={{ color: '#64748b' }}>Bus Ties at risk</span>
                <span style={{ color: '#0284c7', fontWeight: 700 }}>Rec: Lock-out & Live Bypass →</span>
              </div>
            </div>

            {/* Asset 3: East River Feeder */}
            <div
              onClick={() => onNavigateToAsset && onNavigateToAsset('east-river-feeder-14b')}
              style={{
                border: '1px solid #fef3c7',
                background: '#fffbeb',
                borderRadius: 6,
                padding: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e' }}>
                  ● EAST RIVER • FEEDER 14B
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                  79.5% POF
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#b45309', marginBottom: 6 }}>
                Submarine Cable Pothead Termination
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.72rem', marginBottom: 6 }}>
                <div>
                  <span style={{ color: '#64748b' }}>PARTIAL DISCHARGE:</span>
                  <div style={{ fontWeight: 700, color: '#92400e' }}>4,200 pC Sustained</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>ACOUSTIC HF:</span>
                  <div style={{ fontWeight: 700, color: '#92400e' }}>Intermittent Arcing</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', borderTop: '1px solid #fde68a', paddingTop: 4 }}>
                <span style={{ color: '#64748b' }}>Exposure: <strong>$620k/hr</strong></span>
                <span style={{ color: '#0284c7', fontWeight: 700 }}>Rec: Stage IR Brow Sweep →</span>
              </div>
            </div>

            {/* Asset 4: Highland Ridge Bushing */}
            <div
              onClick={() => onNavigateToAsset && onNavigateToAsset('highland-ridge-bushing-b')}
              style={{
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                borderRadius: 6,
                padding: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                  ● HIGHLAND RIDGE • BUSHING B
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', fontFamily: 'monospace' }}>
                  74.8% POF
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 6 }}>
                Condenser Bushing Phase B
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.72rem', marginBottom: 6 }}>
                <div>
                  <span style={{ color: '#64748b' }}>POWER FACTOR (TAN δ):</span>
                  <div style={{ fontWeight: 700, color: '#334155' }}>1.4% (Degraded)</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>CAPACITANCE DRIFT:</span>
                  <div style={{ fontWeight: 700, color: '#334155' }}>+6.8% C1 Tap</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', borderTop: '1px solid #e2e8f0', paddingTop: 4 }}>
                <span style={{ color: '#64748b' }}>Thermal Delta: +14.2°C</span>
                <span style={{ color: '#0284c7', fontWeight: 700 }}>Rec: Shed 40MW off-peak →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Command Row: Autonomous Mitigation Protocols & Live Incident Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Left: Autonomous Mitigation Protocol */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Sliders size={16} color="#0284c7" />
              Autonomous Mitigation Protocol
            </div>
            <span className="badge badge-primary">OPTIMIZER ACTIVE</span>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Protocol 1: Load Shifting */}
            <div style={{
              border: '1px solid #bae6fd',
              background: '#f0f9ff',
              borderRadius: 6,
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.82rem', color: '#0369a1' }}>
                  <Zap size={15} /> Execute Pre-Storm BES Load Shifting
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4 }}>
                  SAVES $3.2M
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#0c4a6e', marginBottom: 8, lineHeight: 1.4 }}>
                Automates 180 MW diversion from Pine Valley T1 to Oakridge 500kV bypass; lowers transformer hotspot from 118°C to 84°C in 35 mins.
              </p>
              <button
                className={`btn btn-sm ${protocolStates.loadShift ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => handleExecuteProtocol('loadShift')}
                disabled={protocolStates.loadShift}
              >
                {protocolStates.loadShift ? (
                  <><CheckCircle size={14} color="#059669" /> Load Diverted (180 MW Active)</>
                ) : (
                  <>Execute Shift →</>
                )}
              </button>
            </div>

            {/* Protocol 2: Mobile Substation 4 */}
            <div style={{
              border: '1px solid #fef3c7',
              background: '#fffbeb',
              borderRadius: 6,
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.82rem', color: '#92400e' }}>
                  <TrendingUp size={15} /> Dispatch Mobile Substation 4 to Pine Valley
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: 4 }}>
                  120 MW BACKUP
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#78350f', marginBottom: 8, lineHeight: 1.4 }}>
                Secures rapid replacement capability prior to hurricane gale front closure at 21:00 UTC. Transit route clear of wind restrictions.
              </p>
              <button
                className={`btn btn-sm ${protocolStates.mobileSub ? 'btn-outline' : 'btn-warning'}`}
                onClick={() => handleExecuteProtocol('mobileSub')}
                disabled={protocolStates.mobileSub}
              >
                {protocolStates.mobileSub ? (
                  <><CheckCircle size={14} color="#059669" /> Unit 4 In-Transit (ETA 50m)</>
                ) : (
                  <>Deploy Unit ⛟</>
                )}
              </button>
            </div>

            {/* Protocol 3: Heavy Line Crews */}
            <div style={{
              border: '1px solid #bbf7d0',
              background: '#f0fdf4',
              borderRadius: 6,
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.82rem', color: '#166534' }}>
                  <ShieldCheck size={15} /> Pre-Stage Heavy Line Crews at Sector 4 Yard
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4 }}>
                  6 CREWS (18 TRUCKS)
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#14532d', marginBottom: 8, lineHeight: 1.4 }}>
                Reduces downstream estimated time to restore (ETR) from 18.5 hours to 5.8 hours across Cedar Creek and Red Bluff corridors.
              </p>
              <button
                className={`btn btn-sm ${protocolStates.crewStage ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => handleExecuteProtocol('crewStage')}
                disabled={protocolStates.crewStage}
              >
                {protocolStates.crewStage ? (
                  <><CheckCircle size={14} color="#059669" /> Crews Pre-Staged at Yard 4</>
                ) : (
                  <>Confirm Stage 52 ✓</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Incident Telemetry Stream */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Radio size={16} color="#e11d48" />
              Live Incident Telemetry Stream
            </div>
            <span style={{ fontSize: '0.7rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
              <span className="pulsing-dot green" /> STREAMING
            </span>
          </div>

          <div style={{
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: 340,
            overflowY: 'auto'
          }}>
            {events.map((evt) => (
              <div
                key={evt.id}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 4,
                  padding: '0.55rem 0.75rem',
                  background: 'var(--bg-subtle)',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`badge badge-${evt.severity === 'CRIT' ? 'critical' : evt.severity === 'WARN' ? 'severe' : 'primary'}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                      {evt.severity}
                    </span>
                    <strong style={{ color: '#0f172a' }}>{evt.source}</strong>
                  </div>
                  <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.68rem' }}>{evt.time}</span>
                </div>
                <div style={{ color: '#475569', lineHeight: 1.35, fontSize: '0.72rem' }}>
                  {evt.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
