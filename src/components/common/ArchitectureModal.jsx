import React from 'react';
import { X, Server, Database, Cpu, ShieldCheck, Code, Network } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div className="modal-title-group">
            <Server size={20} className="text-primary" />
            <h3 className="modal-title">System Architecture & ML Specifications</h3>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body arch-modal-body">
          {/* Stack Banner */}
          <div className="arch-banner">
            <span className="arch-banner-title">Enterprise Enterprise Demonstration Reference</span>
            <span className="arch-banner-subtitle">
              Stack: React 19 • Express.js • Scikit-Learn Random Forest • MongoDB 7.0 • IEEE 37-Node Feeder
            </span>
          </div>

          {/* Architecture Pipeline Diagram */}
          <div className="arch-pipeline-box">
            <h4 className="arch-section-title">End-to-End Data & Inference Pipeline</h4>
            <div className="pipeline-flow">
              <div className="pipeline-node">
                <Network size={20} className="node-icon" />
                <span className="node-title">SCADA Telemetry</span>
                <span className="node-desc">25 Grid Nodes (IEEE 37-Bus)</span>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-node highlight">
                <Cpu size={20} className="node-icon" />
                <span className="node-title">Scikit-Learn RF</span>
                <span className="node-desc">100 Trees • Gini Impurity (94.8% Acc)</span>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-node">
                <Server size={20} className="node-icon" />
                <span className="node-title">Express REST API</span>
                <span className="node-desc">Fast JSON IPC (Port 5001)</span>
              </div>
              <div className="pipeline-arrow">→</div>
              <div className="pipeline-node">
                <Database size={20} className="node-icon" />
                <span className="node-title">MongoDB 7.0</span>
                <span className="node-desc">Mongoose Models & Persistent State</span>
              </div>
            </div>
          </div>

          {/* Schema & Endpoints Grid */}
          <div className="arch-grid-two">
            {/* Endpoints */}
            <div className="arch-card">
              <h4 className="arch-section-title">
                <Code size={16} /> RESTful Simulation Endpoints
              </h4>
              <div className="endpoint-list">
                <div className="endpoint-row">
                  <span className="method-pill get">GET</span>
                  <code className="endpoint-path">/api/assets</code>
                  <span className="endpoint-desc">25 Telemetry Nodes + Load</span>
                </div>
                <div className="endpoint-row">
                  <span className="method-pill get">GET</span>
                  <code className="endpoint-path">/api/weather</code>
                  <span className="endpoint-desc">Doppler Wind & Rain Ingress</span>
                </div>
                <div className="endpoint-row">
                  <span className="method-pill post">POST</span>
                  <code className="endpoint-path">/api/predict</code>
                  <span className="endpoint-desc">Random Forest Failure Probability</span>
                </div>
                <div className="endpoint-row">
                  <span className="method-pill post">POST</span>
                  <code className="endpoint-path">/api/crews/assign</code>
                  <span className="endpoint-desc">Dispatch {`{crewId, targetSub}`}</span>
                </div>
                <div className="endpoint-row">
                  <span className="method-pill get">GET</span>
                  <code className="endpoint-path">/api/maintenance</code>
                  <span className="endpoint-desc">Prioritized Queue with DGA Triggers</span>
                </div>
              </div>
            </div>

            {/* MongoDB Schemas */}
            <div className="arch-card">
              <h4 className="arch-section-title">
                <Database size={16} /> MongoDB NoSQL Declarations
              </h4>
              <div className="schema-chips-container">
                <div className="schema-chip">
                  <div className="schema-name">● assets</div>
                  <div className="schema-fields">asset_id, name, type, temp_c, vib_mm, oil_dga_ppm, rated_mva</div>
                </div>
                <div className="schema-chip">
                  <div className="schema-name">● weather</div>
                  <div className="schema-fields">sector_id, wind_speed_kmh, precip_mm, lightning_hits, eta_front</div>
                </div>
                <div className="schema-chip">
                  <div className="schema-name">● maintenance</div>
                  <div className="schema-fields">ticket_id, priority_rank, checklist_steps, status, assigned_crew</div>
                </div>
                <div className="schema-chip">
                  <div className="schema-name">● crews</div>
                  <div className="schema-fields">crew_id, name, specialization, depot_location, staged_target, tech_count</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Defense Tip */}
          <div className="enterprise-tip-box">
            <ShieldCheck size={18} className="text-primary" />
            <div className="enterprise-tip-text">
              <strong>Enterprise Defense Tip:</strong> Emphasize the Haversine distance matrix between predefined depots and line assets to defend the resilience of zero-GPS static coordinates under extreme weather storm interference.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
}
