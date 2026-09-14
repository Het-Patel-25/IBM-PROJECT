import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Wrench, 
  Compass, 
  CheckCircle2, 
  RotateCcw, 
  Navigation, 
  ShieldAlert,
  Server,
  Database,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CREW_UNITS, ACTIONABLE_TICKETS } from '../../data/mockAssets';

export default function MaintenancePage({ onOpenArchitecture }) {
  const [crews, setCrews] = useState(CREW_UNITS);
  const [tickets, setTickets] = useState(ACTIONABLE_TICKETS);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const handleExecuteDispatch = () => {
    setDispatchedSuccess(true);
    // Update Alpha Team status to Dispatched
    setCrews((prev) => 
      prev.map((c) => c.id === 'crew-alpha' ? { ...c, status: 'Dispatched (En Route)' } : c)
    );
    setTickets((prev) => 
      prev.map((t) => t.priorityNum === 1 ? { ...t, status: 'Dispatched' } : t)
    );
    setTimeout(() => setDispatchedSuccess(false), 3000);
  };

  return (
    <div className="maintenance-v2-container">
      {/* 1. Top Header Banner */}
      <div className="academic-page-header">
        <div className="header-text-group">
          <div className="dispatch-active-pill">
            <span className="pulse-dot-red" />
            <span>CRITICAL DISPATCH PROTOCOL ACTIVE • IEEE 1366 Reliability Metrics Optimization</span>
          </div>
          <h2 className="header-v2-title">
            Integrated Maintenance Queue &amp; Crew Pre-Positioning Engine
          </h2>
          <p className="header-v2-sub">
            Predictive operational dispatch correlating dynamic Random Forest failure probabilities with geographic storm cell projections. Directing physical utility crews before high-wind landfall.
          </p>
        </div>

        <div className="header-actions-row">
          <div className="saidi-card">
            <span className="saidi-label">Estimated SAIDI Averted</span>
            <span className="saidi-val">43.2 min</span>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleExecuteDispatch}
          >
            <RotateCcw size={14} />
            <span>Re-Run Optimization</span>
          </button>
        </div>
      </div>

      {/* 2. Priority Decision Recommendation Alert Banner */}
      <div className="card priority-decision-banner">
        <div className="decision-left-icon">
          <AlertTriangle size={24} className="text-danger" />
        </div>
        <div className="decision-content">
          <div className="decision-tag-row">
            <span className="decision-tag-red">PRIORITY DECISION RECOMMENDATION #01</span>
            <span className="decision-wind-tag">Wind Front: 85 km/h, ETA: 42m</span>
          </div>
          <h3 className="decision-title">Pre-position Alpha Team closer to Pine Valley T-01</h3>
          <p className="decision-body">
            Pine Valley T-01 has a <strong>91% overall failure probability</strong> with localized 85 km/h gale exposure. Stage crew at Substation 42 perimeter now: response travel time drops from 55 mins to <strong>12 mins</strong> ahead of peak storm landfall, preventing feeder cascades across Zone 3.
          </p>
        </div>
        <div className="decision-buttons">
          <button 
            className={`btn ${dispatchedSuccess ? 'btn-success' : 'btn-primary'} btn-block`}
            onClick={handleExecuteDispatch}
          >
            {dispatchedSuccess ? '✓ Dispatched to Substation 42' : 'Execute Immediate Dispatch'}
          </button>
          <button className="btn btn-outline btn-block">
            View Ingress Route
          </button>
        </div>
      </div>

      {/* 3. Module 7: Spatial Operational Staging */}
      <div className="module-header-row">
        <span className="module-tag">MODULE 7 • SPATIAL OPERATIONAL STAGING</span>
        <h3 className="module-title">Regional Crew Depots &amp; Tactical Dispatch Coordinates</h3>
        <span className="module-subtag">Zero-GPS Static Telemetry Model (Predefined Hubs)</span>
      </div>

      <div className="spatial-staging-grid">
        {/* Left: Tactical Schematic Node Box */}
        <div className="card schematic-map-card">
          <div className="schematic-head">
            <div className="schematic-title-group">
              <Compass size={16} className="text-primary" />
              <span className="schematic-title">Regional Grid Sectors &amp; Static Depot Nodes</span>
            </div>
            <div className="schematic-legend">
              <span className="legend-item"><span className="dot red" /> Severe Risk Zone</span>
              <span className="legend-item"><span className="dot blue" /> Crew Staged</span>
            </div>
          </div>

          {/* Interactive Visual Schematic Node Box matching screenshot */}
          <div className="tactical-canvas-box">
            {/* North Grid Depot */}
            <div className="node-box north-depot">
              <span className="node-zone">North Sector • Zone A</span>
              <span className="node-name font-bold">North Grid Depot</span>
              <span className="node-crew-status text-blue">● Charlie Team • Standby</span>
            </div>

            {/* Coastal Depot */}
            <div className="node-box coastal-depot">
              <span className="node-zone">Coastal Sector • Zone D</span>
              <span className="node-name font-bold">Harbor Point Yard</span>
              <span className="node-crew-status text-orange">● T-03 Dielectric Check • Staged</span>
            </div>

            {/* Projected Frontal Gale Banner */}
            <div className="gale-vector-banner">
              <Navigation size={13} className="gale-arrow-icon" />
              <span>Projected Frontal Gale (85 km/h Vector: SW → NE)</span>
            </div>

            {/* Hotspot Box (Pine Valley Substation 42) */}
            <div className="node-box-hotspot">
              <div className="hotspot-head">
                <span className="hotspot-tag">Priority Hotspot 01</span>
                <span className="badge-crit-filled">91% Risk</span>
              </div>
              <h4 className="hotspot-title">Pine Valley Substation 42</h4>
              <span className="hotspot-sub">Asset T-01 Overheat + Lowlands</span>
              <div className="hotspot-crew-status">
                <span className="text-danger font-semibold">● Alpha Team Staging Now</span>
                <span className="text-orange font-semibold">● Delta Team En Route (Water Pumps)</span>
              </div>
            </div>

            {/* Westside Depot */}
            <div className="node-box westside-depot">
              <span className="node-zone">Forested Corridor • Zone C</span>
              <span className="node-name font-bold">Westside Yard</span>
              <span className="node-crew-status text-green">● Bravo Team • Ready</span>
            </div>
          </div>

          {/* 4 Metric Pills below schematic */}
          <div className="four-pills-row">
            <div className="coord-pill">
              <span className="coord-label">Weather Ingress</span>
              <strong className="coord-val">SW Sector 240°</strong>
            </div>
            <div className="coord-pill">
              <span className="coord-label">Staged Crew Units</span>
              <strong className="coord-val text-primary">4 Teams Ready</strong>
            </div>
            <div className="coord-pill">
              <span className="coord-label">Pre-position Advantage</span>
              <strong className="coord-val text-normal">-43 Min Response</strong>
            </div>
            <div className="coord-pill">
              <span className="coord-label">Static Geo Model</span>
              <strong className="coord-val">Haversine Depot DB</strong>
            </div>
          </div>
        </div>

        {/* Right: 4 Crew Staging Cards matching screenshot */}
        <div className="crew-cards-column">
          {crews.map((crew) => (
            <div key={crew.id} className="card crew-unit-card">
              <div className="crew-card-top">
                <div className="crew-name-row">
                  <div className="crew-avatar-icon">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="crew-title-badge-row">
                      <span className="crew-name font-bold">{crew.name}</span>
                      <span className={`crew-status-badge ${crew.badgeColor}`}>
                        {crew.status}
                      </span>
                    </div>
                    <span className="crew-specialty text-xs text-muted">{crew.specialty}</span>
                  </div>
                </div>
                <span className="crew-tech-count-badge">{crew.techCount} Techs</span>
              </div>

              <div className="crew-depot-target-row">
                <div>
                  <span className="label-dim">Current Depot</span>
                  <div className="font-semibold text-sm">{crew.currentDepot}</div>
                </div>
                <ArrowRight size={14} className="text-muted" />
                <div>
                  <span className="label-dim">Target Destination</span>
                  <div className="font-semibold text-sm text-primary">{crew.targetDestination}</div>
                </div>
              </div>

              <div className="crew-card-footer">
                <div className="crew-meta-item">
                  <Clock size={12} className="text-muted" />
                  <span>Travel: <strong>{crew.travelTime}</strong></span>
                </div>
                <div className="crew-meta-item">
                  <Wrench size={12} className="text-muted" />
                  <span>Payload: <strong>{crew.payload}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Module 6: Algorithmic Preventive Action Tickets */}
      <div className="module-header-row mt-6">
        <div className="module-title-left">
          <span className="module-tag">MODULE 6 • ALGORITHMIC PREVENTIVE ACTION</span>
          <h3 className="module-title">Actionable Maintenance Tickets (Prioritized Queue)</h3>
        </div>
        <div className="module-actions-right">
          <span className="badge-sort">Sorted by: Predictive Risk Hierarchy (DESC)</span>
          <button className="btn btn-secondary btn-xs">
            <Filter size={13} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="card prioritized-tickets-card">
        <div className="table-responsive">
          <table className="v2-table maintenance-queue-table">
            <thead>
              <tr>
                <th>PRIORITY</th>
                <th>ASSET NAME &amp; ID</th>
                <th>RISK SCORE</th>
                <th>PROBLEM DIAGNOSIS</th>
                <th>RECOMMENDED ACTIONS</th>
                <th>ASSIGNED CREW</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.priorityNum} className="v2-row-hover">
                  <td>
                    <div className={`priority-circle-num ${ticket.priorityColor}`}>
                      {ticket.priorityNum}
                    </div>
                  </td>
                  <td>
                    <div className="ticket-asset-cell">
                      <span className="font-bold text-dark">{ticket.assetName}</span>
                      <span className="text-xs text-muted">{ticket.assetSub}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ticket-risk-cell">
                      <span className={`risk-pct-text ${ticket.riskCategory === 'Critical' ? 'text-danger font-bold' : 'text-orange font-bold'}`}>
                        {ticket.riskScore}
                      </span>
                      <span className={`status-badge-v2 ${ticket.priorityColor}`}>
                        {ticket.riskCategory}
                      </span>
                      <span className="text-xs text-muted">{ticket.riskSub}</span>
                    </div>
                  </td>
                  <td className="problem-cell-wide">
                    <ul className="problem-lines-list">
                      {ticket.problemLines.map((line, lIdx) => (
                        <li key={lIdx} className="problem-bullet">
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="actions-cell-wide">
                    <ol className="actions-numbered-list">
                      {ticket.recommendedActions.map((act, aIdx) => (
                        <li key={aIdx} className="action-bullet">
                          <span>{act}</span>
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td>
                    <div className="assigned-crew-cell">
                      <span className="font-bold text-dark">{ticket.assignedCrew}</span>
                      <span className="text-xs text-muted">{ticket.assignedCrewDetails}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`ticket-status-pill ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                      ● {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Academic Viva Reference Footer matching screenshot */}
      <div className="card academic-reference-footer">
        <div className="ref-header-row">
          <div className="ref-title-group">
            <Server size={18} className="text-primary" />
            <span className="ref-title font-bold">Academic Viva Architecture &amp; Implementation Reference</span>
          </div>
          <span className="ref-capstone-tag">
            B.Tech / Electrical Engineering Capstone • Fast REST / Mongoose Data Layer
          </span>
        </div>

        <div className="ref-grid-two">
          {/* RESTful simulation endpoints */}
          <div className="ref-card-col">
            <span className="ref-col-label">RESTFUL SIMULATION ENDPOINTS</span>
            <div className="ref-endpoint-rows">
              <div className="ref-ep-item">
                <span className="method-pill get">GET</span>
                <code>/api/assets</code>
                <span>25 Telemetry Nodes + Load</span>
              </div>
              <div className="ref-ep-item">
                <span className="method-pill get">GET</span>
                <code>/api/weather</code>
                <span>NOAA GFS Wind &amp; Rain Ingress</span>
              </div>
              <div className="ref-ep-item">
                <span className="method-pill get">GET</span>
                <code>/api/predictions</code>
                <span>Random Forest Failure Probability</span>
              </div>
              <div className="ref-ep-item">
                <span className="method-pill post">POST</span>
                <code>/api/crews/assign</code>
                <span>{`{crewId, targetSubstationId}`}</span>
              </div>
              <div className="ref-ep-item">
                <span className="method-pill get">GET</span>
                <code>/api/maintenance</code>
                <span>Prioritized Queue with DGA Triggers</span>
              </div>
            </div>
          </div>

          {/* Mongoose schema declarations */}
          <div className="ref-card-col">
            <span className="ref-col-label">MONGODB NOSQL SCHEMA DECLARATIONS</span>
            <div className="ref-schemas-grid">
              <div className="ref-schema-item">
                <span className="schema-dot red">●</span> <strong>assets</strong>
                <p className="schema-fields">asset_id, name, type, temp_c, vib_mm, oil_dga_ppm, rated_mva</p>
              </div>
              <div className="ref-schema-item">
                <span className="schema-dot orange">●</span> <strong>weather</strong>
                <p className="schema-fields">sector_id, wind_speed_kmh, precip_mm, lightning_hits, eta_front</p>
              </div>
              <div className="ref-schema-item">
                <span className="schema-dot yellow">●</span> <strong>incidents</strong>
                <p className="schema-fields">incident_id, asset_ref, predicted_risk, root_cause, severity</p>
              </div>
              <div className="ref-schema-item">
                <span className="schema-dot blue">●</span> <strong>maintenance</strong>
                <p className="schema-fields">ticket_id, priority_rank, checklist_steps, status, assigned_crew</p>
              </div>
              <div className="ref-schema-item">
                <span className="schema-dot green">●</span> <strong>crews</strong>
                <p className="schema-fields">crew_id, name, specialization, depot_location, staged_target, tech_count</p>
              </div>
            </div>
          </div>
        </div>

        <div className="viva-defense-footer-note">
          <span className="font-bold text-primary">🛡️ Viva Defense Tip:</span> Emphasize the Haversine distance matrix between predefined depots and line assets to defend the lack of active GPS hardware. Stack: Tailwind CSS + FastAPI / Express + Scikit-Learn RF + MongoDB 7.0
        </div>
      </div>
    </div>
  );
}
