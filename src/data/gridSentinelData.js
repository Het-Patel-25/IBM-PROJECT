/**
 * GridSentinel — Unified Asset Intelligence Data Layer
 * Single source of truth for all modules
 */

// ─── ASSET TYPES ──────────────────────────────────────────────────────────────
export const ASSET_TYPES = [
  'Power Transformer', 'Distribution Transformer', 'Substation',
  'Circuit Breaker', 'Switchgear', 'Transmission Line', 'Generator', 'Feeder Line', 'Other'
];

export const CRITICALITY_LEVELS = ['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'];

export const CRITICAL_FACILITIES = [
  'Hospital', 'Emergency Services', 'Industrial Facility',
  'Water Treatment', 'Data Center', 'Residential Area', 'Commercial Area'
];

export const SENSOR_TYPES = [
  'Temperature', 'Vibration', 'Partial Discharge', 'Oil Quality',
  'Load', 'Voltage', 'Current', 'Humidity'
];

export const MAINTENANCE_STATUSES = [
  'Open', 'Assigned', 'In Progress', 'Completed', 'Failed', 'Requires Follow-Up', 'Cancelled'
];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
export function computeSensorStatus(sensor) {
  if (!sensor || sensor.currentValue === undefined) return 'Unknown';
  if (sensor.currentValue >= sensor.criticalThreshold) return 'Critical';
  if (sensor.currentValue >= sensor.warningThreshold) return 'Warning';
  return 'Normal';
}

export function computeAssetHealth(asset) {
  // Deterministic health formula based on sensor readings, maintenance, age
  let healthPenalty = 0;
  
  const sensors = asset.sensors || [];
  sensors.forEach(s => {
    const status = computeSensorStatus(s);
    if (status === 'Critical') healthPenalty += 18;
    else if (status === 'Warning') healthPenalty += 8;
  });

  // Age penalty
  healthPenalty += Math.min(25, (asset.age || 0) * 0.8);
  
  // Prior faults
  healthPenalty += Math.min(15, (asset.priorFaults || 0) * 4);

  // Recent maintenance bonus
  if (asset.lastMaintenanceDate) {
    const daysSince = Math.floor((Date.now() - new Date(asset.lastMaintenanceDate)) / 86400000);
    if (daysSince < 30) healthPenalty -= 5;
    else if (daysSince > 180) healthPenalty += 8;
  }

  return Math.max(10, Math.min(100, 100 - Math.round(healthPenalty)));
}

export function computeFailureProbability(asset) {
  let score = 10;
  const sensors = asset.sensors || [];

  sensors.forEach(s => {
    const status = computeSensorStatus(s);
    if (s.type === 'Temperature') {
      if (status === 'Critical') score += 28;
      else if (status === 'Warning') score += 14;
    } else if (s.type === 'Partial Discharge') {
      if (status === 'Critical') score += 32;
      else if (status === 'Warning') score += 16;
    } else if (s.type === 'Oil Quality') {
      if (status === 'Critical') score += 22;
      else if (status === 'Warning') score += 10;
    } else if (s.type === 'Vibration') {
      if (status === 'Critical') score += 18;
      else if (status === 'Warning') score += 9;
    } else if (s.type === 'Load') {
      if (status === 'Critical') score += 12;
      else if (status === 'Warning') score += 6;
    }
  });

  // Age factor
  score += Math.min(15, (asset.age || 0) * 0.5);
  // Prior faults
  score += Math.min(12, (asset.priorFaults || 0) * 3);
  // Weather
  if (asset.weatherExposure === 'Severe') score += 19;
  else if (asset.weatherExposure === 'Moderate') score += 8;

  return Math.max(5, Math.min(99, Math.round(score)));
}

export function computeGridImpact(asset, failureProbability) {
  const custFactor = Math.min(40, (asset.customersAffected || 0) / 2500);
  const critFactor = Math.min(25, (asset.criticalFacilities || 0) * 5);
  const capFactor = Math.min(20, (asset.capacityMVA || 0) / 5);
  const voltFactor = asset.voltage?.includes('230kV') ? 10 : asset.voltage?.includes('138kV') ? 7 : asset.voltage?.includes('69kV') ? 4 : 2;
  const probFactor = (failureProbability / 100) * 15;
  
  return Math.max(5, Math.min(100, Math.round(custFactor + critFactor + capFactor + voltFactor + probFactor)));
}

