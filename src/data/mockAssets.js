// GridPulse AI - Comprehensive Fleet Telemetry & Academic Viva Dataset
// Configured to match the IEEE 37-Node Test Feeder Benchmark & Screenshots

export const STRATEGIC_ASSETS = [
  {
    id: 'pv-tx-001',
    rank: 1,
    name: 'Pine Valley T-01',
    code: 'SN-8829-TR • 138kV',
    type: 'Power Transformer',
    category: 'Transformer',
    area: 'Pine Valley',
    substation: 'Pine Valley Substation Yard 3',
    voltage: '138kV / 13.8kV Step-down',
    temperature: 112, // °C (Breached limit: 95°C)
    tempLimit: 95,
    vibration: 6.2, // mm/s (Breached limit: 4.5 mm/s)
    vibLimit: 4.5,
    oilQuality: 'POOR',
    oilBdv: '24 kV',
    load: 88, // % (45 MVA cap)
    capacityMVA: 45,
    age: 15,
    priorFaults: 2,
    failureRisk: 92, // %
    gridImpact: 95, // %
    overallRisk: 91, // %
    status: 'Critical',
    priority: 'Critical #1',
    equipmentRisk: 92,
    weatherRisk: 85,
    historicalRisk: 80,
    temperatureHistory: [74, 77, 82, 98, 112],
    aiAnalysis: {
      failureProbability: 92,
      weightedRisk: 91,
      possibleProblem: 'Transformer Overheating & Dielectric Thermal Breakdown',
      reasons: [
        'Winding Hotspot (112°C breaches thermal limit by +22°C)',
        'Mechanical Vibration Spike (6.2 mm/s harmonic resonance)',
        'Chemical Oil BDV Breakdown (24 kV) & Dissolved Arcing Gas (C2H2)',
        'Severe Weather Proximity (85 km/h gale force wind gusts)'
      ],
      recommendedAction: [
        'Inspect & Force Cooling Pump (engage auxiliary fans & check radiator fins)',
        'Perform Vacuum Oil Degassing (extract combustible gas bubbles)',
        'Reroute Feeder Load by 25% to Westside Feeder-02',
        'Pre-position Alpha Crew with thermal imaging camera to Substation 42'
      ]
    }
  },
  {
    id: 'sub-pv-002',
    rank: 2,
    name: 'Substation S-02',
    code: 'SUB-2200-PV • 69kV Hub',
    type: 'Distribution Substation',
    category: 'Substation',
    area: 'Pine Valley',
    substation: 'Pine Valley Basin Switchyard',
    voltage: '69kV Hub',
    temperature: 88,
    tempLimit: 85,
    vibration: 3.8,
    vibLimit: 4.0,
    oilQuality: 'Fair',
    oilBdv: '42 kV',
    load: 84,
    capacityMVA: 60,
    age: 18,
    priorFaults: 1,
    failureRisk: 84,
    gridImpact: 90,
    overallRisk: 84,
    status: 'Critical',
    priority: 'Critical #2',
    equipmentRisk: 84,
    weatherRisk: 85,
    historicalRisk: 75,
    temperatureHistory: [68, 72, 76, 82, 88],
    aiAnalysis: {
      failureProbability: 84,
      weightedRisk: 84,
      possibleProblem: 'Surface Inundation & Breaker Coil Resistance Drift',
      reasons: [
        'Storm surge risk in Pine Valley hydrological basin',
        'Feeder load reaching 84% capacity during gale front',
        'Breaker relay coil experiencing elevated resistance'
      ],
      recommendedAction: [
        'Deploy Delta Team with high-volume diesel water evacuation pump',
        'Prepare Bus Tie-2 transfer protocol',
        'Inspect high-voltage busbar insulator flashover gaps'
      ]
    }
  },
  {
    id: 'fdr-ws-001',
    rank: 3,
    name: 'Westside F-01',
    code: 'FDR-01-WS • Overhead',
    type: '230kV Feeder',
    category: 'Feeder',
    area: 'Westside',
    substation: 'Westside Industrial Corridor',
    voltage: '230kV Overhead Span',
    temperature: 72,
    tempLimit: 80,
    vibration: 4.8,
    vibLimit: 3.5,
    oilQuality: 'Normal (Dry-type)',
    oilBdv: 'N/A',
    load: 78,
    capacityMVA: 35,
    age: 9,
    priorFaults: 1,
    failureRisk: 70,
    gridImpact: 70,
    overallRisk: 66,
    status: 'High',
    priority: 'High #3',
    equipmentRisk: 70,
    weatherRisk: 55,
    historicalRisk: 65,
    temperatureHistory: [60, 62, 65, 69, 72],
    aiAnalysis: {
      failureProbability: 70,
      weightedRisk: 66,
      possibleProblem: 'Aero-elastic Flutter & Galloping Conductor',
      reasons: [
        'Increased harmonic vibration anomaly (4.8 mm/s)',
        'Sustained 50 km/h wind gusts inducing line gallop',
        'Vegetation clearance corridor below 1.8m threshold'
      ],
      recommendedAction: [
        'Dispatch Bravo Team to trim overhanging pine branches',
        'Inspect Stockbridge vibration dampers on towers 14-22',
        'Verify conductor sag tension measurements'
      ]
    }
  },
  {
    id: 'hp-tx-003',
    rank: 4,
    name: 'Harbor Point T-03',
    code: 'SN-4102-TR • Coastal',
    type: 'Substation Transformer',
    category: 'Transformer',
    area: 'Harbor Point',
    substation: 'Harbor Point Marine Terminal',
    voltage: '115kV / 13.8kV',
    temperature: 94,
    tempLimit: 85,
    vibration: 3.2,
    vibLimit: 4.0,
    oilQuality: 'Degraded',
    oilBdv: '32 kV',
    load: 75,
    capacityMVA: 40,
    age: 21,
    priorFaults: 3,
    failureRisk: 65,
    gridImpact: 60,
    overallRisk: 63,
    status: 'High',
    priority: 'High #4',
    equipmentRisk: 68,
    weatherRisk: 50,
    historicalRisk: 80,
    temperatureHistory: [75, 78, 82, 89, 94],
    aiAnalysis: {
      failureProbability: 65,
      weightedRisk: 63,
      possibleProblem: 'Dielectric Breakdown & Salt Moisture Ingress',
      reasons: [
        'Moisture in oil dielectric exceeds 28 ppm threshold',
        'Bushing power factor marginal in marine salt environment',
        'Calendar preventative inspection overdue by 12 days'
      ],
      recommendedAction: [
        'Schedule routine vacuum degas & dielectric reclamation during off-peak window',
        'Replace silica gel breather assembly',
        'Test tan-delta capacitance on high-voltage bushings'
      ]
    }
  },
  {
    id: 'er-fdr-004',
    rank: 5,
    name: 'East River F-04',
    code: 'FDR-04-ER • Underground',
    type: 'Feeder Line',
    category: 'Feeder',
    area: 'East River',
    substation: 'East River Crossing Vault',
    voltage: '69kV Subterranean',
    temperature: 60,
    tempLimit: 75,
    vibration: 1.2,
    vibLimit: 3.0,
    oilQuality: 'Good',
    oilBdv: '58 kV',
    load: 44,
    capacityMVA: 30,
    age: 7,
    priorFaults: 0,
    failureRisk: 48,
    gridImpact: 40,
    overallRisk: 44,
    status: 'Warning',
    priority: 'Warning #5',
    equipmentRisk: 48,
    weatherRisk: 30,
    historicalRisk: 55,
    temperatureHistory: [55, 56, 58, 59, 60],
    aiAnalysis: {
      failureProbability: 48,
      weightedRisk: 44,
      possibleProblem: 'Moderate Subterranean Vault Thermal Drift',
      reasons: [
        'Conduit ambient heat rise due to adjacent steam main',
        'Nominal 44% feeder loading',
        'Vibration and harmonics within safe baseline'
      ],
      recommendedAction: [
        'Inspect vault forced ventilation fan',
        'No emergency dispatch required'
      ]
    }
  },
  {
    id: 'ng-sub-001',
    rank: 6,
    name: 'North Grid Sub-01',
    code: 'SS-NG-01 • Metro Hub',
    type: 'Distribution Substation',
    category: 'Substation',
    area: 'North Grid',
    substation: 'North Grid Metro Center',
    voltage: '138kV / 24kV',
    temperature: 65,
    tempLimit: 85,
    vibration: 1.8,
    vibLimit: 4.0,
    oilQuality: 'Good (62 kV)',
    oilBdv: '62 kV',
    load: 52,
    capacityMVA: 80,
    age: 6,
    priorFaults: 0,
    failureRisk: 32,
    gridImpact: 40,
    overallRisk: 29,
    status: 'Normal',
    priority: 'Normal',
    equipmentRisk: 32,
    weatherRisk: 20,
    historicalRisk: 20,
    temperatureHistory: [62, 63, 64, 65, 65],
    aiAnalysis: {
      failureProbability: 32,
      weightedRisk: 29,
      possibleProblem: 'Healthy Operational State',
      reasons: ['All parameters well below critical safety bounds'],
      recommendedAction: ['Maintain standard SCADA automated polling']
    }
  },
  {
    id: 'ch-tx-002',
    rank: 7,
    name: 'Cedar Hill T-02',
    code: 'CH-TX-002 • Sub-transmission',
    type: 'Power Transformer',
    category: 'Transformer',
    area: 'Cedar Hill',
    substation: 'Cedar Hill Substation',
    voltage: '69kV / 13.8kV',
    temperature: 68,
    tempLimit: 85,
    vibration: 2.1,
    vibLimit: 4.0,
    oilQuality: 'Good (58 kV)',
    oilBdv: '58 kV',
    load: 61,
    capacityMVA: 30,
    age: 11,
    priorFaults: 1,
    failureRisk: 35,
    gridImpact: 45,
    overallRisk: 39,
    status: 'Normal',
    priority: 'Normal',
    equipmentRisk: 35,
    weatherRisk: 25,
    historicalRisk: 30,
    temperatureHistory: [64, 65, 66, 67, 68]
  },
  {
    id: 'ss-sub-004',
    rank: 8,
    name: 'Southside Sub-04',
    code: 'SS-08-04 • Commercial',
    type: 'Distribution Substation',
    category: 'Substation',
    area: 'Southside',
    substation: 'Southside Commercial Zone',
    voltage: '69kV Hub',
    temperature: 74,
    tempLimit: 85,
    vibration: 2.9,
    vibLimit: 4.0,
    oilQuality: 'Fair (46 kV)',
    oilBdv: '46 kV',
    load: 69,
    capacityMVA: 50,
    age: 14,
    priorFaults: 2,
    failureRisk: 54,
    gridImpact: 60,
    overallRisk: 54,
    status: 'Warning',
    priority: 'Warning',
    equipmentRisk: 54,
    weatherRisk: 40,
    historicalRisk: 50,
    temperatureHistory: [68, 70, 71, 73, 74]
  },
  {
    id: 'or-fdr-004',
    rank: 9,
    name: 'Oakridge F-04',
    code: 'FDR-OR-04 • Residential',
    type: 'Feeder Line',
    category: 'Feeder',
    area: 'Oakridge',
    substation: 'Oakridge Residential North',
    voltage: '13.8kV Feeder',
    temperature: 54,
    tempLimit: 75,
    vibration: 1.1,
    vibLimit: 3.0,
    oilQuality: 'Good',
    oilBdv: 'N/A',
    load: 38,
    capacityMVA: 20,
    age: 5,
    priorFaults: 0,
    failureRisk: 14,
    gridImpact: 20,
    overallRisk: 14,
    status: 'Normal',
    priority: 'Normal',
    equipmentRisk: 14,
    weatherRisk: 15,
    historicalRisk: 10,
    temperatureHistory: [50, 51, 52, 53, 54]
  },
  {
    id: 'vr-tx-005',
    rank: 10,
    name: 'Valley Ridge T-05',
    code: 'VR-TX-005 • Step-down',
    type: 'Power Transformer',
    category: 'Transformer',
    area: 'Valley Ridge',
    substation: 'Valley Ridge Hills',
    voltage: '115kV / 24kV',
    temperature: 62,
    tempLimit: 85,
    vibration: 1.5,
    vibLimit: 4.0,
    oilQuality: 'Good (64 kV)',
    oilBdv: '64 kV',
    load: 49,
    capacityMVA: 45,
    age: 8,
    priorFaults: 0,
    failureRisk: 19,
    gridImpact: 35,
    overallRisk: 19,
    status: 'Normal',
    priority: 'Normal',
    equipmentRisk: 19,
    weatherRisk: 20,
    historicalRisk: 15,
    temperatureHistory: [59, 60, 61, 61, 62]
  }
];

