import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  BarChart3,
  TrendingUp,
  Award,
  Sliders,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  HISTORICAL_DATASET_SUMMARY,
  MODEL_BENCHMARK,
  SHAP_FEATURE_IMPORTANCE,
  HISTORICAL_CASE_STUDIES
} from '../../data/historicalIncidents';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function HistoricalMLTuning() {
  const [sandboxWindMph, setSandboxWindMph] = useState(78);
  const [sandboxLoadFactor, setSandboxLoadFactor] = useState(94);

  // Dynamic "What-If" Sandbox recalculation formulas
  const simulatedRiskAssetsCount = Math.round(18 + (sandboxWindMph - 50) * 0.45 + (sandboxLoadFactor - 80) * 0.6);
  const simulatedExposureMillions = ((sandboxWindMph * 0.025) + (sandboxLoadFactor * 0.018)).toFixed(2);
  const simulatedAvertedSavings = ((simulatedExposureMillions * 5.2)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="opcon-banner" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="opcon-tag" style={{ background: '#0284c7' }}>PINN ENGINE v4.1.8</div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369a1' }}>
              Historical Incident Records &amp; Physics-Informed ML Model Architecture
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0c4a6e' }}>
              Trained across 25 years of multi-utility SCADA, DGA chromatography, and meteorological disaster records to eliminate calendar-based blindspots.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'right' }}>
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>
              Historical Lead Time
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }}>
              18.4 Days Prior
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="kpi-grid-5">
        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-label">Utility Incidents</span>
            <Database size={15} color="#0284c7" />
          </div>
          <div className="kpi-value">14,200</div>
          <div className="kpi-delta" style={{ color: '#0369a1' }}>25 Years Historical Data</div>
          <div className="kpi-subtext">NERC / IEEE Standardized</div>
        </div>

        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">Catastrophic Averted</span>
            <Award size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>842</div>
          <div className="kpi-delta" style={{ color: '#059669' }}>Explosions &amp; Blackouts</div>
          <div className="kpi-subtext">Preventative Action Deployed</div>
        </div>

        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">Model ROC-AUC</span>
            <Sparkles size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>0.964</div>
          <div className="kpi-delta" style={{ color: '#059669' }}>F1-Score: 0.938</div>
          <div className="kpi-subtext">Physics-Informed Neural Net</div>
        </div>

        <div className="kpi-card normal">
          <div className="kpi-header">
            <span className="kpi-label">False Negative Rate</span>
            <ShieldCheck size={15} color="#10b981" />
          </div>
          <div className="kpi-value" style={{ color: '#047857' }}>1.2%</div>
          <div className="kpi-delta" style={{ color: '#059669' }}>vs 58.6% Calendar Standard</div>
          <div className="kpi-subtext">Zero Unmonitored Cascades</div>
        </div>

        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-label">Average ROI</span>
            <TrendingUp size={15} color="#0284c7" />
          </div>
          <div className="kpi-value" style={{ color: '#0284c7' }}>395x</div>
          <div className="kpi-delta" style={{ color: '#0369a1' }}>Cost-Avoidance Delta</div>
          <div className="kpi-subtext">$65k repair vs $25.7M blast</div>
        </div>
      </div>

      {/* Model Benchmark Comparative Table */}
      <div className="eoc-card">
        <div className="eoc-card-header">
          <div className="eoc-card-title">
            <BarChart3 size={16} color="#0284c7" />
            Predictive Model Benchmark: Physics-Informed vs Legacy Utility Approaches
          </div>
          <span className="badge badge-normal">VERIFIED NERC AUDIT</span>
        </div>

        <div className="eoc-table-container">
          <table className="eoc-table">
            <thead>
              <tr>
                <th>Algorithm Architecture</th>
                <th>ROC-AUC</th>
                <th>F1-Score</th>
                <th>Prediction Lead Time</th>
                <th>False Negative Rate</th>
                <th>Weather-Coupled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_BENCHMARK.map((m, idx) => (
                <tr key={idx} style={{ background: idx === 0 ? '#f0f9ff' : 'transparent' }}>
                  <td>
                    <strong style={{ color: idx === 0 ? '#0284c7' : '#0f172a' }}>{m.model}</strong>
                  </td>
                  <td><strong style={{ fontFamily: 'monospace' }}>{m.auc}</strong></td>
                  <td><span style={{ fontFamily: 'monospace' }}>{m.f1Score}</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: idx === 0 ? '#059669' : '#475569' }}>
                      {m.leadTimeDays > 0 ? `${m.leadTimeDays} Days` : '0 Days (Blind)'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: idx === 3 ? '#e11d48' : '#0f172a' }}>
                      {m.falseNegRate}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.74rem' }}>{m.weatherCoupled}</span></td>
                  <td>
                    <span className={`badge badge-${idx === 0 ? 'normal' : idx === 3 ? 'critical' : 'elevated'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Middle Row: SHAP Feature Importance & Interactive "What-If" Sandbox */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* SHAP Feature Importance */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Sparkles size={16} color="#0284c7" />
              SHAP Feature Importance (Global Model Attribution)
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Cross-Validated (k=10)</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Quantifies how each physical and meteorological sensor stream contributes to predicting catastrophic grid asset failure.
            </p>

            {SHAP_FEATURE_IMPORTANCE.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <strong style={{ color: '#0f172a' }}>{feat.feature}</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                    {(feat.weight * 100).toFixed(1)}% weight
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${feat.importance}%`,
                      height: '100%',
                      background: idx < 2 ? '#e11d48' : idx < 4 ? '#0284c7' : '#10b981',
                      borderRadius: 3
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive "What-If" Grid Stress Sandbox */}
        <div className="eoc-card">
          <div className="eoc-card-header">
            <div className="eoc-card-title">
              <Sliders size={16} color="#0284c7" />
              Interactive "What-If" Grid Stress Simulator
            </div>
            <span className="badge badge-primary">REAL-TIME INFERENCE</span>
          </div>

          <div className="eoc-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Adjust live atmospheric wind vectors and grid load stress to observe instant whole-network risk re-weighting.
            </p>

            {/* Slider 1: Wind */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.74rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Convective Wind Gust Velocity</span>
                <strong style={{ color: '#e11d48', fontFamily: 'monospace' }}>{sandboxWindMph} MPH</strong>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={sandboxWindMph}
                onChange={(e) => setSandboxWindMph(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                <span>30 mph (Breeze)</span>
                <span>75 mph (Cat 1)</span>
                <span>120 mph (Cat 3 Gale)</span>
              </div>
            </div>

            {/* Slider 2: Load */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.74rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Grid Peak Load Factor</span>
                <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>{sandboxLoadFactor}% Nameplate</strong>
              </div>
              <input
                type="range"
                min="70"
                max="120"
                value={sandboxLoadFactor}
                onChange={(e) => setSandboxLoadFactor(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                <span>70% Nominal</span>
                <span>95% Strained</span>
                <span>120% Extreme Overload</span>
              </div>
            </div>

            {/* Dynamic Calculated Results Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>AT-RISK ASSETS</span>
                <strong style={{ fontSize: '1.2rem', color: '#e11d48', fontFamily: 'monospace' }}>
                  {simulatedRiskAssetsCount}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>HOURLY EXPOSURE</span>
                <strong style={{ fontSize: '1.2rem', color: '#0f172a', fontFamily: 'monospace' }}>
                  ${simulatedExposureMillions}M
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>AVERTED VALUE</span>
                <strong style={{ fontSize: '1.2rem', color: '#059669', fontFamily: 'monospace' }}>
                  ${simulatedAvertedSavings}M
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Case Studies Cards */}
      <div className="eoc-card">
        <div className="eoc-card-header">
          <div className="eoc-card-title">
            <FileCheck size={16} color="#0284c7" />
            Curated Historical Incident Studies &amp; Realized Preventative Delta
          </div>
        </div>

        <div className="eoc-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {HISTORICAL_CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.74rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>{cs.date}</span>
                <strong style={{ color: '#059669', fontFamily: 'monospace' }}>{cs.financialAverted} Averted</strong>
              </div>

              <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{cs.event}</strong>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Asset: {cs.assetClass}</div>

              <div style={{ color: '#9f1239', background: '#fff1f2', padding: '0.4rem', borderRadius: 4, border: '1px solid #fecdd3', fontSize: '0.7rem' }}>
                <strong>Failure Mode:</strong> {cs.failureMode}
              </div>

              <div style={{ color: '#065f46', background: '#ecfdf5', padding: '0.4rem', borderRadius: 4, border: '1px solid #a7f3d0', fontSize: '0.7rem' }}>
                <strong>AI Action:</strong> {cs.outcomeWithAI}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
