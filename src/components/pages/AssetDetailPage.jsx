import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { computeSensorStatus } from '../../data/gridSentinelData';
import { ArrowLeft, Thermometer, Activity, Zap, Plus, Wrench, AlertTriangle, Clock, CheckCircle, CloudRain } from 'lucide-react';

function SensorStatusBadge({ status }) {
  const map = { Critical: 'badge-critical', Warning: 'badge-warning', Normal: 'badge-normal' };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}><span className="badge-dot" />{status}</span>;
}

function RiskBadge({ status }) {
  const map = { Critical: 'badge-critical', High: 'badge-high', Warning: 'badge-warning', Normal: 'badge-normal' };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}><span className="badge-dot" />{status}</span>;
}

export default function AssetDetailPage({ assetId, onBack, onNavigate }) {
  const { assets, tickets, createMaintenanceTask, addIncident } = useGrid();
  const [activeTab, setActiveTab] = useState('overview');
  const [incidentForm, setIncidentForm] = useState({ description: '', severity: 'Medium', result: '' });
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const asset = assets.find(a => a.id === assetId);
  if (!asset) return (
    <div className="empty-state">
      <AlertTriangle size={32} className="empty-state-icon" />
      <div className="empty-state-title">Asset not found</div>
      <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
    </div>
  );

  const assetTickets = tickets.filter(t => t.assetId === assetId);
  const openTickets = assetTickets.filter(t => !['Completed', 'Cancelled'].includes(t.status));
  const { failureProbability, gridImpact, overallRisk, healthScore, riskContributors, priority, recommendation, weather, status } = asset;

  const statusColor = { Critical: 'var(--color-critical)', High: 'var(--color-high)', Warning: 'var(--color-warning)', Normal: 'var(--color-normal)' }[status] || 'var(--text-muted)';
  const healthColor = healthScore >= 70 ? 'var(--color-normal)' : healthScore >= 50 ? 'var(--color-warning)' : 'var(--color-critical)';

  const handleCreateTask = () => {
    const id = createMaintenanceTask(assetId, 'Admin');
    if (id) onNavigate('maintenance');
  };

  const handleAddIncident = () => {
    addIncident(assetId, incidentForm, 'Admin');
    setIncidentForm({ description: '', severity: 'Medium', result: '' });
    setShowIncidentForm(false);
  };

  const tabs = ['overview', 'sensors', 'prediction', 'incidents', 'maintenance'];

  return (
    <div>
      {/* Back Button */}
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Assets
      </button>

      {/* Asset Header */}
      <div className="card mb-6" style={{ borderLeft: `3px solid ${statusColor}` }}>
        <div style={{ padding: '20px 24px' }}>
          <div className="flex justify-between items-start">
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', marginBottom: 4 }}>
                {asset.id} · {asset.type}
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 8 }}>
                {asset.name}
              </h1>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <RiskBadge status={status} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.location}</span>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>·</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.zone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {openTickets.length === 0 && (
                <button className="btn btn-danger btn-sm" onClick={handleCreateTask}>
                  <Wrench size={13} /> Create Maintenance Task
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setShowIncidentForm(true)}>
                <Plus size={13} /> Add Incident
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
            {[
              { label: 'Health Score', value: `${healthScore}/100`, color: healthColor },
              { label: 'Failure Prob.', value: `${failureProbability}%`, color: failureProbability >= 80 ? 'var(--color-critical)' : failureProbability >= 60 ? 'var(--color-high)' : failureProbability >= 35 ? 'var(--color-warning)' : 'var(--color-normal)' },
              { label: 'Grid Impact', value: `${gridImpact}/100`, color: 'var(--text-primary)' },
              { label: 'Overall Risk', value: `${overallRisk}/100`, color: statusColor },
              { label: 'Priority', value: priority?.code || 'P4', color: statusColor }
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: m.color, letterSpacing: '-0.5px' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Health Bar */}
          <div style={{ marginTop: 12 }}>
            <div className="health-bar-wrap" style={{ height: 4 }}>
              <div className="health-bar-fill" style={{ width: `${healthScore}%`, background: healthColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'incidents' && asset.incidents?.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--bg-elevated)', borderRadius: 100, padding: '1px 6px', fontSize: 10 }}>{asset.incidents.length}</span>
            )}
            {t === 'maintenance' && asset.maintenanceHistory?.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--bg-elevated)', borderRadius: 100, padding: '1px 6px', fontSize: 10 }}>{asset.maintenanceHistory.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Asset Information</div></div>
            <div className="card-body">
              {[
                ['Type', asset.type],
                ['Manufacturer', asset.manufacturer],
                ['Model', asset.model],
                ['Serial Number', asset.serialNumber],
                ['Installation Date', asset.installationDate],
                ['Commissioning Date', asset.commissioningDate],
                ['Age', `${asset.age} years`],
                ['Capacity', `${asset.capacityMVA} MVA`],
                ['Voltage', asset.voltage],
                ['Customers Served', asset.customersAffected?.toLocaleString()],
                ['Critical Facilities', asset.criticalFacilities],
                ['Asset Criticality', asset.assetCriticality],
                ['Prior Faults', asset.priorFaults]
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Weather */}
            <div className="card">
              <div className="card-header"><div className="card-title"><CloudRain size={13} />Weather Risk — {asset.zone}</div></div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Condition</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{weather.condition}</div>
                  </div>
                  <div style={{ flex: 1, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Risk Level</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: weather.risk === 'Severe' ? 'var(--color-critical)' : weather.risk === 'Moderate' ? 'var(--color-warning)' : 'var(--color-normal)' }}>
                      {weather.risk}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{weather.forecast}</div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  {[['Wind', `${weather.wind} km/h`], ['Rain', `${weather.rain}mm`], ['Humidity', `${weather.humidity}%`]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{k}</div>
                      <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Tickets */}
            <div className="card">
              <div className="card-header"><div className="card-title"><Wrench size={13} />Active Tasks</div></div>
              {openTickets.length === 0 ? (
                <div className="card-body" style={{ fontSize: 12, color: 'var(--text-faint)' }}>No open maintenance tasks.</div>
              ) : openTickets.map(t => (
                <div key={t.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{t.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    Status: {t.status} · Crew: {t.assignedCrewName || 'Unassigned'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div>
          {asset.sensors?.length === 0 ? (
            <div className="empty-state"><div className="empty-state-title">No sensors configured</div></div>
          ) : (
            <div className="sensor-grid">
              {asset.sensors.map(sensor => {
                const sStatus = computeSensorStatus(sensor);
                const statusColor = { Critical: 'var(--color-critical)', Warning: 'var(--color-warning)', Normal: 'var(--color-normal)' }[sStatus] || 'var(--text-muted)';
                const pct = (() => {
                  const range = sensor.criticalThreshold - sensor.normalMin;
                  return Math.min(100, Math.max(0, ((sensor.currentValue - sensor.normalMin) / range) * 100));
                })();
                return (
                  <div className="sensor-card" key={sensor.id} style={{ borderColor: sStatus !== 'Normal' ? (sStatus === 'Critical' ? 'var(--color-critical-border)' : 'var(--color-warning-border)') : 'var(--border-subtle)' }}>
                    <div className="sensor-card-type">{sensor.type}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span className="sensor-card-value" style={{ color: statusColor }}>{sensor.currentValue}</span>
                      <span className="sensor-card-unit">{sensor.unit}</span>
                    </div>
                    <div style={{ margin: '10px 0 6px' }}>
                      <div className="health-bar-wrap" style={{ height: 4 }}>
                        <div className="health-bar-fill" style={{ width: `${pct}%`, background: statusColor }} />
                      </div>
                    </div>
                    <SensorStatusBadge status={sStatus} />
                    <div className="sensor-card-threshold">
                      Warn: {sensor.warningThreshold}{sensor.unit} · Crit: {sensor.criticalThreshold}{sensor.unit}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4 }}>
                      Updated {new Date(sensor.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'prediction' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">AI Failure Prediction</div></div>
            <div className="card-body">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, fontWeight: 900, fontFamily: 'var(--font-mono)', color: failureProbability >= 80 ? 'var(--color-critical)' : failureProbability >= 60 ? 'var(--color-high)' : failureProbability >= 35 ? 'var(--color-warning)' : 'var(--color-normal)', letterSpacing: '-2px', lineHeight: 1 }}>
                  {failureProbability}%
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Failure Probability</div>
                <div style={{ marginTop: 16 }}>
                  <span className={`badge ${failureProbability >= 80 ? 'badge-critical' : failureProbability >= 60 ? 'badge-high' : 'badge-warning'}`}>
                    {priority?.label || 'P4 — LOW'}
                  </span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Risk Contributors</div>
                {Object.entries(riskContributors).map(([key, val]) => (
                  <div className="risk-bar-item" key={key}>
                    <div className="risk-bar-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div>
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${val}%`, background: val >= 25 ? 'var(--color-critical)' : val >= 15 ? 'var(--color-high)' : 'var(--color-warning)' }} />
                    </div>
                    <div className="risk-bar-value">+{val}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">AI Recommendation</div></div>
            <div className="card-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Why is this asset at risk?</div>
                {recommendation.reasons.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asset is within normal operating parameters.</div>
                ) : recommendation.reasons.map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--color-critical)', fontSize: 11 }}>▲</span>
                    {r}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Recommended Actions — {recommendation.timeline}</div>
                {recommendation.actions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', paddingTop: 1 }}>{i + 1}.</span>
                    {a}
                  </div>
                ))}
              </div>
              <button className="btn btn-danger btn-block" style={{ marginTop: 20 }} onClick={handleCreateTask}>
                <Wrench size={14} /> Create Maintenance Task from AI
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div>
          {showIncidentForm && (
            <div className="card mb-6">
              <div className="card-header"><div className="card-title">Add Incident Report</div></div>
              <div className="card-body">
                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label required">Description</label>
                    <textarea className="form-input" rows={2} value={incidentForm.description} onChange={e => setIncidentForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the incident..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Severity</label>
                    <select className="form-input" value={incidentForm.severity} onChange={e => setIncidentForm(f => ({ ...f, severity: e.target.value }))}>
                      <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Result / Action Taken</label>
                    <input className="form-input" value={incidentForm.result} onChange={e => setIncidentForm(f => ({ ...f, result: e.target.value }))} placeholder="Action taken..." />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn btn-primary btn-sm" onClick={handleAddIncident}>Save Incident</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowIncidentForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {!showIncidentForm && (
            <div style={{ marginBottom: 16 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowIncidentForm(true)}>
                <Plus size={13} /> Add Incident
              </button>
            </div>
          )}

          <div className="card">
            <div className="card-header"><div className="card-title">Incident History ({asset.incidents?.length || 0})</div></div>
            <div className="card-body">
              {!asset.incidents?.length ? (
                <div className="empty-state"><div className="empty-state-title">No incidents recorded</div></div>
              ) : (
                <div className="timeline">
                  {asset.incidents.map(inc => (
                    <div key={inc.id} className={`timeline-item ${inc.severity?.toLowerCase()}`}>
                      <div className="timeline-date">{inc.date}</div>
                      <div className="timeline-title">{inc.description}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <span className={`badge badge-${inc.severity === 'Critical' ? 'critical' : inc.severity === 'High' ? 'high' : inc.severity === 'Medium' ? 'warning' : 'neutral'}`}>
                          {inc.severity}
                        </span>
                        {inc.reportedBy && <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>By: {inc.reportedBy}</span>}
                      </div>
                      {inc.result && <div className="timeline-desc" style={{ marginTop: 4 }}>Result: {inc.result}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Maintenance History ({asset.maintenanceHistory?.length || 0})</div>
            <button className="btn btn-secondary btn-sm" onClick={handleCreateTask}><Plus size={13} /> New Task</button>
          </div>
          <div className="card-body">
            {!asset.maintenanceHistory?.length ? (
              <div className="empty-state"><div className="empty-state-title">No maintenance history</div></div>
            ) : (
              <div className="timeline">
                {asset.maintenanceHistory.map(m => (
                  <div key={m.id} className="timeline-item">
                    <div className="timeline-date">{m.date}</div>
                    <div className="timeline-title">{m.type}</div>
                    <div className="timeline-desc">Technician: {m.technician} · Crew: {m.crew}</div>
                    <div className="timeline-desc" style={{ marginTop: 4 }}>Result: {m.result}</div>
                    <span className={`badge ${m.status === 'Completed' ? 'badge-normal' : 'badge-neutral'}`} style={{ marginTop: 6 }}>{m.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