export function computeOverallRisk(failureProbability, gridImpact) {
  return Math.round(failureProbability * 0.6 + gridImpact * 0.4);
}

export function computeRiskContributors(asset) {
  const sensors = asset.sensors || [];
  let contributors = {};
  let total = 0;

  const tempSensor = sensors.find(s => s.type === 'Temperature');
  const pdSensor = sensors.find(s => s.type === 'Partial Discharge');
  const oilSensor = sensors.find(s => s.type === 'Oil Quality');
  const vibSensor = sensors.find(s => s.type === 'Vibration');

  if (pdSensor && computeSensorStatus(pdSensor) !== 'Normal') {
    contributors.partialDischarge = pdSensor.currentValue >= pdSensor.criticalThreshold ? 32 : 16;
    total += contributors.partialDischarge;
  }
  if (tempSensor && computeSensorStatus(tempSensor) !== 'Normal') {
    contributors.oilTemp = tempSensor.currentValue >= tempSensor.criticalThreshold ? 28 : 14;
    total += contributors.oilTemp;
  }
  if (asset.weatherExposure === 'Severe') {
    contributors.weather = 19;
    total += 19;
  } else if (asset.weatherExposure === 'Moderate') {
    contributors.weather = 8;
    total += 8;
  }
  if (vibSensor && computeSensorStatus(vibSensor) !== 'Normal') {
    contributors.vibration = 14;
    total += 14;
  }
  if ((asset.priorFaults || 0) > 0) {
    contributors.history = Math.min(15, (asset.priorFaults || 0) * 4);
    total += contributors.history;
  }

  if (total === 0) return { 'Normal Operation': 100 };
  return contributors;
}

export function getStatusFromRisk(overallRisk) {
  if (overallRisk >= 80) return 'Critical';
  if (overallRisk >= 60) return 'High';
  if (overallRisk >= 35) return 'Warning';
  return 'Normal';
}

export function getPriority(overallRisk) {
  if (overallRisk >= 80) return { label: 'P1 — CRITICAL', code: 'P1', action: 'Immediate action required' };
  if (overallRisk >= 60) return { label: 'P2 — HIGH', code: 'P2', action: 'Action within 24 hours' };
  if (overallRisk >= 35) return { label: 'P3 — MEDIUM', code: 'P3', action: 'Schedule maintenance' };
  return { label: 'P4 — LOW', code: 'P4', action: 'Continue monitoring' };
}

export function generateAIRecommendation(asset) {
  const sensors = asset.sensors || [];
  const actions = [];
  const reasons = [];

  const tempSensor = sensors.find(s => s.type === 'Temperature');
  const pdSensor = sensors.find(s => s.type === 'Partial Discharge');
  const oilSensor = sensors.find(s => s.type === 'Oil Quality');
  const vibSensor = sensors.find(s => s.type === 'Vibration');

  if (tempSensor && computeSensorStatus(tempSensor) !== 'Normal') {
    actions.push('Inspect and clean cooling radiators');
    actions.push('Verify oil pump flow rate');
    reasons.push(`Temperature at ${tempSensor.currentValue}${tempSensor.unit} (above ${tempSensor.warningThreshold}${tempSensor.unit} threshold)`);
  }
  if (oilSensor && computeSensorStatus(oilSensor) !== 'Normal') {
    actions.push('Perform dielectric oil quality test (BDV test)');
    actions.push('Check for moisture ingress in oil');
    reasons.push(`Oil quality degraded: ${oilSensor.currentValue}${oilSensor.unit}`);
  }
  if (pdSensor && computeSensorStatus(pdSensor) !== 'Normal') {
    actions.push('Inspect partial discharge activity on windings');
    actions.push('Perform thermographic imaging');
    reasons.push(`Partial discharge above safe threshold for extended period`);
  }
  if (vibSensor && computeSensorStatus(vibSensor) !== 'Normal') {
    actions.push('Inspect mounting bolts and bearing condition');
    reasons.push(`Elevated vibration at ${vibSensor.currentValue}${vibSensor.unit}`);
  }
  if (asset.weatherExposure === 'Severe') {
    actions.push('Deploy flood mitigation equipment around asset pad');
    actions.push('Pre-position emergency repair crew in zone');
    reasons.push(`Severe weather forecast in ${asset.zone || 'asset zone'}`);
  }

  if (actions.length === 0) {
    actions.push('Continue scheduled telemetry monitoring');
    actions.push('Verify all sensor readings at next inspection');
  }

  const failProb = computeFailureProbability(asset);
  const timeline = failProb >= 80 ? 'Within 6 hours' : failProb >= 60 ? 'Within 24 hours' : 'Within 7 days';

  return {
    actions: [...new Set(actions)],
    reasons,
    timeline,
    confidence: Math.min(95, 70 + (asset.sensors || []).length * 5)
  };
}

