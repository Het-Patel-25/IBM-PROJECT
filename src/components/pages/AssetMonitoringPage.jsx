import React, { useState } from 'react';
import { 
  Activity, 
  Thermometer, 
  Waves, 
  Droplets, 
  Gauge, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Wrench, 
  MapPin, 
  Zap, 
  HelpCircle, 
  FileSpreadsheet, 
  Search,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { getRiskLevel } from '../../data/mockAssets';

export default function AssetMonitoringPage({ 
  assets, 
  selectedAssetId, 
  onSelectAsset, 
  onNavigate 
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedResetActive, setSimulatedResetActive] = useState(false);

  // Find currently selected asset or default to Pine Valley T-01
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = 
      filterCategory === 'All' || 
      (filterCategory === 'Transformers' && asset.category === 'Transformer') ||
      (filterCategory === 'Substations' && asset.category === 'Substation') ||
      (filterCategory === 'Feeders' && asset.category === 'Feeder');
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulateReset = () => {
    setSimulatedResetActive(true);
    setTimeout(() => setSimulatedResetActive(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Type,Area,Temperature,Vibration,Load,Risk\n';
    const rows = assets.map((a) => `${a.id},${a.name},${a.type},${a.area},${a.temperature},${a.vibration},${a.load},${a.overallRisk}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gridpulse_telemetry_ieee37.csv';
    link.click();
  };

  return (
    <div className="asset-v2-container">
      {/* 1. Header Banner */}
      <div className="academic-page-header">
        <div className="header-text-group">
          <div className="viva-mode-pill">
            <span>VIVA PRESENTATION MODE • IEEE 37-Node Test Feeder Benchmark</span>
          </div>
          <h2 className="header-v2-title">Asset Telemetry &amp; Fault Diagnostics</h2>
          <p className="header-v2-sub">
            Synthetic real-time SCADA feed cross-referenced with trained Random Forest classifier (94.8% Test Acc, F1 0.92).
          </p>
        </div>

        {/* Header Stats */}
        <div className="header-stats-row">
          <div className="header-stat-box">
            <span className="h-stat-label">Monitored Fleet</span>
            <span className="h-stat-val">25 <span className="text-muted text-xs font-normal">units</span></span>
          </div>
          <div className="header-stat-box highlight-crit">
            <span className="h-stat-label">Critical Risk (&gt;80%)</span>
            <span className="h-stat-val text-danger">● 2</span>
          </div>
          <div className="header-stat-box">
            <span className="h-stat-label">Avg Bus Load</span>
            <span className="h-stat-val">68.4%</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="fleet-filter-bar">
        <div className="filter-tabs-left">
          {[
            { key: 'All', label: 'All Assets (25)' },
            { key: 'Transformers', label: 'Transformers (12)' },
            { key: 'Substations', label: 'Substations (5)' },
            { key: 'Feeders', label: 'Feeders (8)' }
          ].map((tab) => (
            <button
              key={tab.key}
              className={`fleet-tab-btn ${filterCategory === tab.key ? 'active' : ''}`}
              onClick={() => setFilterCategory(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="filter-status-legend">
          <span className="status-indicator-tag red">● Critical (2)</span>
          <span className="status-indicator-tag yellow">● Warning (4)</span>
          <span className="status-indicator-tag green">● Normal (19)</span>
        </div>

        <div className="search-box-wrap">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search asset, ID, bus..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-fleet"
          />
        </div>
      </div>

      {/* 3. Selected Asset Hero Box */}
      <div className="card selected-asset-hero">
        <div className="hero-top-row">
          <div className="hero-left-info">
            <div className="hero-icon-box">
              <Zap size={26} className="text-danger" />
            </div>
            <div>
              <div className="hero-name-badge-row">
                <h3 className="hero-asset-name">{activeAsset.name}</h3>
                <span className="hero-crit-badge">CRITICAL RISK ({activeAsset.overallRisk}%)</span>
              </div>
              <div className="hero-meta-row">
                <span className="hero-meta-pill">ID: {activeAsset.id.toUpperCase()}</span>
                <span>•</span>
                <span>{activeAsset.type} ({activeAsset.voltage})</span>
                <span>•</span>
                <span>{activeAsset.substation}</span>
              </div>
              <div className="hero-submeta-row">
                <span>Asset Age: <strong>{activeAsset.age} Years</strong> (Installed 2010)</span>
                <span>•</span>
                <span><strong>{activeAsset.priorFaults} Prior Recorded Faults</strong></span>
              </div>
            </div>
          </div>

          <div className="hero-actions-right">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('maintenance')}
            >
              Create Ticket
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('maintenance')}
            >
              Assign Crew (Alpha Team)
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleSimulateReset}
              title="Simulate Reset"
            >
              <RotateCcw size={14} />
              <span>{simulatedResetActive ? 'Resetting...' : 'Simulate Sensor Reset'}</span>
            </button>
          </div>
        </div>

        {/* 4 Sensor Limit Cards */}
        <div className="four-sensors-grid">
          {/* 1. Temp */}
          <div className="sensor-card-v2 critical">
            <div className="sensor-card-head">
              <span className="sensor-title">Top-Oil / Winding Temp</span>
              <span className="sensor-badge-pill red">CRITICAL</span>
            </div>
            <div className="sensor-reading-row">
              <span className="sensor-val-num text-danger">{activeAsset.temperature}°C</span>
              <span className="sensor-limit-text">Limit: {activeAsset.tempLimit || 95}°C</span>
            </div>
            <p className="sensor-desc-text">
              Thermal threshold breached by +{activeAsset.temperature - 95}°C. Accelerated cellulose breakdown initiated.
            </p>
            <div className="sensor-range-track">
              <div className="range-fill red" style={{ width: `${Math.min(100, (activeAsset.temperature / 120) * 100)}%` }} />
            </div>
            <div className="range-labels-row">
              <span>Nominal (55°C)</span>
              <span>Warn (80°C)</span>
              <span>120°C</span>
            </div>
          </div>

          {/* 2. Vibration */}
          <div className="sensor-card-v2 critical">
            <div className="sensor-card-head">
              <span className="sensor-title">Core/Tank Vibration</span>
              <span className="sensor-badge-pill red">CRITICAL</span>
            </div>
            <div className="sensor-reading-row">
              <span className="sensor-val-num text-danger">{activeAsset.vibration} mm/s</span>
              <span className="sensor-limit-text">Limit: {activeAsset.vibLimit || 4.5} mm/s</span>
            </div>
            <p className="sensor-desc-text">
              Harmonic distortion indicates magnetic core lamination loosening or winding displacement.
            </p>
            <div className="sensor-range-track">
              <div className="range-fill red" style={{ width: `${Math.min(100, (activeAsset.vibration / 8.0) * 100)}%` }} />
            </div>
            <div className="range-labels-row">
              <span>0 mm/s</span>
              <span>Alert (4.5)</span>
              <span>8.0 mm/s</span>
            </div>
          </div>

          {/* 3. DGA & Oil */}
          <div className="sensor-card-v2 degraded">
            <div className="sensor-card-head">
              <span className="sensor-title">DGA &amp; Dielectric Oil</span>
              <span className="sensor-badge-pill orange">DEGRADED</span>
            </div>
            <div className="sensor-reading-row">
              <span className="sensor-val-num text-orange">{activeAsset.oilQuality || 'POOR'}</span>
              <span className="sensor-limit-text">BDV: {activeAsset.oilBdv || '24 kV'}</span>
            </div>
            <p className="sensor-desc-text">
              Dissolved Gas Analysis: High Ethylene (C2H4) and Hydrogen (H2) from electrical arcing.
            </p>
            <div className="sensor-range-track">
              <div className="range-fill orange" style={{ width: '38%' }} />
            </div>
            <div className="range-labels-row">
              <span>Critical (&lt;30kV)</span>
              <span>Acceptable (45kV)</span>
              <span>Good (&gt;50kV)</span>
            </div>
          </div>

          {/* 4. Operating Load */}
          <div className="sensor-card-v2 overload">
            <div className="sensor-card-head">
              <span className="sensor-title">Operating Load</span>
              <span className="sensor-badge-pill yellow">OVERLOAD RISK</span>
            </div>
            <div className="sensor-reading-row">
              <span className="sensor-val-num text-warning">{activeAsset.load}%</span>
              <span className="sensor-limit-text">Cap: {activeAsset.capacityMVA || 45} MVA</span>
            </div>
            <p className="sensor-desc-text">
              Storm emergency feeder reroute added 14 MVA extra load during high ambient winds (85 km/h).
            </p>
            <div className="sensor-range-track">
              <div className="range-fill yellow" style={{ width: `${activeAsset.load}%` }} />
            </div>
            <div className="range-labels-row">
              <span>Base (50%)</span>
              <span>Rated (80%)</span>
              <span>Overload (100%)</span>
            </div>
          </div>
        </div>

        {/* Dual Panels: ML Diagnosis (Left) & Recommended Mitigation (Right) */}
        <div className="diagnosis-mitigation-grid">
          {/* Left: Random Forest ML Diagnosis */}
          <div className="card diagnosis-box">
            <div className="box-header-row">
              <div className="box-title-with-icon">
                <Cpu size={18} className="text-primary" />
                <h4 className="box-title-text">Random Forest ML Diagnosis</h4>
              </div>
              <span className="badge-model-tag">Model Seed #42 • 100 Trees</span>
            </div>

            <p className="diagnosis-summary-text">
              <strong>High failure probability ({activeAsset.failureRisk}%) detected</strong> due to compound interaction of excessive winding temperature ({activeAsset.temperature}°C), abnormal mechanical vibration ({activeAsset.vibration} mm/s), degraded dielectric oil quality, and operating load sustained at {activeAsset.load}% compounded by local 85 km/h storm gale force gusts.
            </p>

            <div className="feature-contrib-section">
              <span className="feature-contrib-label">FEATURE IMPORTANCE CONTRIBUTION (GINI IMPURITY METRIC)</span>
              <div className="contrib-bars-list">
                <div className="contrib-item">
                  <div className="contrib-label-row">
                    <span>1. Winding Hotspot (112°C breaches thermal breakdown limit)</span>
                    <strong className="text-danger">36% Impact</strong>
                  </div>
                  <div className="contrib-bar-track">
                    <div className="contrib-bar-fill red" style={{ width: '36%' }} />
                  </div>
                </div>

                <div className="contrib-item">
                  <div className="contrib-label-row">
                    <span>2. Mechanical Vibration Spike (6.2 mm/s harmonics)</span>
                    <strong className="text-orange">29% Impact</strong>
                  </div>
                  <div className="contrib-bar-track">
                    <div className="contrib-bar-fill orange" style={{ width: '29%' }} />
                  </div>
                </div>

                <div className="contrib-item">
                  <div className="contrib-label-row">
                    <span>3. Chemical Oil BDV Breakdown &amp; Dissolved Gas</span>
                    <strong className="text-primary">21% Impact</strong>
                  </div>
                  <div className="contrib-bar-track">
                    <div className="contrib-bar-fill blue" style={{ width: '21%' }} />
                  </div>
                </div>

                <div className="contrib-item">
                  <div className="contrib-label-row">
                    <span>4. Severe Weather Proximity (85 km/h wind shear)</span>
                    <strong className="text-muted">14% Impact</strong>
                  </div>
                  <div className="contrib-bar-track">
                    <div className="contrib-bar-fill cyan" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="viva-prompt-card">
              <HelpCircle size={15} className="text-primary flex-shrink-0" />
              <span>
                <strong>Viva Prompt:</strong> "Explain why ensemble tree was chosen over linear regression for non-linear thermal-vibration couplings." RFC Q.4
              </span>
            </div>
          </div>

          {/* Right: Recommended Mitigation */}
          <div className="card mitigation-box">
            <div className="box-header-row">
              <div className="box-title-with-icon">
                <CheckCircle2 size={18} className="text-primary" />
                <h4 className="box-title-text">Recommended Mitigation</h4>
              </div>
              <span className="badge-immediate">Immediate (T &lt; 45 min)</span>
            </div>

            <div className="mitigation-steps-list">
              <div className="mitigation-step-item">
                <div className="step-num-pill">1</div>
                <div>
                  <span className="step-title">Inspect &amp; Force Cooling Pump</span>
                  <p className="step-desc">Engage auxiliary fans, check radiator fins for blockages or oil valve choke.</p>
                </div>
              </div>

              <div className="mitigation-step-item">
                <div className="step-num-pill">2</div>
                <div>
                  <span className="step-title">Perform Vacuum Oil Degassing</span>
                  <p className="step-desc">Extract combustible gas bubbles to recover dielectric insulation strength above 45 kV.</p>
                </div>
              </div>

              <div className="mitigation-step-item">
                <div className="step-num-pill">3</div>
                <div>
                  <span className="step-title">Reroute Feeder Load by 25%</span>
                  <p className="step-desc">Transfer tie-switch to Westside Feeder-02 to bring operating core load below 65%.</p>
                </div>
              </div>

              <div className="mitigation-step-item">
                <div className="step-num-pill">4</div>
                <div>
                  <span className="step-title">Pre-position Alpha Crew</span>
                  <p className="step-desc">Deploy substation bucket truck with thermal imaging camera to Pine Valley Substation.</p>
                </div>
              </div>
            </div>

            <div className="risk-reduction-footer">
              <span>Estimated Risk Reduction:</span>
              <div className="reduction-score-flow">
                <span className="text-danger font-bold">91%</span>
                <span>→</span>
                <span className="text-normal font-bold">28%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Supporting Fleet Table (All 25 Assets) */}
      <div className="card supporting-fleet-card">
        <div className="fleet-table-header">
          <div>
            <h3 className="card-title-v2">Supporting Grid Fleet (Simulated 25 Assets)</h3>
            <p className="card-subtitle-v2">Live telemetry stream across transmission, step-down substations, and distribution feeders.</p>
          </div>
          <div className="fleet-scale-legend">
            <span className="scale-dot red">●</span> <span>Critical (&gt;80%)</span>
            <span className="scale-dot orange ml-2">●</span> <span>High (60-80%)</span>
            <span className="scale-dot green ml-2">●</span> <span>Normal (&lt;60%)</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="v2-table">
            <thead>
              <tr>
                <th>ASSET NAME / TYPE</th>
                <th>SUBSTATION GRID NODE</th>
                <th>CORE TEMP</th>
                <th>VIBRATION</th>
                <th>OIL / INSUL. QUALITY</th>
                <th>LOAD %</th>
                <th>ML RISK INDEX</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.slice(0, 10).map((asset) => {
                const isSelected = asset.id === activeAsset.id;
                const isCrit = asset.overallRisk >= 81;
                const isHigh = asset.overallRisk >= 61 && asset.overallRisk < 81;
                return (
                  <tr 
                    key={asset.id} 
                    className={`v2-row-hover ${isSelected ? 'row-selected-fleet' : ''}`}
                    onClick={() => onSelectAsset(asset.id)}
                  >
                    <td>
                      <div className="asset-cell-flex">
                        <Zap size={14} className={isCrit ? 'text-danger' : 'text-primary'} />
                        <div>
                          <div className="asset-name-text">{asset.name}</div>
                          <div className="asset-sub-code">{asset.code}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium">{asset.substation}</span>
                    </td>
                    <td>
                      <span className={`temp-val font-semibold ${asset.temperature >= 85 ? 'text-danger' : ''}`}>
                        {asset.temperature}°C
                      </span>
                    </td>
                    <td>
                      <span className={`vib-val font-semibold ${asset.vibration >= 4.0 ? 'text-danger' : ''}`}>
                        {asset.vibration} mm/s
                      </span>
                    </td>
                    <td>
                      <span className={`oil-badge ${asset.oilQuality?.includes('POOR') ? 'poor' : asset.oilQuality?.includes('Fair') ? 'fair' : 'good'}`}>
                        {asset.oilQuality || 'Good (60 kV)'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-semibold">{asset.load}%</span>
                    </td>
                    <td>
                      <span className={`overall-risk-badge ${isCrit ? 'bg-crit' : isHigh ? 'bg-high' : 'bg-norm'}`}>
                        {isCrit ? 'Critical' : isHigh ? 'High' : 'Normal'} {asset.overallRisk}%
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn-fleet-action ${isSelected ? 'active-pane' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset.id);
                        }}
                      >
                        {isSelected ? 'Active Pane' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="fleet-table-footer">
          <span className="text-muted text-sm">
            Showing 10 of {assets.length} grid telemetry nodes (Batch IEEE-37 Seeded dataset)
          </span>
          <div className="footer-action-btns">
            <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              <FileSpreadsheet size={14} />
              <span>Export Telemetry CSV</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('risk')}>
              <Cpu size={14} />
              <span>ML Confusion Matrix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
