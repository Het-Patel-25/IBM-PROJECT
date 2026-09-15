// VoltGuard - Comprehensive Fleet Telemetry & Academic Enterprise Dataset

export const STRATEGIC_ASSETS = [
  {
    id: 'tx-104',
    rank: 1,
    name: 'Transformer T-104',
    code: 'SN-8829-TR • 138kV',
    type: 'Power Transformer',
    category: 'Transformer',
    area: 'Pine Valley (Zone 4)',
    substation: 'Pine Valley Substation Yard 3',
    voltage: '138kV / 13.8kV Step-down',
    temperature: 112, 
    tempLimit: 95,
    vibration: 6.2, 
    vibLimit: 4.5,
    oilQuality: 'POOR',
    oilBdv: '24 kV',
    load: 88,
    capacityMVA: 45,
    age: 15,
    priorFaults: 2,
    failureRisk: 82, // %
    customersAffected: 82400,
    criticalFacilities: 6,
    gridImpactScore: 96, // %
    overallRisk: 87, // % (Combined Risk)
    status: 'Critical',
    priority: 'Critical #1',
    weatherExposure: 'Severe Storm Warning (85 km/h wind)',
    riskContributors: {
      partialDischarge: 32,
      oilTemp: 27,
      weather: 19,
      vibration: 14,
      history: 8
    },
    aiAnalysis: {
      failureProbability: 82,
      weightedRisk: 87,
      possibleProblem: 'High failure probability due to abnormal oil temperature combined with increasing partial discharge activity. Severe weather forecast in the next 48 hours increases expected failure risk.',
      recommendedAction: [
        'Inspect cooling system',
        'Perform oil quality test',
        'Inspect partial discharge',
        'Prepare replacement components'
      ]
    }
  },
  {
    id: 'sub-s022',
    rank: 2,
    name: 'Substation S-022',
    code: 'SUB-2200-PV • 69kV Hub',
    type: 'Distribution Substation',
    category: 'Substation',
    area: 'Pine Valley Basin',
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
    failureRisk: 74,
    customersAffected: 54000,
    criticalFacilities: 2,
    gridImpactScore: 91,
    overallRisk: 84,
    status: 'Critical',
    priority: 'Critical #2',
    weatherExposure: 'Severe Storm Warning (Heavy Rain)',
    riskContributors: {
      weather: 40,
      partialDischarge: 25,
      oilTemp: 15,
      vibration: 10,
      history: 10
    }
  },
  {
    id: 'tx-087',
    rank: 3,
    name: 'Transformer T-087',
    code: 'FDR-01-WS • Overhead',
    type: 'Power Transformer',
    category: 'Transformer',
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
    failureRisk: 89,
    customersAffected: 12000, // High fail risk, but lower impact
    criticalFacilities: 0,
    gridImpactScore: 67,
    overallRisk: 79,
    status: 'High',
    priority: 'High #3',
    weatherExposure: 'Moderate (50 km/h wind)',
    riskContributors: {
      vibration: 45,
      history: 25,
      weather: 15,
      oilTemp: 10,
      partialDischarge: 5
    }
  },
  {
    id: 'tx-031',
    rank: 4,
    name: 'Transformer T-031',
    code: 'SN-4102-TR • Coastal',
    type: 'Power Transformer',
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
    failureRisk: 61,
    customersAffected: 8500,
    criticalFacilities: 1,
    gridImpactScore: 54,
    overallRisk: 58,
    status: 'Warning',
    priority: 'Medium #4',
    weatherExposure: 'Clear',
    riskContributors: {
      oilTemp: 35,
      history: 30,
      partialDischarge: 20,
      vibration: 10,
      weather: 5
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
    failureRisk: 22,
    customersAffected: 3200,
    criticalFacilities: 0,
    gridImpactScore: 18,
    overallRisk: 20,
    status: 'Normal',
    priority: 'Normal #5',
    weatherExposure: 'Clear',
    riskContributors: {
      oilTemp: 40,
      history: 20,
      partialDischarge: 20,
      vibration: 10,
      weather: 10
    }
  }
];

export const WEATHER_SECTORS = [
  {
    name: 'Zone 4 (Pine Valley)',
    threat: 'SEVERE STORM EVENT #204',
    badgeClass: 'critical',
    wind: '85 km/h',
    precip: 'Heavy (42mm)',
    eta: '12 hours'
  },
  {
    name: 'Zone 7 (Westside)',
    threat: 'HIGH WIND',
    badgeClass: 'warning',
    wind: '50 km/h',
    precip: 'Moderate',
    eta: '18 hours'
  }
];

export const LIVE_ALERTS = [
  {
    id: 'alert-1',
    tag: 'GRID RESPONSE EVENT',
    severity: 'Critical',
    time: '3 mins ago',
    assetId: 'tx-104',
    assetName: 'Transformer T-104',
    message: 'Storm Event #204 approaching Zone 4. T-104 Failure Risk at 82%. Impact Score 96.',
    cta: 'View Incident Command →'
  },
  {
    id: 'alert-2',
    tag: 'WEATHER ESCALATION',
    severity: 'Critical',
    time: '14 mins ago',
    assetId: 'sub-s022',
    assetName: 'Substation S-022',
    message: 'Weather-adjusted risk for S-022 increased by 16% due to projected heavy rain inundation.',
    cta: 'View Grid Impact →'
  }
];

export const CREW_UNITS = [
  {
    id: 'crew-alpha',
    name: 'Crew Alpha',
    status: 'Available',
    techCount: 5,
    specialty: 'Heavy Transformer & Substation Specialists',
    currentDepot: 'Central Yard',
    targetDestination: 'Substation 14',
    distance: '4.2 km',
    payload: 'Cooling Radiator Spares, Oil Testing Kit',
    badgeColor: 'red'
  },
  {
    id: 'crew-bravo',
    name: 'Crew Bravo',
    status: 'Staged',
    techCount: 4,
    specialty: 'Transmission Lines & Arborist Strike Unit',
    currentDepot: 'Westside Yard',
    targetDestination: 'Zone 4 Perimeter',
    distance: '7.8 km',
    payload: 'Hydraulic Boom & Emergency Repair Kit',
    badgeColor: 'green'
  }
];

export const ACTIONABLE_TICKETS = [
  {
    id: 'task-001',
    priorityNum: 1,
    priorityTag: 'Critical #1',
    priorityColor: 'critical',
    assetName: 'Transformer T-104',
    assetSub: 'Substation 14 • Zone 4',
    riskScore: '87/100',
    riskCategory: 'Critical',
    riskSub: 'Failure Prob: 82%',
    deadline: '18 Sept 2026',
    recommendedActions: [
      { id: 'c1', text: 'Inspect cooling system', checked: false },
      { id: 'c2', text: 'Perform oil quality test', checked: false },
      { id: 'c3', text: 'Inspect partial discharge', checked: false },
      { id: 'c4', text: 'Prepare replacement components', checked: false }
    ],
    assignedCrew: 'Crew Alpha',
    assignedCrewDetails: '4.2 km away',
    status: 'Pre-dispatch'
  },
  {
    id: 'task-002',
    priorityNum: 2,
    priorityTag: 'Critical #2',
    priorityColor: 'critical',
    assetName: 'Substation S-022',
    assetSub: 'Pine Valley Basin Switchyard',
    riskScore: '84/100',
    riskCategory: 'Critical',
    riskSub: 'Weather Inundation',
    deadline: '18 Sept 2026',
    recommendedActions: [
      { id: 'c5', text: 'Deploy diesel water evacuation pump', checked: false },
      { id: 'c6', text: 'Prepare Bus Tie-2 transfer protocol', checked: false }
    ],
    assignedCrew: 'Crew Bravo',
    assignedCrewDetails: '7.8 km away',
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