// Add 15 additional simulated grid fleet nodes to fulfill the 25 total assets shown on dashboard
for (let i = 11; i <= 25; i++) {
  const isXfmr = i % 2 === 0;
  STRATEGIC_ASSETS.push({
    id: `grid-asset-${i}`,
    rank: i,
    name: isXfmr ? `Regional XFMR T-${i}` : `Distribution Feeder F-${i}`,
    code: `NODE-${1000 + i}-IEEE`,
    type: isXfmr ? 'Power Transformer' : 'Feeder Line',
    category: isXfmr ? 'Transformer' : 'Feeder',
    area: i > 20 ? 'North Grid' : i > 15 ? 'East Metro' : 'Westside Hub',
    substation: `Grid Sector Sub-${i}`,
    voltage: isXfmr ? '138kV / 13.8kV' : '34.5kV Line',
    temperature: 50 + (i % 22),
    tempLimit: 85,
    vibration: 1.0 + ((i % 15) * 0.12),
    vibLimit: 4.0,
    oilQuality: 'Good (60 kV)',
    oilBdv: '60 kV',
    load: 35 + (i % 30),
    capacityMVA: 25 + (i % 20),
    age: 4 + (i % 12),
    priorFaults: i % 3 === 0 ? 1 : 0,
    failureRisk: 15 + (i % 25),
    gridImpact: 20 + (i % 30),
    overallRisk: 16 + (i % 24),
    status: (16 + (i % 24)) > 40 ? 'Warning' : 'Normal',
    priority: 'Normal',
    equipmentRisk: 20,
    weatherRisk: 15,
    historicalRisk: 15,
    temperatureHistory: [50, 52, 53, 55, 50 + (i % 22)]
  });
}

