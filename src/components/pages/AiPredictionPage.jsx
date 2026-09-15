import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Sparkles, Wrench, ChevronDown } from 'lucide-react';

export default function AiPredictionPage({ onNavigate }) {
  const { assets, createMaintenanceTask } = useGrid();
  const [selectedId, setSelectedId] = useState(assets[0]?.id || '');
  const [showPlan, setShowPlan] = useState(false);

  const asset = assets.find(a => a.id === selectedId) || assets[0];
  if (!asset) return <div className="empty-state"><div className="empty-state-title">No assets available.</div></div>;

  const { failureProbability, gridImpact, overallRisk, healthScore, riskContributors, priority, recommendation, weather, status } = asset;
  const pColor = { P1: 'var(--color-critical)', P2: 'var(--color-high)', P3: 'var(--color-warning)', P4: 'var(--color-normal)' }[priority?.code] || 'var(--text-muted)';

  const handleCreateTask = () => {
    createMaintenanceTask(asset.id, 'Admin');
    onNavigate('maintenance');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Prediction Engine</h1>
          <p className="page-subtitle">Failure probability computed from sensors, weather, history, and asset age</p>
        </div>
      </div>

      {/* Asset Selector */}
      <div className="card mb-6">
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, flexShrink: 0 }}>
            Analyzing Asset
          </div>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <select
              className="form-input"
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setShowPlan(false); }}
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.name} (Risk: {a.overallRisk}%)
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`badge ${failureProbability >= 80 ? 'badge-critical' : failureProbability >= 60 ? 'badge-high' : failureProbability >= 35 ? 'badge-warning' : 'badge-normal'}`}>
              <span className="badge-dot" />{status}
            </span>
            <span className="badge badge-neutral">{priority?.code}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Prediction Panel */}
        <div className="card">
          <div className="card-header"><div className="card-title"><Sparkles size={13} />Failure Prediction</div></div>
          <div className="card-body">
            {/* Big Number */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 72, fontWeight: 900, fontFamily: 'var(--font-mono)', color: pColor, letterSpacing: '-3px', lineHeight: 1 }}>
                {failureProbability}
              </div>
              <div style={{ paddingBottom: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: pColor }}>%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Failure Probability</div>
              </div>
            </div>

            {[
              { label: 'Health Score', val: `${healthScore}/100` },
              { label: 'Grid Impact', val: `${gridImpact}/100` },
              { label: 'Overall Risk', val: `${overallRisk}/100` },
              { label: 'Confidence', val: `${recommendation.confidence}%` },
              { label: 'Prediction Window', val: recommendation.timeline },
              { label: 'Customers at Risk', val: asset.customersAffected?.toLocaleString() }
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Priority Action</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: pColor }}>{priority?.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{priority?.action}</div>
            </div>
          </div>
        </div>

        {/* Explainability */}
        <div className="card">
          <div className="card-header"><div className="card-title">Why is this asset at risk?</div></div>
          <div className="card-body">
            <div style={{ marginBottom: 20 }}>
              {Object.entries(riskContributors).length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No significant risk factors detected. Asset is within normal parameters.</div>
              ) : Object.entries(riskContributors).map(([key, val]) => (
                <div className="risk-bar-item" key={key} style={{ marginBottom: 12 }}>
                  <div className="risk-bar-label" style={{ width: 150 }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div>
                  <div className="risk-bar-track">
                    <div className="risk-bar-fill" style={{
                      width: `${val}%`,
                      background: val >= 25 ? 'var(--color-critical)' : val >= 15 ? 'var(--color-high)' : 'var(--color-warning)'
                    }} />
                  </div>
                  <div className="risk-bar-value">+{val}%</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Reasoning</div>
              {recommendation.reasons.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asset is operating within safe parameters.</div>
              ) : recommendation.reasons.map((r, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--color-critical)' }}>▲</span> {r}
                </div>
              ))}
            </div>

            {/* Weather */}
            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Zone Weather — {asset.zone}</div>
              <div style={{ fontSize: 13, color: weather.risk === 'Severe' ? 'var(--color-critical)' : weather.risk === 'Moderate' ? 'var(--color-warning)' : 'var(--color-normal)', fontWeight: 600 }}>
                {weather.condition} · {weather.risk} Risk
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{weather.forecast}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Sparkles size={13} />AI Remediation Plan — {asset.name}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowPlan(!showPlan)}>
            {showPlan ? 'Hide' : 'Generate Plan'} <ChevronDown size={13} style={{ transform: showPlan ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
          </button>
        </div>

        {showPlan && (
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
                  Recommended Actions — {recommendation.timeline}
                </div>
                {recommendation.actions.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{action}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Asset Risk Summary</div>
                <div style={{ padding: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--bg-elevated)', borderRadius: 6 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-mono)', color: pColor }}>{failureProbability}%</div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', marginTop: 4 }}>Failure Risk</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--bg-elevated)', borderRadius: 6 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{gridImpact}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', marginTop: 4 }}>Grid Impact</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Asset {asset.name} serves {asset.customersAffected?.toLocaleString()} customers
                    and {asset.criticalFacilities} critical facilities. A failure would cause significant grid impact in {asset.zone}.
                  </div>
                </div>
                <button className="btn btn-danger btn-block" style={{ marginTop: 16 }} onClick={handleCreateTask}>
                  <Wrench size={14} /> Create Maintenance Task from This Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
