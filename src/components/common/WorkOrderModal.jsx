import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkOrderModal({ isOpen, onClose, asset, defaultWorkOrderNumber = 'WO-8842' }) {
  const [dispatched, setDispatched] = useState(false);
  const [isLOTOVerified, setIsLOTOVerified] = useState(true);
  const [selectedCrew, setSelectedCrew] = useState('Alpha Heavy Response Unit');

  if (!isOpen) return null;

  const handleDispatch = () => {
    setDispatched(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
    setTimeout(() => {
      // Keep modal open so user sees success state
    }, 400);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e11d48'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Digital Work Order Authorization: #{defaultWorkOrderNumber}
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                NERC CIP-007 / EOP-011 High-Impact Emergency Work Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dispatched ? (
            <div style={{
              padding: '1.5rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', marginBottom: '0.4rem' }}>
                Work Order Successfully Dispatched & Transmitted
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '1rem' }}>
                Order #{defaultWorkOrderNumber} issued to <strong>{selectedCrew}</strong>. Digital LOTO permit activated and synchronized with SCADA Node Gateway SEC-71.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Print Formal Dispatch Dossier
                </button>
                <button className="btn btn-primary btn-sm" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Asset Snapshot Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                    {asset?.name || 'Pine Valley T-1 (500kV Autotransformer)'}
                  </span>
                  <span className="badge badge-critical">Stage 4 Escalation</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Location: </span>
                    <strong style={{ color: '#0f172a' }}>{asset?.substation || 'Yard 4'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Failure Prob: </span>
                    <strong style={{ color: '#be123c' }}>{asset?.failureProb || 94.2}%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Financial Risk: </span>
                    <strong style={{ color: '#0f172a' }}>${(asset?.financialExposurePerHour || 1850000).toLocaleString()}/hr</strong>
                  </div>
                </div>
              </div>

              {/* Action Directives */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Prescribed Technical Intervention
                </label>
                <div style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 6,
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  color: '#9f1239',
                  lineHeight: 1.4
                }}>
                  <strong>1. Vacuum Degasification & Oil Dehydration:</strong> Immediate mobile filtration cycle to suppress C2H2 arcing gases.<br/>
                  <strong>2. Load Diversion:</strong> Re-dispatch 180MW load to Oakridge 500kV bypass tie to drop winding hotspot below 110°C.<br/>
                  <strong>3. Acoustic Triangulation:</strong> Verify Phase B upper tank core clamp displacement prior to storm front peak.
                </div>
              </div>

              {/* Assigned Crew Selection */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Assigned Tactical Unit
                </label>
                <select
                  value={selectedCrew}
                  onChange={(e) => setSelectedCrew(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    fontWeight: 600
                  }}
                >
                  <option value="Alpha Heavy Response Unit">Alpha Heavy Response Unit (Substation Specialists, 6 Techs - ETA 42m)</option>
                  <option value="Bravo Transmission Strike Team">Bravo Transmission Strike Team (Bucket Trucks & Arborists, 8 Techs - Staged)</option>
                  <option value="Delta Emergency Power & Hydro">Delta Emergency Power & Hydro (Dewatering & Gen, 4 Techs - ETA 15m)</option>
                </select>
              </div>

              {/* Safety Interlock Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 6,
                fontSize: '0.75rem',
                color: '#166534'
              }}>
                <input
                  type="checkbox"
                  id="loto-check"
                  checked={isLOTOVerified}
                  onChange={(e) => setIsLOTOVerified(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#10b981' }}
                />
                <label htmlFor="loto-check" style={{ cursor: 'pointer', fontWeight: 600 }}>
                  <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  NERC CIP Lockout/Tagout (LOTO) Interlock Clearance pre-authorized by Shift Lead Dir. K. Vance
                </label>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!dispatched && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDispatch} disabled={!isLOTOVerified}>
              Authorize & Dispatch Work Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