// Weather Corridors matching Image 1
export const WEATHER_SECTORS = [
  {
    name: 'Pine Valley Sector',
    threat: '88% Storm Threat',
    badgeClass: 'critical',
    wind: '85 km/h',
    precip: 'Heavy (42mm)',
    lightning: 'High Index'
  },
  {
    name: 'Westside Sector',
    threat: '55% Storm Threat',
    badgeClass: 'warning',
    wind: '50 km/h',
    precip: 'Moderate',
    lightning: 'Medium'
  },
  {
    name: 'North Grid Sector',
    threat: '20% Threat (Normal)',
    badgeClass: 'normal',
    wind: '20 km/h',
    precip: 'Light',
    lightning: 'Low / Nil'
  }
];

// Recent Alerts matching Image 1
export const LIVE_ALERTS = [
  {
    id: 'alert-1',
    tag: 'CRITICAL ANOMALY',
    severity: 'Critical',
    time: '3 mins ago',
    assetId: 'pv-tx-001',
    assetName: 'Pine Valley T-01',
    message: 'Severe failure risk (92%). Temp 112°C, Vibration 6.2 mm/s, Poor Oil Quality under 85 km/h storm.',
    cta: 'Investigate Diagnostics →'
  },
  {
    id: 'alert-2',
    tag: 'CRITICAL BUS WARNING',
    severity: 'Critical',
    time: '14 mins ago',
    assetId: 'sub-pv-002',
    assetName: 'Substation S-02',
    message: 'Storm surge risk in Pine Valley basin. Feeder load reaching 84% capacity during gale front.',
    cta: 'View Bus Telemetry →'
  },
  {
    id: 'alert-3',
    tag: 'MECHANICAL OSCILLATION',
    severity: 'Warning',
    time: '32 mins ago',
    assetId: 'fdr-ws-001',
    assetName: 'Westside Feeder F-01',
    message: 'Increased harmonic vibration anomaly (4.8 mm/s) coupled with sustained 50 km/h wind gusts.',
    cta: 'Check Damper Specs →'
  },
  {
    id: 'alert-4',
    tag: 'DIELECTRIC BREAKDOWN',
    severity: 'Warning',
    time: '1 hr ago',
    assetId: 'hp-tx-003',
    assetName: 'Harbor Point T-03',
    message: 'Moisture sensor trigger indicates oil dielectric degradation. Calendar inspection overdue by 12 days.',
    cta: 'Schedule Degas →'
  }
];

