import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Radio,
  FileText,
  CheckCircle,
  Navigation,
  Wind,
  Droplets
} from 'lucide-react';
import { CREW_STAGING_DATA, STAGING_METRICS } from '../../data/crewStagingData';
import confetti from 'canvas-confetti';

export default function CrewPrePositioning({ assets, onOpenWorkOrder }) {
  const [crews, setCrews] = useState(CREW_STAGING_DATA);
  const [selectedCrewId, setSelectedCrewId] = useState('crew-alpha');
  const [windSafetyCutoffActive, setWindSafetyCutoffActive] = useState(true);

  const selectedCrew = crews.find((c) => c.id === selectedCrewId) || crews[0];

  const handleToggleTask = (taskIndex) => {
    setCrews((prev) =>
      prev.map((c) => {
        if (c.id !== selectedCrewId) return c;
        const newChecklist = [...c.checklist];
        newChecklist[taskIndex].done = !newChecklist[taskIndex].done;
        return { ...c, checklist: newChecklist };
      })
    );
  };

  const handleQuickDispatch = (crewId) => {
    setCrews((prev) =>
      prev.map((c) => (c.id === crewId ? { ...c, status: 'Dispatched', etaMinutes: 20 } : c))
    );
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Safety Cutoff Compliance */}
      <div className="opcon-banner" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="opcon-tag" style={{ background: '#16a34a' }}>SAFETY INTERLOCK ACTIVE</div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534' }}>
              NERC &amp; OSHA Lineman High-Wind Interlock Enforced (&gt;45 mph Cutoff)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#15803d' }}>
              All hydraulic bucket booms and aerial lifts are restricted when sustained gusts reach 45 mph. Pre-staging completed inside the 2.5-hour safety window.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', fontSize: '0.74rem' }}>
            <span style={{ color: '#64748b' }}>Safety Cutoff Index:</span>
            <div style={{ fontWeight: 800, color: '#166534' }}>98.7% Operational Compliance</div>
          </div>
        </div>
      </div>

      {/* Fleet KPI Grid */}
      <div className="kpi-grid-5">
        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">Active Mobilizations</span>
            <Truck size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>4 <span style={{ fontSize: '0.85rem', color: '#64748b' }}>TEAMS</span></div>
          <div className="kpi-delta" style={{ color: '#059669' }}>21 Specialized Linemen</div>
          <div className="kpi-subtext">100% Radio Synchronized</div>
        </div>

        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-label">Downtime Mitigated</span>
            <Clock size={15} color="#0284c7" />
          </div>
          <div className="kpi-value">5.4 <span style={{ fontSize: '0.85rem', color: '#64748b' }}>HOURS</span></div>
          <div className="kpi-delta" style={{ color: '#0369a1' }}>-68% vs baseline ETR</div>
          <div className="kpi-subtext">Pre-positioned adjacent to nodes</div>
        </div>

        <div className="kpi-card severe">
          <div className="kpi-header">
            <span className="kpi-label">Storm Front Proximity</span>
            <Wind size={15} color="#ea580c" />
          </div>
          <div className="kpi-value">84 <span style={{ fontSize: '0.85rem', color: '#64748b' }}>MILES</span></div>
          <div className="kpi-delta" style={{ color: '#c2410c' }}>Moving 18 mph NE</div>
          <div className="kpi-subtext">Safety window: 2.5h remaining</div>
        </div>

        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">Heavy Equipment Staged</span>
            <ShieldCheck size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>8 / 8</div>
          <div className="kpi-delta" style={{ color: '#059669' }}>Degasser, Pumps &amp; Spacers</div>
          <div className="kpi-subtext">Fuel reserves: 100% verified</div>
        </div>

        <div className="kpi-card elevated">
          <div className="kpi-header">
            <span className="kpi-label">Road Passability</span>
            <Droplets size={15} color="#d97706" />
          </div>
          <div className="kpi-value" style={{ color: '#b45309' }}>Clear</div>
          <div className="kpi-delta" style={{ color: '#b45309' }}>Flood 100-yr plain bypassed</div>
          <div className="kpi-subtext">Dynamic routing automated</div>
        </div>
      </div>

      {/* Main Staging Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        {/* Left: Tactical Fleet Unit Roster */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Truck size={16} color="#0284c7" />
              Tactical Specialized Response Fleet
            </div>
            <span className="badge badge-normal">4 UNITS ACTIVE</span>
          </div>

          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {crews.map((crew) => {
              const isSelected = selectedCrewId === crew.id;
              return (
                <div
                  key={crew.id}
                  onClick={() => setSelectedCrewId(crew.id)}
                  style={{
                    border: isSelected ? '2px solid #0284c7' : '1px solid var(--border-color)',
                    background: isSelected ? '#f0f9ff' : 'var(--bg-subtle)',
                    borderRadius: 8,
                    padding: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{crew.name}</strong>
                      <span className={`badge badge-${crew.status.includes('Transit') ? 'elevated' : 'normal'}`} style={{ fontSize: '0.65rem' }}>
                        {crew.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                      {crew.etaMinutes > 0 ? `ETA ${crew.etaMinutes}m` : 'ON SITE'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 6 }}>
                    {crew.specialty} • <strong>{crew.headcount} Technicians</strong> • Radio: {crew.radioChannel}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                    <div>Target: <strong>{crew.targetYard}</strong></div>
                    <div>Asset: <strong style={{ color: '#e11d48' }}>{crew.assignedAsset}</strong></div>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
                    Rig: {crew.equipment}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Crew Dossier & Digital Work Order Checklist */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <FileText size={16} color="#0284c7" />
              Tactical Unit Dossier: {selectedCrew.name}
            </div>
            <span className="badge badge-primary">{selectedCrew.radioChannel}</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Location & Safety details */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.75rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Assigned High-Risk Asset:</span>
                <strong style={{ color: '#e11d48' }}>{selectedCrew.assignedAsset}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>Current Staging Destination:</span>
                <strong style={{ color: '#0f172a' }}>{selectedCrew.targetYard}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Safety Corridor Status:</span>
                <strong style={{ color: '#059669' }}>{selectedCrew.safetyStatus}</strong>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>
                Pre-Deployment Verification Checklist
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedCrew.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleTask(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '0.45rem 0.65rem',
                      borderRadius: 4,
                      background: item.done ? '#ecfdf5' : '#fff1f2',
                      border: `1px solid ${item.done ? '#a7f3d0' : '#fecdd3'}`,
                      cursor: 'pointer',
                      fontSize: '0.74rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {}}
                      style={{ accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <span style={{ color: item.done ? '#065f46' : '#9f1239', fontWeight: item.done ? 500 : 700 }}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleQuickDispatch(selectedCrew.id)}
                style={{ flex: 1 }}
              >
                <Navigation size={14} /> Transmit Route Coordinates
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onOpenWorkOrder && onOpenWorkOrder(assets.find(a => a.id === selectedCrew.assetId))}
                style={{ flex: 1 }}
              >
                <FileText size={14} /> Issue Work Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
