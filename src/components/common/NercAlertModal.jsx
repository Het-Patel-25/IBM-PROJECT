import React, { useState } from 'react';
import { X, Radio, CheckCircle, ShieldAlert, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NercAlertModal({ isOpen, onClose }) {
  const [broadcasted, setBroadcasted] = useState(false);
  const [alertLevel, setAlertLevel] = useState('EEA-2');

  if (!isOpen) return null;

  const handleBroadcast = () => {
    setBroadcasted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        {/* Header */}
        <div className="modal-header" style={{ background: '#fff1f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: '#e11d48',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Radio size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#9f1239' }}>
                NERC EOP-011 / Reliability Coordinator Emergency Broadcast
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#be123c' }}>
                Official Regional Intertie Advisory Transmission
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {broadcasted ? (
            <div style={{
              padding: '1.5rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <CheckCircle size={44} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065f46', marginBottom: '0.3rem' }}>
                NERC Regional Alert Broadcast Transmitted
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#047857', marginBottom: '1rem' }}>
                Notice successfully logged to NERC Reliability Coordinator system. Synchronized with ERCOT & SPP interchange desks.
              </p>
              <button className="btn btn-primary btn-sm" onClick={onClose}>
                Return to EOC Command
              </button>
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Emergency Energy Alert (EEA) Classification
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    className={`btn btn-sm ${alertLevel === 'EEA-1' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('EEA-1')}
                  >
                    EEA Level 1 (Advisory)
                  </button>
                  <button
                    className={`btn btn-sm ${alertLevel === 'EEA-2' ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('EEA-2')}
                  >
                    EEA Level 2 (Arm Reserves)
                  </button>
                  <button
                    className={`btn btn-sm ${alertLevel === 'EEA-3' ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => setAlertLevel('EEA-3')}
                  >
                    EEA Level 3 (Firm Shed)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Broadcast Telemetry Payload
                </label>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '0.75rem',
                  fontSize: '0.76rem',
                  color: '#334155',
                  fontFamily: 'monospace',
                  lineHeight: 1.5
                }}>
                  [NERC EOP-011 ALERT]<br/>
                  INCIDENT ID: #WCV-8820-A (CAT 3 MESOSCALE CONVECTIVE VORTEX)<br/>
                  AFFECTED NODES: 500kV PINE VALLEY T-1, WESTSIDE RING BUS, LINE 502 SPAN 48<br/>
                  WINDS: 68-88 MPH GUSTS INTERCEPTING BULK EAST CORRIDOR<br/>
                  AVAILABLE OPERATING RESERVES: 1,840 MW (-320 MW DEFICIT ANTICIPATED)<br/>
                  REQUEST: REGIONAL MUTUALLY ASSUMED RESERVE SHARING ACTIVATION.
                </div>
              </div>

              <div style={{
                padding: '0.65rem',
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: 6,
                fontSize: '0.74rem',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldAlert size={18} />
                <span>Authorized under CIP-008-6 Cyber Incident Response and EOP-011-2 Action Checklist.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!broadcasted && (
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleBroadcast}>
              <Send size={14} /> Transmit NERC Emergency Broadcast
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