// Tactical Crews & Depots matching Image 4
export const CREW_UNITS = [
  {
    id: 'crew-alpha',
    name: 'Alpha Team',
    status: 'Pre-positioning',
    techCount: 5,
    specialty: 'Heavy Transformer & Substation Specialists',
    currentDepot: 'Pine Valley Yard',
    targetDestination: 'Substation 42 (T-01)',
    travelTime: '12 mins (Down from 55m)',
    payload: 'Cooling Radiator Spares',
    badgeColor: 'red'
  },
  {
    id: 'crew-bravo',
    name: 'Bravo Team',
    status: 'Available / Staged',
    techCount: 4,
    specialty: 'Transmission Lines & Arborist Strike Unit',
    currentDepot: 'Westside Yard',
    targetDestination: 'Westside Corridor 501',
    travelTime: '18 mins',
    payload: 'Hydraulic Boom & Dampers',
    badgeColor: 'green'
  },
  {
    id: 'crew-delta',
    name: 'Delta Team',
    status: 'En Route (14 min)',
    techCount: 6,
    specialty: 'Emergency Auxiliary & High-Volume Flood Pumps',
    currentDepot: 'Central Logistics Yard',
    targetDestination: 'Pine Valley Lowlands (S-02)',
    travelTime: 'Transit via Route 9 West',
    payload: '2x 5000GPM De-Water Pumps',
    badgeColor: 'orange'
  },
  {
    id: 'crew-charlie',
    name: 'Charlie Team',
    status: 'Standby (Reserve)',
    techCount: 3,
    specialty: 'General Electrical & Relay Protection Techs',
    currentDepot: 'North Grid Depot',
    targetDestination: 'North Grid Substation',
    travelTime: 'Ready for Shift Rotation',
    payload: 'Diagnostic Testing Kit',
    badgeColor: 'blue'
  }
];

