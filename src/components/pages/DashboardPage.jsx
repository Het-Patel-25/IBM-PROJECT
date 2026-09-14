import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Layers, 
  AlertTriangle, 
  Map, 
  Bell, 
  Wind, 
  CloudRain, 
  Zap, 
  Thermometer, 
  CheckCircle2, 
  Activity, 
  PieChart as PieIcon 
} from 'lucide-react';
import { WEATHER_SECTORS, LIVE_ALERTS } from '../../data/mockAssets';

export default function DashboardPage({ 
  assets, 
  onSelectAsset, 
  onNavigate 
}) {
  const [alerts, setAlerts] = useState(LIVE_ALERTS);

  const topRisky = assets.slice(0, 5);

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  return (
    <div className="dashboard-v2-container">
      {/* 1. Viva Demonstration Protocol Banner */}
      <div className="viva-protocol-card">
        <div className="viva-protocol-left">
          <div className="viva-icon-box">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="viva-protocol-tag-row">
              <span className="viva-protocol-title">Viva Demonstration Protocol</span>
              <span className="viva-phase-badge">PHASE IV: ML SIMULATION</span>
            </div>
            <p className="viva-protocol-desc">
              <strong>Demonstration Sequence:</strong> Inspect sensor anomaly on <strong>Pine Valley T-01</strong> → Run ML Inference (92% failure probability) → Calculate aggregate grid criticality (91%) → Dispatch Crew Alpha.
            </p>
          </div>
        </div>

        <div className="viva-protocol-actions">
          <button 
            className="viva-step-btn"
            onClick={() => onSelectAsset('pv-tx-001')}
          >
            <span>1</span> Inspect T-01
          </button>
          <button 
            className="viva-step-btn"
            onClick={() => onNavigate('risk')}
          >
            <span>2</span> Run RF ML Model
          </button>
          <button 
            className="viva-step-btn"
            onClick={() => onNavigate('risk')}
          >
            <span>3</span> Assess 91% Risk
          </button>
          <button 
            className="btn btn-primary viva-deploy-btn"
            onClick={() => onNavigate('maintenance')}
          >
            Deploy Alpha Crew
          </button>
        </div>
      </div>

      {/* 2. Four Stat Cards */}
      <div className="stats-row-v2">
        {/* Total Assets */}
        <div className="stat-box-v2">
          <div className="stat-top-row">
            <span className="stat-title-v2">TOTAL ASSETS</span>
            <div className="stat-icon-wrap blue">
              <Layers size={16} />
            </div>
          </div>
          <div className="stat-value-row">
            <span className="stat-big-num">25</span>
            <span className="stat-pill-green">100% Online</span>
          </div>
          <div className="stat-breakdown-text">
            <span>12 Transformers</span> • <span>8 Feeders</span> • <span>5 Substations</span>
          </div>
        </div>

        {/* At-Risk Assets */}
        <div className="stat-box-v2">
          <div className="stat-top-row">
            <span className="stat-title-v2">AT-RISK ASSETS</span>
            <div className="stat-icon-wrap orange">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="stat-value-row">
            <span className="stat-big-num text-danger">6</span>
            <span className="stat-sub-label">24% of Total Fleet</span>
          </div>
          <div className="stat-dots-row">
            <span className="stat-dot red">●</span> <span>2 Critical (&gt;80%)</span>
            <span className="stat-dot orange ml-2">●</span> <span>4 High (60-80%)</span>
          </div>
        </div>

        {/* High-Risk Sectors */}
        <div className="stat-box-v2">
          <div className="stat-top-row">
            <span className="stat-title-v2">HIGH-RISK SECTORS</span>
            <div className="stat-icon-wrap blue-light">
              <Map size={16} />
            </div>
          </div>
          <div className="stat-value-row">
            <span className="stat-big-num">3</span>
            <span className="stat-sub-label">Storm Corridors</span>
          </div>
          <div className="stat-sectors-row">
            <span className="text-danger font-semibold">Pine Valley</span> • <span>Westside</span> • <span>Harbor Point</span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="stat-box-v2">
          <div className="stat-top-row">
            <span className="stat-title-v2">ACTIVE ALERTS</span>
            <div className="stat-icon-wrap red">
              <Bell size={16} />
            </div>
          </div>
          <div className="stat-value-row">
            <span className="stat-big-num text-danger">4</span>
            <span className="stat-sub-label">Requires Immediate Triage</span>
          </div>
          <div className="stat-alert-tags">
            <span className="badge-red-sm">2 CRITICAL</span>
            <span className="badge-yellow-sm">2 WARNINGS</span>
            <span className="text-muted text-xs">0 Unchecked</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Top Risk Grid Assets (Left) & Recent Alerts (Right) */}
      <div className="middle-dashboard-grid">
        {/* Top Risk Table */}
        <div className="card top-risk-table-card">
          <div className="card-header-v2">
            <div>
              <div className="table-title-row">
                <h3 className="card-title-v2">Top Risk Grid Assets</h3>
                <span className="badge-sort">Sorted by Risk Index</span>
              </div>
              <p className="card-subtitle-v2">
                Multi-factor score evaluated from real-time SCADA telemetry, structural age, and weather severity.
              </p>
            </div>

            {/* Scale legend */}
            <div className="scale-legend-wrap">
              <span className="scale-label">SCALE:</span>
              <span className="scale-badge normal">0-40% Normal</span>
              <span className="scale-badge warning">41-60% Warn</span>
              <span className="scale-badge high">61-80% High</span>
              <span className="scale-badge critical">81-100% Critical</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="v2-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>ASSET NAME</th>
                  <th>ASSET TYPE</th>
                  <th>GRID AREA</th>
                  <th>FAILURE RISK</th>
                  <th>GRID IMPACT</th>
                  <th>OVERALL RISK</th>
                </tr>
              </thead>
              <tbody>
                {topRisky.map((asset) => {
                  const isRank1 = asset.rank === 1;
                  const isCrit = asset.overallRisk >= 81;
                  const isHigh = asset.overallRisk >= 61 && asset.overallRisk < 81;
                  const isWarn = asset.overallRisk >= 41 && asset.overallRisk < 61;
                  return (
                    <tr 
                      key={asset.id} 
                      className={`v2-row-hover ${isRank1 ? 'row-highlight-crit' : ''}`}
                      onClick={() => onSelectAsset(asset.id)}
                    >
                      <td>
                        <span className={`rank-pill ${isRank1 ? 'rank-pill-crit' : ''}`}>
                          {isRank1 ? '! #1' : `#${asset.rank}`}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className={`asset-name-text ${isRank1 ? 'text-danger font-bold' : ''}`}>
                            {asset.name}
                          </div>
                          <div className="asset-sub-code">{asset.code}</div>
                        </div>
                      </td>
                      <td>
                        <span className="text-secondary text-sm">{asset.type}</span>
                      </td>
                      <td>
                        <span className="text-secondary text-sm">{asset.area}</span>
                      </td>
                      <td>
                        <span className={`risk-val ${isCrit ? 'text-danger' : isHigh ? 'text-orange' : isWarn ? 'text-warning' : 'text-normal'}`}>
                          {asset.failureRisk}%
                        </span>
                      </td>
                      <td>
                        <span className={`risk-val ${asset.gridImpact >= 80 ? 'text-danger' : ''}`}>
                          {asset.gridImpact}%
                        </span>
                      </td>
                      <td>
                        <span className={`overall-risk-badge ${isCrit ? 'bg-crit' : isHigh ? 'bg-high' : isWarn ? 'bg-warn' : 'bg-norm'}`}>
                          {asset.overallRisk}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="card recent-alerts-card">
          <div className="card-header-v2">
            <div className="alerts-title-wrap">
              <h3 className="card-title-v2">Recent Alerts</h3>
              <span className="badge-live-count">{alerts.length} Live</span>
            </div>
            <button className="btn-acknowledge" onClick={handleAcknowledgeAll}>
              Acknowledge All
            </button>
          </div>

          <div className="v2-alerts-list">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`v2-alert-card ${alert.severity.toLowerCase()}`}
              >
                <div className="alert-top-row">
                  <span className={`alert-tag-badge ${alert.severity.toLowerCase()}`}>
                    {alert.tag}
                  </span>
                  <span className="alert-time-text">{alert.time}</span>
                </div>
                <div className="alert-asset-name">{alert.assetName}</div>
                <p className="alert-msg-text">{alert.message}</p>
                {alert.cta && (
                  <button 
                    className="alert-cta-btn"
                    onClick={() => onSelectAsset(alert.assetId)}
                  >
                    {alert.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom 3-Column Analytics */}
      <div className="bottom-three-grid">
        {/* Column 1: Asset Risk Distribution Donut */}
        <div className="card bottom-card-v2">
          <div className="bottom-card-header">
            <div>
              <h4 className="bottom-card-title">Asset Risk Distribution</h4>
              <p className="bottom-card-sub">Fleet Categorization (25 Monitored Units)</p>
            </div>
            <PieIcon size={16} className="text-muted" />
          </div>

          <div className="donut-chart-wrapper">
            {/* SVG Donut Chart */}
            <div className="donut-svg-box">
              <svg viewBox="0 0 160 160" className="donut-svg">
                <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
                {/* Normal 56% (stroke-dasharray) */}
                <circle 
                  cx="80" cy="80" r="60" fill="transparent" 
                  stroke="#10b981" strokeWidth="20" 
                  strokeDasharray={`${(14 / 25) * 377} 377`}
                  strokeDashoffset="0"
                  transform="rotate(-90 80 80)"
                />
                {/* Warning 20% */}
                <circle 
                  cx="80" cy="80" r="60" fill="transparent" 
                  stroke="#f59e0b" strokeWidth="20" 
                  strokeDasharray={`${(5 / 25) * 377} 377`}
                  strokeDashoffset={`${-((14 / 25) * 377)}`}
                  transform="rotate(-90 80 80)"
                />
                {/* High 16% */}
                <circle 
                  cx="80" cy="80" r="60" fill="transparent" 
                  stroke="#f97316" strokeWidth="20" 
                  strokeDasharray={`${(4 / 25) * 377} 377`}
                  strokeDashoffset={`${-(((14 + 5) / 25) * 377)}`}
                  transform="rotate(-90 80 80)"
                />
                {/* Critical 8% */}
                <circle 
                  cx="80" cy="80" r="60" fill="transparent" 
                  stroke="#ef4444" strokeWidth="20" 
                  strokeDasharray={`${(2 / 25) * 377} 377`}
                  strokeDashoffset={`${-(((14 + 5 + 4) / 25) * 377)}`}
                  transform="rotate(-90 80 80)"
                />
              </svg>
              <div className="donut-center-text">
                <span className="donut-big-num">25</span>
                <span className="donut-sub-text">Assets</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend-grid">
              <div className="legend-chip">
                <span className="legend-circle green" />
                <span>Normal <strong>14 (56%)</strong></span>
              </div>
              <div className="legend-chip">
                <span className="legend-circle yellow" />
                <span>Warning <strong>5 (20%)</strong></span>
              </div>
              <div className="legend-chip">
                <span className="legend-circle orange" />
                <span>High Risk <strong>4 (16%)</strong></span>
              </div>
              <div className="legend-chip">
                <span className="legend-circle red" />
                <span>Critical <strong>2 (8%)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Temperature Trend (24h) */}
        <div className="card bottom-card-v2">
          <div className="bottom-card-header">
            <div>
              <div className="trend-title-row">
                <h4 className="bottom-card-title">Temperature Trend (24h)</h4>
                <span className="peak-temp-badge">112°C PEAK</span>
              </div>
              <p className="bottom-card-sub">Pine Valley T-01 Winding vs. 85°C Baseline</p>
            </div>
            <Thermometer size={16} className="text-danger" />
          </div>

          <div className="temp-curve-container">
            <svg viewBox="0 0 320 120" className="temp-curve-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* 85°C baseline */}
              <line x1="0" y1="70" x2="320" y2="70" stroke="#cbd5e1" strokeDasharray="3" strokeWidth="1.5" />
              <text x="5" y="65" fill="#94a3b8" fontSize="9">Max Safe Threshold (85°C)</text>

              {/* Curve area and path */}
              <path 
                d="M 10 90 Q 70 86, 120 80 T 200 68 T 270 30 L 310 15 L 310 115 L 10 115 Z" 
                fill="url(#tempGradient)" 
              />
              <path 
                d="M 10 90 Q 70 86, 120 80 T 200 68 T 270 30 L 310 15" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
              />

              {/* Active Peak Dot */}
              <circle cx="310" cy="15" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            </svg>

            <div className="temp-curve-labels">
              <div>-24h<br /><span className="text-muted">(74°C)</span></div>
              <div>-16h<br /><span className="text-muted">(77°C)</span></div>
              <div>-8h<br /><span className="text-muted">(82°C)</span></div>
              <div>-2h<br /><span className="text-muted">(98°C)</span></div>
              <div className="text-danger font-bold">Now<br /><span>(112°C)</span></div>
            </div>

            <div className="temp-footer-notes">
              <span className="dot-red-small" />
              <span>Storm surge delta: <strong>+37°C within 6h</strong></span>
              <span className="badge-dielectric-alert">Dielectric Warning Active</span>
            </div>
          </div>
        </div>

        {/* Column 3: Weather Impact Zone */}
        <div className="card bottom-card-v2">
          <div className="bottom-card-header">
            <div>
              <h4 className="bottom-card-title">Weather Impact Zone</h4>
              <p className="bottom-card-sub">Doppler Radar Stream • Regional Grid Sectors</p>
            </div>
            <Wind size={16} className="text-primary" />
          </div>

          <div className="weather-sectors-list">
            {WEATHER_SECTORS.map((sector, idx) => (
              <div key={idx} className={`weather-sector-card ${sector.badgeClass}`}>
                <div className="weather-sector-head">
                  <span className="sector-name">{sector.name}</span>
                  <span className={`sector-threat-badge ${sector.badgeClass}`}>{sector.threat}</span>
                </div>
                <div className="weather-readings-row">
                  <div className="weather-reading-col">
                    <span className="w-label">Wind Speed</span>
                    <span className="w-val font-bold">{sector.wind}</span>
                  </div>
                  <div className="weather-reading-col">
                    <span className="w-label">Precipitation</span>
                    <span className={`w-val ${sector.badgeClass === 'critical' ? 'text-danger font-bold' : ''}`}>
                      {sector.precip}
                    </span>
                  </div>
                  <div className="weather-reading-col">
                    <span className="w-label">Lightning</span>
                    <span className={`w-val ${sector.badgeClass === 'critical' ? 'text-danger font-bold' : ''}`}>
                      {sector.lightning}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