// ─── INITIAL ASSET DATA ────────────────────────────────────────────────────────
export const INITIAL_ASSETS = [
  {
    id: 'TR-104',
    name: 'Transformer TR-104',
    type: 'Power Transformer',
    manufacturer: 'ABB India Ltd.',
    model: 'OFAF-100/138',
    serialNumber: 'SN-8829-TR',
    installationDate: '2009-03-15',
    commissioningDate: '2009-06-01',
    status: 'Critical',
    location: 'Pine Valley Substation Yard 3',
    latitude: 19.0760,
    longitude: 72.8777,
    zone: 'Zone 4',
    substation: 'Pine Valley Substation',
    capacityMVA: 100,
    voltage: '138kV / 13.8kV',
    customersAffected: 82400,
    criticalFacilitiesList: ['Hospital', 'Water Treatment', 'Emergency Services'],
    criticalFacilities: 6,
    assetCriticality: 'P1 - Critical',
    age: 17,
    priorFaults: 2,
    lastMaintenanceDate: '2026-07-10',
    weatherExposure: 'Severe',
    sensors: [
      { id: 'S-TR104-01', type: 'Temperature', unit: '°C', currentValue: 112, normalMin: 20, normalMax: 75, warningThreshold: 85, criticalThreshold: 95, lastUpdated: '2026-09-15T15:00:00Z', status: 'Critical' },
      { id: 'S-TR104-02', type: 'Vibration', unit: 'mm/s', currentValue: 6.2, normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0, lastUpdated: '2026-09-15T15:00:00Z', status: 'Critical' },
      { id: 'S-TR104-03', type: 'Partial Discharge', unit: 'pC', currentValue: 850, normalMin: 0, normalMax: 200, warningThreshold: 300, criticalThreshold: 600, lastUpdated: '2026-09-15T15:00:00Z', status: 'Critical' },
      { id: 'S-TR104-04', type: 'Oil Quality', unit: 'kV', currentValue: 24, normalMin: 45, normalMax: 70, warningThreshold: 35, criticalThreshold: 28, lastUpdated: '2026-09-15T15:00:00Z', status: 'Critical' },
      { id: 'S-TR104-05', type: 'Load', unit: '%', currentValue: 88, normalMin: 0, normalMax: 80, warningThreshold: 80, criticalThreshold: 90, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-TR104-06', type: 'Humidity', unit: '%', currentValue: 72, normalMin: 20, normalMax: 60, warningThreshold: 65, criticalThreshold: 80, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' }
    ],
    incidents: [
      { id: 'INC-001', date: '2026-09-10', description: 'Partial discharge anomaly detected via SCADA', severity: 'High', reportedBy: 'Rahul Verma', result: 'Monitoring escalated' },
      { id: 'INC-002', date: '2026-08-04', description: 'Oil temperature exceeded 95°C during peak load', severity: 'Medium', reportedBy: 'Ananya Sharma', result: 'Load shed initiated, temperature normalized' },
      { id: 'INC-003', date: '2026-06-12', description: 'Routine cooling system inspection', severity: 'Low', reportedBy: 'Rahul Verma', result: 'Normal — no defects found' }
    ],
    maintenanceHistory: [
      { id: 'M-1021', type: 'Preventive Inspection', date: '2026-07-10', technician: 'Rahul Verma', crew: 'Crew Alpha', result: 'Cooling fan bearing wear detected', status: 'Completed' },
      { id: 'M-1009', type: 'Oil Sampling', date: '2026-04-22', technician: 'Rahul Verma', crew: 'Crew Bravo', result: 'Oil BDV at 32kV — recommended oil change', status: 'Completed' }
    ],
    auditLog: [
      { time: '2026-09-15T09:30:00Z', action: 'SCADA Alert triggered', user: 'System' },
      { time: '2026-09-15T10:00:00Z', action: 'AI Prediction updated — Risk: CRITICAL', user: 'AI Engine' }
    ]
  },
  {
    id: 'SS-022',
    name: 'Substation SS-022',
    type: 'Distribution Substation',
    manufacturer: 'Siemens Energy',
    model: 'HV-SUB-69K',
    serialNumber: 'SUB-2200-PV',
    installationDate: '2006-11-20',
    commissioningDate: '2007-02-14',
    status: 'Critical',
    location: 'Pine Valley Basin Switchyard',
    latitude: 19.0890,
    longitude: 72.8660,
    zone: 'Zone 4',
    substation: 'Pine Valley Basin Substation',
    capacityMVA: 60,
    voltage: '69kV Hub',
    customersAffected: 54000,
    criticalFacilitiesList: ['Industrial Facility', 'Commercial Area'],
    criticalFacilities: 2,
    assetCriticality: 'P1 - Critical',
    age: 20,
    priorFaults: 1,
    lastMaintenanceDate: '2026-06-05',
    weatherExposure: 'Severe',
    sensors: [
      { id: 'S-SS022-01', type: 'Temperature', unit: '°C', currentValue: 88, normalMin: 20, normalMax: 75, warningThreshold: 80, criticalThreshold: 90, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-SS022-02', type: 'Vibration', unit: 'mm/s', currentValue: 3.8, normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-SS022-03', type: 'Partial Discharge', unit: 'pC', currentValue: 420, normalMin: 0, normalMax: 200, warningThreshold: 300, criticalThreshold: 600, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-SS022-04', type: 'Load', unit: '%', currentValue: 84, normalMin: 0, normalMax: 80, warningThreshold: 80, criticalThreshold: 92, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' }
    ],
    incidents: [
      { id: 'INC-011', date: '2026-09-08', description: 'Weather-adjusted risk elevated due to projected flooding', severity: 'High', reportedBy: 'Ananya Sharma', result: 'Pre-positioning initiated' }
    ],
    maintenanceHistory: [
      { id: 'M-1019', type: 'Scheduled Inspection', date: '2026-06-05', technician: 'Rahul Verma', crew: 'Crew Bravo', result: 'All systems nominal', status: 'Completed' }
    ],
    auditLog: []
  },
  {
    id: 'TR-087',
    name: 'Transformer TR-087',
    type: 'Power Transformer',
    manufacturer: 'BHEL India',
    model: 'ONAN-35/230',
    serialNumber: 'FDR-01-WS',
    installationDate: '2015-07-22',
    commissioningDate: '2015-10-01',
    status: 'High',
    location: 'Westside Industrial Corridor',
    latitude: 19.0530,
    longitude: 72.8340,
    zone: 'Zone 7',
    substation: 'Westside Substation',
    capacityMVA: 35,
    voltage: '230kV Overhead',
    customersAffected: 12000,
    criticalFacilitiesList: [],
    criticalFacilities: 0,
    assetCriticality: 'P2 - High',
    age: 11,
    priorFaults: 1,
    lastMaintenanceDate: '2026-05-20',
    weatherExposure: 'Moderate',
    sensors: [
      { id: 'S-TR087-01', type: 'Temperature', unit: '°C', currentValue: 72, normalMin: 20, normalMax: 75, warningThreshold: 80, criticalThreshold: 95, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' },
      { id: 'S-TR087-02', type: 'Vibration', unit: 'mm/s', currentValue: 4.8, normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-TR087-03', type: 'Load', unit: '%', currentValue: 78, normalMin: 0, normalMax: 80, warningThreshold: 80, criticalThreshold: 92, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' }
    ],
    incidents: [],
    maintenanceHistory: [
      { id: 'M-1015', type: 'Vibration Inspection', date: '2026-05-20', technician: 'Rahul Verma', crew: 'Crew Alpha', result: 'Bearing wear noted, monitoring required', status: 'Completed' }
    ],
    auditLog: []
  },
  {
    id: 'TR-031',
    name: 'Transformer TR-031',
    type: 'Power Transformer',
    manufacturer: 'BHEL India',
    model: 'ONAN-40/115',
    serialNumber: 'SN-4102-TR',
    installationDate: '2003-09-10',
    commissioningDate: '2004-01-01',
    status: 'Warning',
    location: 'Harbor Point Marine Terminal',
    latitude: 19.0100,
    longitude: 72.8550,
    zone: 'Zone 2',
    substation: 'Harbor Point Substation',
    capacityMVA: 40,
    voltage: '115kV / 13.8kV',
    customersAffected: 8500,
    criticalFacilitiesList: ['Commercial Area'],
    criticalFacilities: 1,
    assetCriticality: 'P3 - Medium',
    age: 23,
    priorFaults: 3,
    lastMaintenanceDate: '2026-08-15',
    weatherExposure: 'Normal',
    sensors: [
      { id: 'S-TR031-01', type: 'Temperature', unit: '°C', currentValue: 94, normalMin: 20, normalMax: 75, warningThreshold: 85, criticalThreshold: 100, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' },
      { id: 'S-TR031-02', type: 'Vibration', unit: 'mm/s', currentValue: 3.2, normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' },
      { id: 'S-TR031-03', type: 'Oil Quality', unit: 'kV', currentValue: 32, normalMin: 45, normalMax: 70, warningThreshold: 38, criticalThreshold: 28, lastUpdated: '2026-09-15T15:00:00Z', status: 'Warning' }
    ],
    incidents: [],
    maintenanceHistory: [],
    auditLog: []
  },
  {
    id: 'FDR-004',
    name: 'Feeder FDR-004',
    type: 'Feeder Line',
    manufacturer: 'KEI Industries',
    model: 'UG-69K-XLPE',
    serialNumber: 'FDR-04-ER',
    installationDate: '2017-03-01',
    commissioningDate: '2017-05-15',
    status: 'Normal',
    location: 'East River Crossing Vault',
    latitude: 19.0700,
    longitude: 72.9000,
    zone: 'Zone 5',
    substation: 'East River Substation',
    capacityMVA: 30,
    voltage: '69kV Subterranean',
    customersAffected: 3200,
    criticalFacilitiesList: [],
    criticalFacilities: 0,
    assetCriticality: 'P4 - Low',
    age: 9,
    priorFaults: 0,
    lastMaintenanceDate: '2026-09-01',
    weatherExposure: 'Normal',
    sensors: [
      { id: 'S-FDR004-01', type: 'Temperature', unit: '°C', currentValue: 60, normalMin: 20, normalMax: 75, warningThreshold: 80, criticalThreshold: 95, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' },
      { id: 'S-FDR004-02', type: 'Vibration', unit: 'mm/s', currentValue: 1.2, normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' },
      { id: 'S-FDR004-03', type: 'Load', unit: '%', currentValue: 44, normalMin: 0, normalMax: 80, warningThreshold: 80, criticalThreshold: 92, lastUpdated: '2026-09-15T15:00:00Z', status: 'Normal' }
    ],
    incidents: [],
    maintenanceHistory: [],
    auditLog: []
  }
];

// ─── CREW UNITS ────────────────────────────────────────────────────────────────
export const INITIAL_CREWS = [
  {
    id: 'crew-alpha',
    name: 'Crew Alpha',
    status: 'Available',
    techCount: 5,
    skills: ['Heavy Transformer', 'Substation', 'Oil Testing', 'Thermal Imaging'],
    equipment: ['Cooling Radiator Spares', 'Oil Testing Kit', 'Thermal Camera'],
    currentDepot: 'Central Yard',
    currentAssignment: null,
    location: { lat: 19.0800, lng: 72.8700 }
  },
  {
    id: 'crew-bravo',
    name: 'Crew Bravo',
    status: 'Available',
    techCount: 4,
    skills: ['Transmission Lines', 'Overhead Line', 'Arborist', 'Circuit Breaker'],
    equipment: ['Hydraulic Boom', 'Emergency Repair Kit', 'Line Tools'],
    currentDepot: 'Westside Yard',
    currentAssignment: null,
    location: { lat: 19.0550, lng: 72.8350 }
  },
  {
    id: 'crew-charlie',
    name: 'Crew Charlie',
    status: 'Available',
    techCount: 3,
    skills: ['Distribution Transformer', 'Metering', 'Low Voltage'],
    equipment: ['LV Test Kit', 'Meter Tools', 'Safety Equipment'],
    currentDepot: 'East Yard',
    currentAssignment: null,
    location: { lat: 19.0750, lng: 72.8950 }
  }
];

// ─── INITIAL MAINTENANCE TICKETS ──────────────────────────────────────────────
export const INITIAL_TICKETS = [
  {
    id: 'TASK-001',
    assetId: 'TR-104',
    assetName: 'Transformer TR-104',
    assetLocation: 'Pine Valley Substation Yard 3',
    priority: 'P1',
    priorityLabel: 'P1 — CRITICAL',
    riskScore: 87,
    failureProbability: 82,
    status: 'Assigned',
    assignedCrew: 'crew-alpha',
    assignedCrewName: 'Crew Alpha',
    deadline: '2026-09-18',
    aiReason: 'High failure probability due to abnormal oil temperature, partial discharge, and severe weather exposure.',
    checklist: [
      { id: 'c1', text: 'Inspect cooling radiators and fans', checked: false },
      { id: 'c2', text: 'Perform oil dielectric BDV test', checked: false },
      { id: 'c3', text: 'Inspect partial discharge on windings', checked: false },
      { id: 'c4', text: 'Thermographic imaging of bushings', checked: false },
      { id: 'c5', text: 'Prepare emergency replacement components', checked: false }
    ],
    technicianReport: null,
    createdAt: '2026-09-15T10:08:00Z',
    updatedAt: '2026-09-15T10:22:00Z'
  },
  {
    id: 'TASK-002',
    assetId: 'SS-022',
    assetName: 'Substation SS-022',
    assetLocation: 'Pine Valley Basin Switchyard',
    priority: 'P1',
    priorityLabel: 'P1 — CRITICAL',
    riskScore: 84,
    failureProbability: 74,
    status: 'Open',
    assignedCrew: null,
    assignedCrewName: null,
    deadline: '2026-09-18',
    aiReason: 'Weather inundation risk. Severe storm forecast with heavy rain poses flooding risk to substation.',
    checklist: [
      { id: 'c6', text: 'Deploy water evacuation pump', checked: false },
      { id: 'c7', text: 'Prepare Bus Tie-2 transfer protocol', checked: false },
      { id: 'c8', text: 'Inspect seals and drainage channels', checked: false }
    ],
    technicianReport: null,
    createdAt: '2026-09-15T10:30:00Z',
    updatedAt: '2026-09-15T10:30:00Z'
  }
];

// ─── WEATHER DATA ──────────────────────────────────────────────────────────────
export const WEATHER_DATA = {
  'Zone 4': { condition: 'Severe Storm', wind: 85, rain: 42, humidity: 92, temp: 28, forecast: 'SEVERE STORM EVENT #204 — ETA 12 hours', risk: 'Severe' },
  'Zone 7': { condition: 'High Wind', wind: 50, rain: 12, humidity: 72, temp: 31, forecast: 'Strong winds forecast, moderate precipitation', risk: 'Moderate' },
  'Zone 2': { condition: 'Clear', wind: 12, rain: 0, humidity: 45, temp: 34, forecast: 'Clear skies, no weather events', risk: 'Normal' },
  'Zone 5': { condition: 'Clear', wind: 8, rain: 0, humidity: 48, temp: 33, forecast: 'Clear, no weather events', risk: 'Normal' }
};

// ─── AUDIT LOG ─────────────────────────────────────────────────────────────────
export const INITIAL_AUDIT_LOG = [
  { id: 'A1', time: '2026-09-15T09:30:00Z', action: 'SCADA alert triggered for TR-104', user: 'System', type: 'alert' },
  { id: 'A2', time: '2026-09-15T10:00:00Z', action: 'AI Prediction updated — TR-104 Risk: CRITICAL (87/100)', user: 'AI Engine', type: 'prediction' },
  { id: 'A3', time: '2026-09-15T10:08:00Z', action: 'Maintenance task TASK-001 created for TR-104', user: 'Ananya Sharma', type: 'maintenance' },
  { id: 'A4', time: '2026-09-15T10:22:00Z', action: 'Crew Alpha assigned to TASK-001', user: 'Ananya Sharma', type: 'crew' }
];