// Prioritized Actionable Work Orders matching Image 4
export const ACTIONABLE_TICKETS = [
  {
    priorityNum: 1,
    priorityTag: 'Critical #1',
    priorityColor: 'critical',
    assetName: 'Pine Valley T-01',
    assetSub: 'Substation 42 • 230/115kV',
    riskScore: '91%',
    riskCategory: 'Critical',
    riskSub: 'Failure Prob: RF v2.4',
    problemLines: [
      'Overheating: 112°C (Limit: 95°C)',
      'Severe Vibration: 6.2 mm/s',
      'DGA: High Dissolved Acetylene (Poor Oil)'
    ],
    recommendedActions: [
      '1. Inspect forced cooling pumps',
      '2. Check dielectric breakdown & degas oil',
      '3. Reduce bus load by 25% immediately'
    ],
    assignedCrew: 'Alpha Team',
    assignedCrewDetails: '5 Tk, 12m (Pre-staged)',
    status: 'Pre-dispatch'
  },
  {
    priorityNum: 2,
    priorityTag: 'Critical #2',
    priorityColor: 'critical',
    assetName: 'Substation S-02',
    assetSub: 'Pine Valley Basin Switchyard',
    riskScore: '84%',
    riskCategory: 'Critical',
    riskSub: 'Hydrological Surpass',
    problemLines: [
      'Surface inundation depth +18cm',
      'Breaker relay coil high resistance'
    ],
    recommendedActions: [
      '1. Deploy diesel water evacuation pump',
      '2. Prepare Bus Tie-2 transfer protocol'
    ],
    assignedCrew: 'Delta Team',
    assignedCrewDetails: '6 Tk, 14 mins',
    status: 'Dispatched'
  },
  {
    priorityNum: 3,
    priorityTag: 'High #3',
    priorityColor: 'high',
    assetName: 'Westside Feeder F-01',
    assetSub: 'Span Towers 14-22 (230kV)',
    riskScore: '66%',
    riskCategory: 'High',
    riskSub: 'Aero-elastic Flutter',
    problemLines: [
      'Galloping conductor detected',
      'Vegetation clearance <1.8m'
    ],
    recommendedActions: [
      '1. Trim overhanging pine branches',
      '2. Inspect Stockbridge vibration dampers'
    ],
    assignedCrew: 'Bravo Team',
    assignedCrewDetails: 'Stationed at Depot',
    status: 'Standby'
  },
  {
    priorityNum: 4,
    priorityTag: 'High #4',
    priorityColor: 'high',
    assetName: 'Harbor Point T-03',
    assetSub: 'Coastal Step-Down Substation',
    riskScore: '63%',
    riskCategory: 'High',
    riskSub: 'Slow Thermal Drift',
    problemLines: [
      'Moisture in oil dielectric >28 ppm',
      'Bushing power factor marginal'
    ],
    recommendedActions: [
      'Schedule routine vacuum degas & dielectric reclamation during off-peak window.'
    ],
    assignedCrew: 'Charlie Team',
    assignedCrewDetails: 'Scheduled Next Shift',
    status: 'Scheduled'
  }
];

export const INITIAL_ASSETS = STRATEGIC_ASSETS;
export const INITIAL_MAINTENANCE = ACTIONABLE_TICKETS;
export const RECENT_ALERTS = LIVE_ALERTS;

// Helper to determine risk level badge and color
export function getRiskLevel(score) {
  if (score >= 81) return { level: 'Critical', color: 'red', bg: '#fee2e2', text: '#991b1b', border: '#f87171' };
  if (score >= 61) return { level: 'High', color: 'orange', bg: '#ffedd5', text: '#9a3412', border: '#fb923c' };
  if (score >= 41) return { level: 'Warning', color: 'yellow', bg: '#fef9c3', text: '#854d0e', border: '#facc15' };
  return { level: 'Normal', color: 'green', bg: '#dcfce7', text: '#166534', border: '#4ade80' };
}
