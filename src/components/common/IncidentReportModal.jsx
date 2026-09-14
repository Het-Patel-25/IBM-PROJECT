import React from 'react';
import { X, Printer, ShieldCheck, Download, AlertOctagon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function IncidentReportModal({ isOpen, onClose, assets = [], weatherData = {} }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 740 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: '#0284c7',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <AlertOctagon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Executive Incident Briefing — GridPulse AI EOC
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Automated Risk Synthesis & Pre-Positioning Operational Briefing
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Printable Report Content */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '65vh', overflowY: 'auto' }}>
          {/* Header Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.75rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: '0.75rem'
          }}>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>DEFCON STATUS:</span>
              <strong style={{ color: '#be123c' }}>DEFCON 2 (Critical)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>FINANCIAL EXPOSURE:</span>
              <strong style={{ color: '#0f172a' }}>$2.4M / hr</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>PRE-POSITIONED UNITS:</span>
              <strong style={{ color: '#059669' }}>8 of 8 Specialized</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block' }}>SAVINGS PROJECTED:</span>
              <strong style={{ color: '#0284c7' }}>$11.4M Avoidance</strong>
            </div>
          </div>

          {/* Top At-Risk Assets Table */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
              Strategic Assets Evaluated Under N-1 Contingency
            </h4>
            <table className="eoc-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Asset</th>
                  <th>Failure Prob</th>
                  <th>Downstream Impact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 5).map((a, i) => (
                  <tr key={a.id}>
                    <td><strong>#{i + 1}</strong></td>
                    <td><strong>{a.name}</strong> ({a.voltageClass})</td>
                    <td><span style={{ color: a.failureProb > 85 ? '#e11d48' : '#d97706', fontWeight: 700 }}>{a.failureProb}%</span></td>
                    <td style={{ fontSize: '0.7rem', color: '#64748b' }}>{a.downstreamCriticality}</td>
                    <td><span className="badge badge-primary">{a.stagingStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Incident Command Directives */}
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 6,
            padding: '0.75rem',
            fontSize: '0.76rem',
            color: '#9f1239'
          }}>
            <h4 style={{ fontWeight: 800, marginBottom: '0.3rem' }}>Authorized Pre-Storm Directives</h4>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.5 }}>
              <li>Execute automated 180 MW BES load diversion from Pine Valley to Oakridge 500kV bypass tie.</li>
              <li>Deploy Alpha Heavy Response Unit with 100MVA Mobile Degasser to Yard 4 before 45 mph wind cutoff.</li>
              <li>Enforce bucket truck retraction protocol for Bravo Strike Team across Span 48 galloping zone.</li>
              <li>Prepare 120 MW Mobile Substation 4 for rapid interconnect upon primary bus de-energization.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Printer size={14} /> Print Dossier
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            <Download size={14} /> Export PDF Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
