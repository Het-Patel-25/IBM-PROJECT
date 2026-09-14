import React, { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  Activity,
  Flame,
  Gauge,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import DuvalTriangle from '../common/DuvalTriangle';
import PRPDScatterPlot from '../common/PRPDScatterPlot';
import FFTHarmonicsChart from '../common/FFTHarmonicsChart';
import ThermalCurveChart from '../common/ThermalCurveChart';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';

export default function AssetTelemetryDGA({
  assets,
  selectedAssetId,
  onSelectAsset,
  onOpenWorkOrder
}) {
  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[1] || assets[0];
  const [loadShifted, setLoadShifted] = useState(false);
  const [degasActive, setDegasActive] = useState(false);

  const telemetry = currentAsset.telemetry || {};
  const dga = telemetry.dga || {};
  const pd = telemetry.partialDischarge || {};
  const vib = telemetry.vibration || {};

  const handleLoadShift = () => {
    setLoadShifted(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.85 } });
    } catch (e) {}
  };

  const handleDegas = () => {
    setDegasActive(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.85 } });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Failure Signature Manifesting Alert */}
      <div className="opcon-banner" style={{ borderLeft: '5px solid #e11d48' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="opcon-tag" style={{ background: '#e11d48' }}>ACTIVE IMPACT BAY</div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#9f1239' }}>
              Failure Signature Manifesting: Dynamic Multi-Sensor Threshold Breach
            </div>
            <div style={{ fontSize: '0.74rem', color: '#be123c' }}>
              Continuous online chromatographic and acoustic telemetry has identified active severe internal arcing. Conventional time-directed routine schedules would overlook this degradation until catastrophic physical rupture.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'right' }}>
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>
              Traditional Calendar Cycle
            </span>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
              Routine Check: 11 Months Away (Aug 2027)
            </div>
          </div>
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 6,
            padding: '0.35rem 0.75rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#be123c', display: 'block', fontWeight: 800 }}>
              PREDICTED REMAINING USEFUL LIFE
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
              48 – 72 Hours
            </div>
            <span style={{ fontSize: '0.62rem', color: '#9f1239' }}>Under 85% Anticipated Surge</span>
          </div>
        </div>
      </div>

      {/* Asset Header Card & Selector */}
      <div className="eoc-card">
        <div className="eoc-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 4 }}>
              <span className="badge badge-critical">PRIMARY CRITICALITY A1</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>UID: SB42-QFR-500-02-HV</span>
              <span className="badge badge-normal" style={{ fontSize: '0.62rem' }}>● 54 TELEMETRY CHANNELS ONLINE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 4 }}>
              <select
                value={currentAsset.id}
                onChange={(e) => onSelectAsset && onSelectAsset(e.target.value)}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '0.3rem 0.6rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.voltageClass}) — Risk Score: {a.score}
                  </option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
              {currentAsset.voltageClass} • {currentAsset.type} • Westinghouse Class OA/FA/FOA • 34 Years in Service (Commissioned 1981)
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Active Load</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                  {telemetry.loadMW || 512.4} MW
                </div>
                <span style={{ fontSize: '0.65rem', color: '#be123c' }}>89.5% Rated Nameplate</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Top Oil Temp</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#e11d48' }}>
                  {telemetry.topOilTemp || 98.2}°C
                </div>
                <span style={{ fontSize: '0.65rem', color: '#be123c' }}>+3.2°C Over Limit (95°C)</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Winding Hotspot</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#e11d48' }}>
                  {telemetry.windingHotspot || 134.1}°C
                </div>
                <span style={{ fontSize: '0.65rem', color: '#be123c' }}>Paper Degradation Active</span>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Ambient Weather</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                  {telemetry.ambientTemp || 39.4}°C
                </div>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Gusts: 68-82 Tropical</span>
              </div>
            </div>
          </div>

          {/* Asset Health Score (AHS) Gauge */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: 190
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
              Asset Health Score (AHS)
            </div>
            <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 6px' }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="38" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="8"
                  strokeDasharray="238.7"
                  strokeDashoffset="171.8" /* (100 - 28)% = 72% offset */
                  strokeLinecap="round"
                  transform="rotate(-90 45 45)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e11d48', fontFamily: 'monospace', lineHeight: 1 }}>
                  28
                </span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>/ 100 TOTAL</span>
              </div>
            </div>
            <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>STAGE 4 ESCALATION</span>
            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4 }}>
              Deprecation Rate: <strong style={{ color: '#be123c' }}>-4.2 pts / 24h</strong>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Deep Diagnostic Sensor Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {/* Pillar A: DGA Oil Analysis */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Zap size={16} color="#e11d48" />
              Pillar A: DGA Oil Analysis
            </div>
            <span className="badge badge-critical">D2 Thermal Arcing</span>
          </div>
          <div className="eoc-card-body">
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Online head-space gas extraction • Duval Triangle 1 diagnostic classification
            </p>

            <DuvalTriangle
              ch4={dga.methane || 340}
              c2h4={dga.ethylene || 485}
              c2h2={dga.acetylene || 210}
              assetName={currentAsset.name}
            />

            {/* Individual Gas PPM Breakdown Table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.4rem',
              marginTop: '0.85rem',
              fontSize: '0.72rem'
            }}>
              <div style={{ background: '#fff1f2', padding: '0.4rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Acetylene (C2H2)</span>
                <strong style={{ color: '#e11d48', fontSize: '0.85rem' }}>{dga.acetylene || 210} ppm</strong>
                <span style={{ color: '#be123c', fontSize: '0.6rem', display: 'block' }}>&gt;5 Limit</span>
              </div>
              <div style={{ background: '#fff7ed', padding: '0.4rem', borderRadius: 4, border: '1px solid #fed7aa' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Ethylene (C2H4)</span>
                <strong style={{ color: '#ea580c', fontSize: '0.85rem' }}>{dga.ethylene || 485} ppm</strong>
                <span style={{ color: '#c2410c', fontSize: '0.6rem', display: 'block' }}>High</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.4rem', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Methane (CH4)</span>
                <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{dga.methane || 340} ppm</strong>
                <span style={{ color: '#64748b', fontSize: '0.6rem', display: 'block' }}>Normal</span>
              </div>
              <div style={{ background: '#fef3c7', padding: '0.4rem', borderRadius: 4, border: '1px solid #fde68a' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Hydrogen (H2)</span>
                <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>{dga.hydrogen || 620} ppm</strong>
                <span style={{ color: '#b45309', fontSize: '0.6rem', display: 'block' }}>Elevated</span>
              </div>
            </div>

            <div style={{ marginTop: '0.65rem', fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>Gas Acceleration Rate: <strong style={{ color: '#e11d48' }}>+{dga.rateOfRisePpmDay || 18.2} ppm / Day</strong></span>
              <span>Status: <strong style={{ color: '#be123c' }}>Severe Decomposition</strong></span>
            </div>
          </div>
        </div>

        {/* Pillar B: Thermal Dynamics */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Flame size={16} color="#ea580c" />
              Pillar B: Thermal Dynamics
            </div>
            <span className="badge badge-critical">Thermal Runaway Risk</span>
          </div>
          <div className="eoc-card-body">
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Fiber-optic winding probes • IEEE C57.91 dynamic model thermal profile
            </p>

            <ThermalCurveChart
              currentHotspot={telemetry.windingHotspot || 134.1}
              currentTopOil={telemetry.topOilTemp || 98.2}
              limit={110.0}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginTop: '0.85rem',
              fontSize: '0.72rem'
            }}>
              <div style={{ background: '#f8fafc', padding: '0.45rem', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Bottom Oil Temp</span>
                <strong style={{ color: '#0f172a' }}>64.1°C</strong>
              </div>
              <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Cooling Stage Status</span>
                <strong style={{ color: '#be123c' }}>Pumps 4/4 • Fans 12/12</strong>
              </div>
              <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Cooling Margin</span>
                <strong style={{ color: '#be123c' }}>0% (Saturated)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar C: Partial Discharge */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Activity size={16} color="#0284c7" />
              Pillar C: Partial Discharge
            </div>
            <span className="badge badge-critical">Violates IEC 60270</span>
          </div>
          <div className="eoc-card-body">
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
              UHF antenna + piezoelectric acoustic array localization matrix
            </p>

            <PRPDScatterPlot
              peakPC={pd.peakPC || 6800}
              pulsesPerCycle={pd.pulsesPerCycle || 1420}
              acousticLocation={pd.acousticLocation || 'Tank Core Zone B-Upper'}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginTop: '0.85rem',
              fontSize: '0.72rem'
            }}>
              <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Dielectric Dissipation (Tan δ)</span>
                <strong style={{ color: '#be123c' }}>0.019 (Limit 0.005)</strong>
              </div>
              <div style={{ background: '#fff1f2', padding: '0.45rem', borderRadius: 4, border: '1px solid #fecdd3' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Insulation Damage State</span>
                <strong style={{ color: '#be123c' }}>Active Carbon Tracking</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar D: Vibration Spectrum & Harmonics */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Gauge size={16} color="#d97706" />
              Pillar D: Vibration Spectrum
            </div>
            <span className="badge badge-severe">ISO 20816 Severe</span>
          </div>
          <div className="eoc-card-body">
            <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Tri-axial tank accelerometer feed • Fast Fourier Transform (FFT) harmonics
            </p>

            <FFTHarmonicsChart
              harmonics={vib.harmonics || [
                { freq: '100 Hz', amp: 7.4 },
                { freq: '200 Hz', amp: 6.2 },
                { freq: '300 Hz', amp: 4.5 },
                { freq: '400 Hz', amp: 2.6 },
                { freq: '500 Hz', amp: 1.6 }
              ]}
              velocityRMS={vib.velocityRMS || 7.4}
              oltcNoise={vib.oltcNoise || 'Audible spike (Tap 14)'}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginTop: '0.85rem',
              fontSize: '0.72rem'
            }}>
              <div style={{ background: '#f8fafc', padding: '0.45rem', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Tank Acceleration Peak</span>
                <strong style={{ color: '#0f172a' }}>1.84 g pk-pk</strong>
              </div>
              <div style={{ background: '#fffbeb', padding: '0.45rem', borderRadius: 4, border: '1px solid #fef3c7' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>Mechanical Resonance</span>
                <strong style={{ color: '#b45309' }}>200Hz Deflection Detected</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physics-Informed Neural Net Timeline & Consequence Modeling */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* PINN Failure Timeline */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Sparkles size={16} color="#0284c7" />
              Physics-Informed Neural Net: Multi-Modal Failure Reconstruction
            </div>
            <span className="badge badge-primary">Dataset: 25 Yrs / 14,200 Incidents</span>
          </div>
          <div className="eoc-card-body">
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 6,
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: '#9f1239',
              lineHeight: 1.45,
              marginBottom: '1rem'
            }}>
              <strong>IDENTIFIED ROOT CAUSE:</strong> Severe paper insulation embrittlement (degree of polymerization DP &lt; 180) along high-voltage phase B turns has permitted mechanical deflection under high through-fault vibration. Localized inter-turn dielectric breakdown is generating micro-arcing (210 ppm Acetylene), exponentially driving winding hotspot thermal runaway.
            </div>

            {/* Step-by-step progress cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', fontSize: '0.72rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.65rem' }}>
                <span style={{ color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 2 }}>Phase 1: Incipient</span>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: 4 }}>Insulation Moisture & Micro-Voids</strong>
                <span style={{ color: '#64748b', fontSize: '0.68rem' }}>Detected 2 weeks ago via DGA H2 drift.</span>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '0.65rem' }}>
                <span style={{ color: '#ea580c', fontWeight: 700, display: 'block', marginBottom: 2 }}>Phase 2: Sparking</span>
                <strong style={{ color: '#c2410c', display: 'block', marginBottom: 4 }}>Inter-Turn Arcing Inception</strong>
                <span style={{ color: '#7c2d12', fontSize: '0.68rem' }}>Detected 72h ago (C2H2 threshold trip).</span>
              </div>

              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, padding: '0.65rem' }}>
                <span style={{ color: '#e11d48', fontWeight: 700, display: 'block', marginBottom: 2 }}>Phase 3: Catastrophic</span>
                <strong style={{ color: '#be123c', display: 'block', marginBottom: 4 }}>Tank Over-pressurization Imminent</strong>
                <span style={{ color: '#9f1239', fontSize: '0.68rem' }}>Catastrophic window: 48-72h.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.85rem', fontSize: '0.7rem', color: '#64748b' }}>
              <span>Model Verification: NERC Standard PRC-005-6 Compliant</span>
              <span>Inference Execution: 22ms</span>
            </div>
          </div>
        </div>

        {/* Consequence Modeling: Financial & Operational Impact */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <AlertTriangle size={16} color="#e11d48" />
              Consequence Modeling: Financial & Operational Impact Differential
            </div>
            <span className="badge badge-critical">LOSS EXPOSURE HIGH</span>
          </div>
          <div className="eoc-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              {/* Uncontrolled Failure Cost */}
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, padding: '0.75rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#be123c', display: 'block' }}>
                  Uncontrolled Catastrophic Rupture
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48', fontFamily: 'monospace', margin: '4px 0' }}>
                  $25.7M
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9f1239' }}>Rupture, fire, cleanup & emergency replacement</span>
              </div>

              {/* Preventative Cost */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 6, padding: '0.75rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', display: 'block' }}>
                  Corrective Intervention Today
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#047857', fontFamily: 'monospace', margin: '4px 0' }}>
                  $65,000
                </div>
                <span style={{ fontSize: '0.68rem', color: '#065f46' }}>Degas cycle, re-wedge & oil filtration</span>
              </div>
            </div>

            {/* Line-item breakdown */}
            <div style={{ fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Asset Replacement (500kV 600MVA Unit):</span>
                <strong style={{ color: '#0f172a' }}>$14,500,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Collateral Bus & Switchgear Fire Damage:</span>
                <strong style={{ color: '#0f172a' }}>$5,200,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dielectric Oil Environmental Remediation (EPA Superfund):</span>
                <strong style={{ color: '#0f172a' }}>$5,000,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Customer Interruption Cost (SAIDI/SAIFI Fines):</span>
                <strong style={{ color: '#0f172a' }}>$640,000 / Day</strong>
              </div>
            </div>

            <div style={{
              marginTop: '0.85rem',
              padding: '0.5rem 0.75rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 6,
              fontSize: '0.74rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>Cost-avoidance ROI: <strong>395x</strong> by executing preventative emergency order now.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Operator Intervention Action Bar */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="pulsing-dot red" />
          <div style={{ fontSize: '0.78rem' }}>
            <strong style={{ color: '#0f172a' }}>Immediate Operator Intervention Authorized:</strong>
            <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
              Clearance: Interlock Bypass Permitted • SCADA Substation Gateway: SEC-71
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className={`btn btn-sm ${loadShifted ? 'btn-outline' : 'btn-outline'}`}
            onClick={handleLoadShift}
            disabled={loadShifted}
          >
            {loadShifted ? '✓ Load Re-dispatched to 45%' : '⚡ Re-Dispatch Load to 45% (Sub 42 Bus B)'}
          </button>
          <button
            className={`btn btn-sm ${degasActive ? 'btn-outline' : 'btn-outline'}`}
            onClick={handleDegas}
            disabled={degasActive}
          >
            {degasActive ? '✓ Degasification Cycle Active' : '🔄 Trigger Automated Degasification'}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onOpenWorkOrder && onOpenWorkOrder(currentAsset)}
          >
            <FileText size={14} /> Create Urgent Work Order #WO-8842
          </button>
        </div>
      </div>
    </div>
  );
}
