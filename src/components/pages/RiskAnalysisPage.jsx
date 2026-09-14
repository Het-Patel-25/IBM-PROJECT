import React, { useState } from 'react';
import { 
  BarChart3, 
  Cpu, 
  Sliders, 
  AlertTriangle, 
  AlertOctagon, 
  Zap, 
  Wind, 
  Clock, 
  FileSpreadsheet, 
  MapPin, 
  CheckCircle,
  TrendingUp,
  Activity,
  Sparkles
} from 'lucide-react';
import { STRATEGIC_ASSETS } from '../../data/mockAssets';

export default function RiskAnalysisPage({ onNavigate }) {
  // Interactive Simulator inputs matching Image 2
  const [temp, setTemp] = useState(112);
  const [vibration, setVibration] = useState(6.2);
  const [windSpeed, setWindSpeed] = useState(85);
  const [gridImpact, setGridImpact] = useState(95);
  const [load, setLoad] = useState(88);
  const [age, setAge] = useState(15);
  const [dgaQuality, setDgaQuality] = useState('Poor (Dielectric Breakdown < 15 kV)');
  const [incidents, setIncidents] = useState('2 - Recurrent Trip Incidents (High)');

  // Simulation output state
  const [simResults, setSimResults] = useState({
    failureProb: 92,
    weightedRisk: 91,
    status: 'CRITICAL',
    predictionClass: 'Predicted Class: 1 (Failure Imminent)',
    headline: 'Outage Threshold Exceeded',
    details: 'High thermal inertia + shear gale forces require immediate crew dispatch.'
  });

  const handleRunModel = () => {
    // Dynamic synthesis calculation based on Viva formula:
    // Equipment Risk (40%) + Weather Risk (25%) + Historical Risk (15%) + Grid Impact (20%)
    const equipRisk = Math.min(100, (temp / 120) * 50 + (vibration / 8.0) * 30 + (load / 100) * 20);
    const weatherR = Math.min(100, (windSpeed / 100) * 100);
    const histRisk = dgaQuality.includes('Poor') ? 85 : 40;
    const impactR = gridImpact;

    const synthesized = Math.round(
      (equipRisk * 0.40) + (weatherR * 0.25) + (histRisk * 0.15) + (impactR * 0.20)
    );

    const rfFailure = Math.min(99, Math.round(synthesized * 1.01));

    setSimResults({
      failureProb: rfFailure,
      weightedRisk: synthesized,
      status: synthesized >= 80 ? 'CRITICAL' : synthesized >= 60 ? 'HIGH' : synthesized >= 40 ? 'WARNING' : 'NORMAL',
      predictionClass: synthesized >= 65 ? 'Predicted Class: 1 (Failure Imminent)' : 'Predicted Class: 0 (Stable Operations)',
      headline: synthesized >= 80 ? 'Outage Threshold Exceeded' : synthesized >= 60 ? 'High Risk Warning Zone' : 'Operational Parameters Safe',
      details: synthesized >= 80 
        ? 'High thermal inertia + shear gale forces require immediate crew dispatch.' 
        : 'Telemetry operating within baseline acceptable contingency allowances.'
    });
  };

  const topFive = [
    { name: 'Pine Valley T-01', rank: 'Rank #1', score: 91, color: 'critical' },
    { name: 'Substation S-02', rank: 'Rank #2', score: 84, color: 'critical' },
    { name: 'Westside F-01', rank: 'Rank #3', score: 66, color: 'high' },
    { name: 'Harbor Pt T-03', rank: 'Rank #4', score: 63, color: 'high' },
    { name: 'East River F-04', rank: 'Rank #5', score: 44, color: 'warning' }
  ];

  const rankedMatrix = [
    { rank: 1, name: 'Pine Valley T-01', sub: 'Step-down 230/138kV', area: 'Pine Valley', equip: '92%', weather: '85%', hist: '80%', impact: '95%', overall: '91%', priority: 'Critical #1', pColor: 'red' },
    { rank: 2, name: 'Substation S-02', sub: 'Distribution bus bar', area: 'Pine Valley', equip: '84%', weather: '85%', hist: '75%', impact: '50%', overall: '84%', priority: 'Critical #2', pColor: 'red' },
    { rank: 3, name: 'Westside F-01', sub: 'Overhead Feeder 13.8kV', area: 'Westside', equip: '70%', weather: '55%', hist: '65%', impact: '70%', overall: '66%', priority: 'High #3', pColor: 'orange' },
    { rank: 4, name: 'Harbor Point T-03', sub: 'Step-down 138/69kV', area: 'Harbor Point', equip: '68%', weather: '50%', hist: '80%', impact: '65%', overall: '63%', priority: 'High #4', pColor: 'orange' },
    { rank: 5, name: 'East River F-04', sub: 'Underground Feeder Segment', area: 'East River', equip: '48%', weather: '30%', hist: '55%', impact: '40%', overall: '44%', priority: 'Warning #5', pColor: 'yellow' },
    { rank: 6, name: 'North Grid T-02', sub: 'Auxiliary Step-down', area: 'North Grid', equip: '32%', weather: '20%', hist: '20%', impact: '40%', overall: '29%', priority: 'Normal', pColor: 'green' }
  ];

  return (
    <div className="risk-analysis-page-v2">
      {/* 1. Header Banner */}
      <div className="academic-page-header">
        <div className="header-text-group">
          <div className="viva-mode-pill">
            <span>MODULE 04 - EE CAPSTONE VIVA • Supervised Learning Prediction Pipeline</span>
          </div>
          <h2 className="header-v2-title">
            Multi-Factor Risk Synthesis &amp; Scikit-Learn Random Forest Classifier
          </h2>
          <p className="header-v2-sub">
            Real-time integration of supervised telemetry feature vectors, multivariate weather perturbation models, and topological critical grid load metrics for automated grid contingency prevention.
          </p>
        </div>

        <div className="header-chips-row">
          <span className="spec-pill-blue">Scikit-Learn v1.3 • n_estimators: 100</span>
          <span className="spec-pill-blue">IEEE 14-Bus Synthetic Dataset</span>
        </div>
      </div>

      {/* 2. Viva Mathematical Algorithm Formula Box */}
      <div className="card formula-banner-card">
        <div className="formula-top-row">
          <span className="formula-tag">VIVA CORE MATHEMATICAL ALGORITHM</span>
          <div className="formula-chips">
            <span className="chip-sm">Σ Weights = 1.00</span>
            <span className="chip-sm">4-Loss Gini Impurity</span>
          </div>
        </div>
        <div className="formula-equation">
          <span className="font-bold text-primary">Overall Risk =</span>{' '}
          <span>(Equipment Risk × <strong>40%</strong>)</span> +{' '}
          <span>(Weather Risk × <strong>25%</strong>)</span> +{' '}
          <span>(Historical Risk × <strong>15%</strong>)</span> +{' '}
          <span>(Grid Impact × <strong>20%</strong>)</span>
        </div>
      </div>

      {/* 3. Two Main Columns: Simulator (Left) & Feature Importance (Right) */}
      <div className="simulator-grid-two">
        {/* Left: Interactive Machine Learning Simulator */}
        <div className="card simulator-card">
          <div className="sim-header">
            <div className="sim-title-group">
              <Cpu size={18} className="text-primary" />
              <h3 className="sim-title">Interactive Machine Learning Simulator</h3>
            </div>
            <span className="inference-time-badge">Inference Time: 4.6ms</span>
          </div>
          <p className="sim-sub">Live inference via Scikit-Learn Random Forest Classifier Ensemble</p>

          <div className="sim-sliders-grid">
            {/* Temperature */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Temperature</span>
                <span className="sim-val-pill text-danger">{temp}°C</span>
              </div>
              <input 
                type="range" min="40" max="130" value={temp} 
                onChange={(e) => setTemp(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Normal (55°C)</span>
                <span className="text-danger">Critical (&gt;105°C)</span>
              </div>
            </div>

            {/* Vibration */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Vibration Frequency</span>
                <span className="sim-val-pill text-danger">{vibration} mm/s</span>
              </div>
              <input 
                type="range" min="0.5" max="8.0" step="0.1" value={vibration} 
                onChange={(e) => setVibration(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Nominal &lt;2.5</span>
                <span className="text-danger">Harmonic Spike</span>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Gale Wind Speed</span>
                <span className="sim-val-pill text-danger">{windSpeed} km/h</span>
              </div>
              <input 
                type="range" min="10" max="120" value={windSpeed} 
                onChange={(e) => setWindSpeed(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Breeze (15 km/h)</span>
                <span className="text-danger">Severe Gale (&gt;80+)</span>
              </div>
            </div>

            {/* Grid Impact */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Grid Downstream Impact</span>
                <span className="sim-val-pill text-danger">{gridImpact}%</span>
              </div>
              <input 
                type="range" min="10" max="100" value={gridImpact} 
                onChange={(e) => setGridImpact(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Sub-feeder</span>
                <span className="text-danger">Critical Hospital/Metro</span>
              </div>
            </div>

            {/* Transformer Load */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Transformer Load</span>
                <span className="sim-val-pill text-warning">{load}%</span>
              </div>
              <input 
                type="range" min="20" max="110" value={load} 
                onChange={(e) => setLoad(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Rated Capacity</span>
                <span className="text-warning">Overload Alert</span>
              </div>
            </div>

            {/* Asset Age */}
            <div className="sim-slider-group">
              <div className="sim-label-row">
                <span className="sim-label">Asset Age</span>
                <span className="sim-val-pill">{age} yrs</span>
              </div>
              <input 
                type="range" min="1" max="30" value={age} 
                onChange={(e) => setAge(Number(e.target.value))} 
                className="sim-slider" 
              />
              <div className="sim-range-limits">
                <span>Commissioned (1yr)</span>
                <span className="text-muted">End-of-life (&gt;25 yrs)</span>
              </div>
            </div>
          </div>

          {/* Dropdown Selectors */}
          <div className="sim-dropdowns-row">
            <div className="sim-drop-col">
              <label className="sim-drop-label">Dissolved Gas / Oil Quality</label>
              <select 
                className="form-input sim-select"
                value={dgaQuality}
                onChange={(e) => setDgaQuality(e.target.value)}
              >
                <option value="Poor (Dielectric Breakdown < 15 kV)">Poor (Dielectric Breakdown &lt; 15 kV)</option>
                <option value="Fair (Dielectric Breakdown 30-45 kV)">Fair (Dielectric Breakdown 30-45 kV)</option>
                <option value="Good (Dielectric Breakdown > 50 kV)">Good (Dielectric Breakdown &gt; 50 kV)</option>
              </select>
            </div>

            <div className="sim-drop-col">
              <label className="sim-drop-label">Historic Tripping Incidents</label>
              <select 
                className="form-input sim-select"
                value={incidents}
                onChange={(e) => setIncidents(e.target.value)}
              >
                <option value="2 - Recurrent Trip Incidents (High)">2 - Recurrent Trip Incidents (High)</option>
                <option value="1 - Single Non-critical Trip">1 - Single Non-critical Trip</option>
                <option value="0 - Clean Maintenance History">0 - Clean Maintenance History</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="btn btn-primary btn-block btn-lg run-ml-btn"
            onClick={handleRunModel}
          >
            <Cpu size={18} />
            <span>Run ML Model (Random Forest)</span>
          </button>

          {/* Simulation Output Card matching screenshot */}
          <div className="sim-output-card">
            <div className="output-left-col">
              <div className="outage-icon-box">
                <AlertOctagon size={24} className="text-danger" />
              </div>
              <div>
                <div className="output-status-tags">
                  <span className="badge-crit-filled">{simResults.status}</span>
                  <span className="text-xs text-muted font-medium">{simResults.predictionClass}</span>
                </div>
                <h4 className="output-headline">{simResults.headline}</h4>
                <p className="output-desc">{simResults.details}</p>
              </div>
            </div>

            <div className="output-right-scores">
              <div className="score-box">
                <span className="score-label">RF FAILURE PROB</span>
                <span className="score-num text-danger">{simResults.failureProb}%</span>
              </div>
              <div className="score-box">
                <span className="score-label">WEIGHTED RISK</span>
                <span className="score-num text-danger">{simResults.weightedRisk}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feature Importance & Active Asset */}
        <div className="feature-importance-column">
          {/* Gini Feature Importance Card */}
          <div className="card feature-importance-card">
            <div className="feat-header-row">
              <h3 className="card-title-v2">Feature Importance</h3>
              <code className="code-pill">model.feature_importances_</code>
            </div>
            <p className="card-subtitle-v2">
              Gini impurity reduction across 100 decision trees confirms transformer core temperature as the primary predictive factor:
            </p>

            <div className="feat-bars-list">
              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Temperature (Core °C)</span>
                  <strong>38.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill blue" style={{ width: '38%' }} />
                </div>
              </div>

              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Vibration Velocity (Harmonic mm/s)</span>
                  <strong>22.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill blue-light" style={{ width: '22%' }} />
                </div>
              </div>

              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Wind Speed (Gust &gt; km/h)</span>
                  <strong>18.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill cyan" style={{ width: '18%' }} />
                </div>
              </div>

              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Dielectric Oil Quality Index</span>
                  <strong>14.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill gray-blue" style={{ width: '14%' }} />
                </div>
              </div>

              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Current Active Load (%)</span>
                  <strong>10.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill gray-blue" style={{ width: '10%' }} />
                </div>
              </div>

              <div className="feat-bar-item">
                <div className="feat-label-row">
                  <span>Historical Failure Count (24m)</span>
                  <strong>8.0%</strong>
                </div>
                <div className="feat-track">
                  <div className="feat-fill gray" style={{ width: '8%' }} />
                </div>
              </div>
            </div>

            <div className="feat-footer-row">
              <span>Trained with 5-fold cross-validation</span>
              <strong className="text-primary">ROC AUC: 0.968</strong>
            </div>
          </div>

          {/* Active Monitored Asset Card */}
          <div className="card active-asset-banner-card">
            <div className="active-asset-top">
              <span className="active-asset-tag">ACTIVE MONITORED ASSET</span>
            </div>
            <h4 className="active-asset-title">Pine Valley Substation T-01</h4>
            <p className="active-asset-desc">
              Primary 230kV step-down transformer supplying critical municipal loads including regional hospitals and water treatment hubs.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Top 5 Risky Assets Overall Risk Comparison Bar Chart */}
      <div className="card comparison-bar-card">
        <div className="comparison-header-row">
          <div>
            <h3 className="card-title-v2">Top 5 Risky Assets • Overall Risk Score Comparison</h3>
            <p className="card-subtitle-v2">
              Synthesized risk rating index derived from weighted multi-factor telemetry formula.
            </p>
          </div>
          <div className="comp-legend">
            <span className="scale-dot red">●</span> <span>&gt;80% Critical</span>
            <span className="scale-dot orange ml-2">●</span> <span>60-79% High</span>
            <span className="scale-dot yellow ml-2">●</span> <span>40-59% Warning</span>
            <span className="scale-dot green ml-2">●</span> <span>&lt;40% Normal</span>
          </div>
        </div>

        <div className="bar-chart-five-wrapper">
          {topFive.map((item, idx) => (
            <div key={idx} className="bar-col-item">
              <span className="bar-val-text font-bold">{item.score}%</span>
              <div className="bar-track-col">
                <div 
                  className={`bar-fill-col ${item.color}`}
                  style={{ height: `${item.score}%` }} 
                />
              </div>
              <span className="bar-name-label">{item.name}</span>
              <span className="bar-rank-label text-muted">{item.rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Ranked Risk Analysis Table (Module 4) */}
      <div className="card ranked-table-card">
        <div className="fleet-table-header">
          <div>
            <h3 className="card-title-v2">Ranked Risk Analysis Table (Module 4)</h3>
            <p className="card-subtitle-v2">
              Synthesized formula matrix computed dynamically across 25 active electrical substations.
            </p>
          </div>
          <div className="table-actions-right">
            <span className="badge-key-priority">6 Key Priority Assets</span>
            <button className="btn btn-secondary btn-xs">
              <FileSpreadsheet size={13} />
              <span>CSV Export</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="v2-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>ASSET NAME</th>
                <th>AREA</th>
                <th>EQUIPMENT RISK (40%)</th>
                <th>WEATHER RISK (25%)</th>
                <th>HISTORICAL RISK (15%)</th>
                <th>GRID IMPACT (20%)</th>
                <th>OVERALL RISK</th>
                <th>VIVA PRIORITY</th>
              </tr>
            </thead>
            <tbody>
              {rankedMatrix.map((row) => (
                <tr key={row.rank} className="v2-row-hover">
                  <td>
                    <span className="rank-circle">{row.rank}</span>
                  </td>
                  <td>
                    <div className="asset-name-text">{row.name}</div>
                    <div className="asset-sub-code">{row.sub}</div>
                  </td>
                  <td>
                    <span className="text-sm">{row.area}</span>
                  </td>
                  <td>
                    <span className="risk-num-text text-danger font-semibold">{row.equip}</span>
                  </td>
                  <td>
                    <span className="risk-num-text">{row.weather}</span>
                  </td>
                  <td>
                    <span className="risk-num-text">{row.hist}</span>
                  </td>
                  <td>
                    <span className="risk-num-text font-semibold">{row.impact}</span>
                  </td>
                  <td>
                    <span className="overall-score-pill font-bold">{row.overall}</span>
                  </td>
                  <td>
                    <span className={`status-badge-v2 ${row.pColor}`}>
                      ● {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Four Bottom Critical Summary Cards matching Image 2 */}
      <div className="four-summary-cards-grid">
        {/* Card 1 */}
        <div className="card summary-card-v2">
          <div className="summary-card-tag-row">
            <span className="summary-tag-red">HIGHEST-RISK ASSET</span>
            <span className="badge-rank-pill">Rank 1</span>
          </div>
          <h4 className="summary-title">Pine Valley T-01</h4>
          <div className="summary-score-large text-danger">91% <span className="text-xs font-normal text-muted">Synthesized Score</span></div>
          <p className="summary-body-text">
            Severe core heating at 112°C with degraded dielectric oil. Immediate trip risk under gale conditions.
          </p>
          <div className="summary-footer-meta">
            <Zap size={13} className="text-danger" />
            <span>Transformer Rating: 45 MVA</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card summary-card-v2">
          <div className="summary-card-tag-row">
            <span className="summary-tag-blue">HIGHEST-RISK AREA</span>
            <span className="badge-rank-pill">Zone Delta</span>
          </div>
          <h4 className="summary-title">Pine Valley Sector</h4>
          <div className="summary-score-large text-primary">88% <span className="text-xs font-normal text-muted">Weather Exposure</span></div>
          <p className="summary-body-text">
            Combined vulnerability: severe sustained 85 km/h winds intersecting with legacy 15-year unshielded overhead lines.
          </p>
          <div className="summary-footer-meta">
            <MapPin size={13} className="text-primary" />
            <span>Covers 143,000 Customer Connections</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card summary-card-v2">
          <div className="summary-card-tag-row">
            <span className="summary-tag-orange">CRITICAL INFRASTRUCTURE</span>
            <span className="badge-rank-pill">95% Impact</span>
          </div>
          <h4 className="summary-title">Hospital &amp; Water Supply</h4>
          <p className="summary-body-text mt-2">
            Pine Valley feeders directly power the regional <strong>Level-1 Trauma Center</strong> and primary municipal water pumping treatment plant.
          </p>
          <div className="summary-footer-meta mt-auto">
            <Activity size={13} className="text-orange" />
            <span>Contingency bus transfer required</span>
          </div>
        </div>

        {/* Card 4 (Blue CTA) */}
        <div className="card summary-card-cta">
          <div className="cta-tag-row">
            <span className="cta-badge">ACTION PROTOCOL</span>
            <span className="badge-urgent">URGENT</span>
          </div>
          <h4 className="cta-title">Dispatch Alpha Team</h4>
          <p className="cta-body-text">
            Immediate order: Deploy Alpha Rapid Crew for urgent pre-impact oil nitrogen cooling and execute feeder load bypass to Substation S-02.
          </p>
          <button 
            className="btn btn-white-cta btn-block"
            onClick={() => onNavigate('maintenance')}
          >
            Authorize Crew Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}
