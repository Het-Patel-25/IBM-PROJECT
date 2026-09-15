// VoltGuard - Strategic Grid Assets & Real-Time Sensor Telemetry Dataset

export const STRATEGIC_ASSETS = [
  {
    id: 'xfmr-pv-500-1',
    rank: 1,
    name: 'Pine Valley T-1',
    voltageClass: '500kV',
    type: 'Autotransformer Bank',
    substation: 'Pine Valley Substation (Yard 4)',
    score: 98.4,
    tier: 'CRITICAL',
    failureProb: 94.2,
    downstreamCriticality: '2 Regional Trauma Centers, Metro Light Rail, 350,000 Res/Commercial',
    downstreamMeters: 350000,
    n1Contingency: 'Severe System Frequency Collapse & Bulk Corridor Islanding',
    financialExposurePerHour: 1850000,
    catastrophicCost: 28400000,
    preventativeCost: 72000,
    stagingStatus: 'Staging In Transit',
    assignedCrew: 'Alpha Heavy Response Unit',
    location: { lat: 29.782, lng: -95.395, sector: 'Sector 87 - East Bay' },
    telemetry: {
      loadMW: 492.6,
      loadPercent: 92.4,
      windingHotspot: 135.4,
      hotspotLimit: 110.0,
      topOilTemp: 98.2,
      ambientTemp: 38.6,
      coolingStatus: '100% Force Pumps & Fans Active (Saturated)',
      dga: {
        acetylene: 142, // C2H2 ppm (High Arcing)
        ethylene: 460, // C2H4 ppm
        methane: 310, // CH4 ppm
        hydrogen: 610, // H2 ppm
        carbonMonoxide: 1120, // CO ppm
        rateOfRisePpmDay: 19.4,
        duvalZone: 'D2 - High Energy Electrical Arc',
        duvalCoords: { ch4: 34.0, c2h4: 50.5, c2h2: 15.5 }
      },
      partialDischarge: {
        peakPC: 6400,
        pulsesPerCycle: 1380,
        acousticLocation: 'Phase B Winding Core Hotspot - Upper Tank',
        tanDelta: 0.0185
      },
      vibration: {
        velocityRMS: 7.2,
        peakAccelerationG: 1.78,
        harmonics: [
          { freq: '100 Hz', amp: 7.2, status: 'Severe' },
          { freq: '200 Hz', amp: 5.8, status: 'Severe' },
          { freq: '300 Hz', amp: 4.1, status: 'Elevated' },
          { freq: '400 Hz', amp: 2.2, status: 'Moderate' },
          { freq: '500 Hz', amp: 1.4, status: 'Normal' }
        ],
        oltcNoise: 'Audible Clamping Looseness'
      },
      weatherExposure: {
        sustainedWindMph: 68,
        gustWindMph: 88,
        lightningFlashesPerMin: 84,
        precipRateInHr: 3.4
      }
    }
  },
  {
    id: 'sub42-xfmr-500-02',
    rank: 2,
    name: 'Substation 42 — XFMR-500-02',
    voltageClass: '500/230 kV',
    type: 'Autotransformer (600 MVA)',
    substation: 'Substation 42 (Metro North Grid Link)',
    score: 96.8,
    tier: 'CRITICAL',
    failureProb: 93.6,
    downstreamCriticality: 'Major Regional Pumping Station & 280,000 Customers',
    downstreamMeters: 280000,
    n1Contingency: 'Cascade Overload on Parallel 230kV Feeder Corridors',
    financialExposurePerHour: 1650000,
    catastrophicCost: 25700000,
    preventativeCost: 65000,
    stagingStatus: 'Staging In Transit',
    assignedCrew: 'Alpha Heavy Response Unit',
    location: { lat: 29.845, lng: -95.312, sector: 'Sector 42 - North Metro' },
    telemetry: {
      loadMW: 512.4,
      loadPercent: 94.8,
      windingHotspot: 134.1,
      hotspotLimit: 110.0,
      topOilTemp: 98.2,
      bottomOilTemp: 64.1,
      ambientTemp: 39.4,
      coolingStatus: 'Pumps 4/4 + Fans 12/12 (MAX Saturated)',
      dga: {
        acetylene: 210, // C2H2
        ethylene: 485, // C2H4
        methane: 340, // CH4
        hydrogen: 620, // H2
        carbonMonoxide: 980,
        rateOfRisePpmDay: 18.2,
        duvalZone: 'D2 - High Energy Electrical Arc',
        duvalCoords: { ch4: 32.8, c2h4: 46.9, c2h2: 20.3 }
      },
      partialDischarge: {
        peakPC: 6800,
        pulsesPerCycle: 1420,
        acousticLocation: 'Tank Core Zone B-Upper (Triangulated)',
        tanDelta: 0.0190
      },
      vibration: {
        velocityRMS: 7.4,
        peakAccelerationG: 1.84,
        harmonics: [
          { freq: '100 Hz', amp: 7.4, status: 'Severe' },
          { freq: '200 Hz', amp: 6.2, status: 'Severe' },
          { freq: '300 Hz', amp: 4.5, status: 'Elevated' },
          { freq: '400 Hz', amp: 2.6, status: 'Moderate' },
          { freq: '500 Hz', amp: 1.6, status: 'Normal' }
        ],
        oltcNoise: 'Audible spike (Tap 14)'
      },
      weatherExposure: {
        sustainedWindMph: 72,
        gustWindMph: 90,
        lightningFlashesPerMin: 92,
        precipRateInHr: 3.8
      }
    }
  },
  {
    id: 'westside-bus-b',
    rank: 3,
    name: 'Westside Metro Sub Bus B',
    voltageClass: '230kV / 138kV',
    type: 'Substation Bus Section B',
    substation: 'Westside Metro Substation',
    score: 91.2,
    tier: 'CRITICAL',
    failureProb: 88.1,
    downstreamCriticality: 'Water Purification Plant #3, 240,000 Municipal Connections',
    downstreamMeters: 240000,
    n1Contingency: 'Overload on Parallel Lines (138kV Ring Bus)',
    financialExposurePerHour: 920000,
    catastrophicCost: 14200000,
    preventativeCost: 45000,
    stagingStatus: 'Staging In Transit',
    assignedCrew: 'Bravo Transmission Strike Team',
    location: { lat: 29.742, lng: -95.498, sector: 'Sector 64 - West Hub' },
    telemetry: {
      loadMW: 388.0,
      loadPercent: 88.2,
      windingHotspot: 112.5,
      hotspotLimit: 110.0,
      topOilTemp: 84.6,
      ambientTemp: 37.2,
      coolingStatus: 'Fans Active 8/8',
      dga: {
        acetylene: 48,
        ethylene: 220,
        methane: 190,
        hydrogen: 280,
        carbonMonoxide: 650,
        rateOfRisePpmDay: 8.4,
        duvalZone: 'T3 - Thermal Fault > 700°C',
        duvalCoords: { ch4: 41.5, c2h4: 48.0, c2h2: 10.5 }
      },
      partialDischarge: {
        peakPC: 3200,
        pulsesPerCycle: 850,
        acousticLocation: 'Bus Duct Disconnect Jaw 2',
        tanDelta: 0.012
      },
      vibration: {
        velocityRMS: 4.8,
        peakAccelerationG: 1.12,
        harmonics: [
          { freq: '100 Hz', amp: 4.8, status: 'Elevated' },
          { freq: '200 Hz', amp: 3.5, status: 'Moderate' },
          { freq: '300 Hz', amp: 2.1, status: 'Normal' },
          { freq: '400 Hz', amp: 1.5, status: 'Normal' },
          { freq: '500 Hz', amp: 0.9, status: 'Normal' }
        ],
        oltcNoise: 'Normal'
      },
      weatherExposure: {
        sustainedWindMph: 64,
        gustWindMph: 79,
        lightningFlashesPerMin: 65,
        precipRateInHr: 2.8
      }
    }
  },
  {
    id: 'feeder-t14',
    rank: 4,
    name: 'Trans-Texas Feeder T14',
    voltageClass: '345kV Bulk',
    type: 'Double-Circuit Transmission Line',
    substation: 'Spring Branch to Baytown Corridor',
    score: 89.6,
    tier: 'SEVERE',
    failureProb: 84.5,
    downstreamCriticality: 'Silicon Wafer Industrial Park (Zero-Tolerance Power Quality)',
    downstreamMeters: 160000,
    n1Contingency: 'Phase Galloping & Flashover / Corridor Capacity Loss (500MW)',
    financialExposurePerHour: 1400000,
    catastrophicCost: 9800000,
    preventativeCost: 38000,
    stagingStatus: 'On Site / Staged',
    assignedCrew: 'Bravo Transmission Strike Team',
    location: { lat: 29.892, lng: -95.215, sector: 'Sector 33 - East Industrial' },
    telemetry: {
      loadMW: 480.0,
      loadPercent: 91.5,
      windingHotspot: 104.8,
      hotspotLimit: 100.0,
      topOilTemp: 78.0,
      ambientTemp: 38.0,
      coolingStatus: 'Natural Convection (Galloping Span)',
      dga: {
        acetylene: 18,
        ethylene: 85,
        methane: 110,
        hydrogen: 190,
        carbonMonoxide: 420,
        rateOfRisePpmDay: 3.2,
        duvalZone: 'PD - Partial Discharge',
        duvalCoords: { ch4: 51.6, c2h4: 39.9, c2h2: 8.5 }
      },
      partialDischarge: {
        peakPC: 5100,
        pulsesPerCycle: 1100,
        acousticLocation: 'Insulator String Span 48',
        tanDelta: 0.015
      },
      vibration: {
        velocityRMS: 8.9,
        peakAccelerationG: 2.4,
        harmonics: [
          { freq: '100 Hz', amp: 8.9, status: 'Severe' },
          { freq: '200 Hz', amp: 7.1, status: 'Severe' },
          { freq: '300 Hz', amp: 5.2, status: 'Severe' },
          { freq: '400 Hz', amp: 3.0, status: 'Elevated' },
          { freq: '500 Hz', amp: 1.8, status: 'Moderate' }
        ],
        oltcNoise: 'Aero-elastic Gallop Amplitude 2.8m'
      },
      weatherExposure: {
        sustainedWindMph: 68,
        gustWindMph: 86,
        lightningFlashesPerMin: 98,
        precipRateInHr: 3.6
      }
    }
  },
  {
    id: 'harbor-point-gis',
    rank: 5,
    name: 'Harbor Point GIS Bay 3',
    voltageClass: '230kV GIS',
    type: 'SF6 Gas Insulated Switchgear',
    substation: 'Harbor Point Terminal',
    score: 78.0,
    tier: 'ELEVATED',
    failureProb: 76.2,
    downstreamCriticality: 'Deepwater Port Terminal (16 Gantry Cranes, Crude Marine Berths)',
    downstreamMeters: 95000,
    n1Contingency: 'SF6 Pressure Drop (-32% Nom) & Flashover Risk',
    financialExposurePerHour: 680000,
    catastrophicCost: 8500000,
    preventativeCost: 29000,
    stagingStatus: 'Queued for Pre-Stage',
    assignedCrew: 'Delta Emergency Power & Hydro',
    location: { lat: 29.674, lng: -95.122, sector: 'Sector 19 - Port Complex' },
    telemetry: {
      loadMW: 260.0,
      loadPercent: 78.0,
      windingHotspot: 88.0,
      hotspotLimit: 105.0,
      topOilTemp: 68.0,
      ambientTemp: 36.5,
      coolingStatus: 'Enclosed GIS Forced Air',
      dga: {
        acetylene: 12,
        ethylene: 45,
        methane: 60,
        hydrogen: 110,
        carbonMonoxide: 320,
        rateOfRisePpmDay: 2.1,
        duvalZone: 'PD - Corona & Dielectric Tracking',
        duvalCoords: { ch4: 51.3, c2h4: 38.5, c2h2: 10.2 }
      },
      partialDischarge: {
        peakPC: 3800,
        pulsesPerCycle: 720,
        acousticLocation: 'GIS Bus Transition Enclosure Bay 3',
        tanDelta: 0.009
      },
      vibration: {
        velocityRMS: 3.4,
        peakAccelerationG: 0.82,
        harmonics: [
          { freq: '100 Hz', amp: 3.4, status: 'Moderate' },
          { freq: '200 Hz', amp: 2.1, status: 'Normal' },
          { freq: '300 Hz', amp: 1.4, status: 'Normal' },
          { freq: '400 Hz', amp: 0.9, status: 'Normal' },
          { freq: '500 Hz', amp: 0.5, status: 'Normal' }
        ],
        oltcNoise: 'SF6 Pressure: 28 PSI (Nominal 41 PSI)'
      },
      weatherExposure: {
        sustainedWindMph: 58,
        gustWindMph: 74,
        lightningFlashesPerMin: 45,
        precipRateInHr: 2.2
      }
    }
  },
  {
    id: 'north-hills-cap-bank',
    rank: 6,
    name: 'North Hills 138kV Cap Bank',
    voltageClass: '138kV',
    type: 'Shunt Capacitor Bank (100 MVAR)',
    substation: 'North Hills Substation (Bay 4)',
    score: 68.5,
    tier: 'ELEVATED',
    failureProb: 71.0,
    downstreamCriticality: 'Regional Grid Voltage Stability (65,000 Commercial Customers)',
    downstreamMeters: 65000,
    n1Contingency: 'Reactive Margin Collapse + Feeder Resonance',
    financialExposurePerHour: 390000,
    catastrophicCost: 3200000,
    preventativeCost: 18000,
    stagingStatus: 'Unassigned',
    assignedCrew: 'Unassigned',
    location: { lat: 29.912, lng: -95.421, sector: 'Sector 55 - North Suburbs' },
    telemetry: {
      loadMW: 95.0,
      loadPercent: 95.0,
      windingHotspot: 92.0,
      hotspotLimit: 105.0,
      topOilTemp: 72.0,
      ambientTemp: 35.0,
      coolingStatus: 'Natural Convection',
      dga: {
        acetylene: 6,
        ethylene: 32,
        methane: 45,
        hydrogen: 85,
        carbonMonoxide: 210,
        rateOfRisePpmDay: 1.4,
        duvalZone: 'T1 - Low Temperature Thermal Fault',
        duvalCoords: { ch4: 54.2, c2h4: 38.6, c2h2: 7.2 }
      },
      partialDischarge: {
        peakPC: 2100,
        pulsesPerCycle: 480,
        acousticLocation: 'Neutral Grounding Reactor',
        tanDelta: 0.007
      },
      vibration: {
        velocityRMS: 2.8,
        peakAccelerationG: 0.65,
        harmonics: [
          { freq: '100 Hz', amp: 2.8, status: 'Normal' },
          { freq: '200 Hz', amp: 1.8, status: 'Normal' },
          { freq: '300 Hz', amp: 1.1, status: 'Normal' },
          { freq: '400 Hz', amp: 0.8, status: 'Normal' },
          { freq: '500 Hz', amp: 0.4, status: 'Normal' }
        ],
        oltcNoise: 'Normal'
      },
      weatherExposure: {
        sustainedWindMph: 48,
        gustWindMph: 62,
        lightningFlashesPerMin: 38,
        precipRateInHr: 1.8
      }
    }
  },
  {
    id: 'red-bluff-bkr-230',
    rank: 7,
    name: 'Red Bluff BKR-230 04',
    voltageClass: '230kV',
    type: 'SF6 High-Voltage Gas Breaker',
    substation: 'Red Bluff Substation',
    score: 86.1,
    tier: 'SEVERE',
    failureProb: 86.1,
    downstreamCriticality: 'Intertie Gateway to Southern Petrochemical Refining Loop',
    downstreamMeters: 190000,
    n1Contingency: 'Bus Ties at Risk: Lock-out & Live Bypass Mandatory',
    financialExposurePerHour: 1100000,
    catastrophicCost: 6400000,
    preventativeCost: 32000,
    stagingStatus: 'Queued for Pre-Stage',
    assignedCrew: 'Delta Emergency Power & Hydro',
    location: { lat: 29.621, lng: -95.289, sector: 'Sector 72 - South Refinery' },
    telemetry: {
      loadMW: 320.0,
      loadPercent: 82.0,
      windingHotspot: 94.0,
      hotspotLimit: 105.0,
      topOilTemp: 70.0,
      ambientTemp: 37.0,
      coolingStatus: 'Natural Convection',
      dga: {
        acetylene: 22,
        ethylene: 94,
        methane: 88,
        hydrogen: 140,
        carbonMonoxide: 310,
        rateOfRisePpmDay: 4.8,
        duvalZone: 'D1 - Low Energy Electrical Discharge',
        duvalCoords: { ch4: 43.1, c2h4: 46.1, c2h2: 10.8 }
      },
      partialDischarge: {
        peakPC: 3400,
        pulsesPerCycle: 680,
        acousticLocation: 'Pole B Interrupter Chamber',
        tanDelta: 0.011
      },
      vibration: {
        velocityRMS: 7.4,
        peakAccelerationG: 1.62,
        harmonics: [
          { freq: '100 Hz', amp: 7.4, status: 'Severe' },
          { freq: '200 Hz', amp: 4.9, status: 'Elevated' },
          { freq: '300 Hz', amp: 3.2, status: 'Moderate' },
          { freq: '400 Hz', amp: 1.8, status: 'Normal' },
          { freq: '500 Hz', amp: 1.0, status: 'Normal' }
        ],
        oltcNoise: 'Pressure dropped from 31 to 28 PSI'
      },
      weatherExposure: {
        sustainedWindMph: 62,
        gustWindMph: 81,
        lightningFlashesPerMin: 72,
        precipRateInHr: 3.1
      }
    }
  },
  {
    id: 'east-river-feeder-14b',
    rank: 8,
    name: 'East River Feeder 14B',
    voltageClass: '138kV Submarine',
    type: 'Submarine Cable Pothead Termination',
    substation: 'East River Channel Crossing',
    score: 79.5,
    tier: 'ELEVATED',
    failureProb: 79.5,
    downstreamCriticality: 'East Basin Logistics Island & Ship Channel Pumping',
    downstreamMeters: 110000,
    n1Contingency: 'Underground/Underwater Splicing Delay (14 Days if Tripped)',
    financialExposurePerHour: 620000,
    catastrophicCost: 11200000,
    preventativeCost: 48000,
    stagingStatus: 'Unassigned',
    assignedCrew: 'Unassigned',
    location: { lat: 29.756, lng: -95.295, sector: 'Sector 48 - Ship Channel' },
    telemetry: {
      loadMW: 185.0,
      loadPercent: 79.0,
      windingHotspot: 89.0,
      hotspotLimit: 100.0,
      topOilTemp: 74.0,
      ambientTemp: 34.0,
      coolingStatus: 'Forced Waterbed Dissipation',
      dga: {
        acetylene: 35,
        ethylene: 140,
        methane: 160,
        hydrogen: 210,
        carbonMonoxide: 390,
        rateOfRisePpmDay: 5.5,
        duvalZone: 'D1 - Intermittent Sparking in Oil/Pothead',
        duvalCoords: { ch4: 47.8, c2h4: 41.8, c2h2: 10.4 }
      },
      partialDischarge: {
        peakPC: 4200,
        pulsesPerCycle: 910,
        acousticLocation: 'Pothead Terminal Phase C',
        tanDelta: 0.014
      },
      vibration: {
        velocityRMS: 3.8,
        peakAccelerationG: 0.94,
        harmonics: [
          { freq: '100 Hz', amp: 3.8, status: 'Moderate' },
          { freq: '200 Hz', amp: 2.4, status: 'Normal' },
          { freq: '300 Hz', amp: 1.5, status: 'Normal' },
          { freq: '400 Hz', amp: 0.9, status: 'Normal' },
          { freq: '500 Hz', amp: 0.5, status: 'Normal' }
        ],
        oltcNoise: 'Normal'
      },
      weatherExposure: {
        sustainedWindMph: 59,
        gustWindMph: 75,
        lightningFlashesPerMin: 54,
        precipRateInHr: 2.7
      }
    }
  },
  {
    id: 'highland-ridge-bushing-b',
    rank: 9,
    name: 'Highland Ridge Bushing B',
    voltageClass: '500kV',
    type: 'Condenser Bushing Phase B',
    substation: 'Highland Ridge Bulk Yard',
    score: 74.8,
    tier: 'ELEVATED',
    failureProb: 74.8,
    downstreamCriticality: 'Bulk Intertie Transmission Gateway',
    downstreamMeters: 145000,
    n1Contingency: 'Bushing Catastrophic Shrapnel Breach to Adjacent Transformers',
    financialExposurePerHour: 750000,
    catastrophicCost: 18900000,
    preventativeCost: 52000,
    stagingStatus: 'Queued for Pre-Stage',
    assignedCrew: 'Bravo Transmission Strike Team',
    location: { lat: 29.831, lng: -95.542, sector: 'Sector 81 - West Hills' },
    telemetry: {
      loadMW: 360.0,
      loadPercent: 75.0,
      windingHotspot: 96.0,
      hotspotLimit: 110.0,
      topOilTemp: 76.0,
      ambientTemp: 36.0,
      coolingStatus: 'Fans Active 4/8',
      dga: {
        acetylene: 15,
        ethylene: 68,
        methane: 82,
        hydrogen: 175,
        carbonMonoxide: 290,
        rateOfRisePpmDay: 2.9,
        duvalZone: 'PD - Moisture Ingress in Paper Capacitive Core',
        duvalCoords: { ch4: 50.0, c2h4: 41.0, c2h2: 9.0 }
      },
      partialDischarge: {
        peakPC: 3100,
        pulsesPerCycle: 640,
        acousticLocation: 'Bushing Upper Porcelain Shed C1 Tap',
        tanDelta: 0.014
      },
      vibration: {
        velocityRMS: 3.1,
        peakAccelerationG: 0.76,
        harmonics: [
          { freq: '100 Hz', amp: 3.1, status: 'Normal' },
          { freq: '200 Hz', amp: 2.0, status: 'Normal' },
          { freq: '300 Hz', amp: 1.2, status: 'Normal' },
          { freq: '400 Hz', amp: 0.7, status: 'Normal' },
          { freq: '500 Hz', amp: 0.4, status: 'Normal' }
        ],
        oltcNoise: '+6.8% C1 Tap Drift, Thermal Delta +14.2°C'
      },
      weatherExposure: {
        sustainedWindMph: 55,
        gustWindMph: 71,
        lightningFlashesPerMin: 42,
        precipRateInHr: 2.1
      }
    }
  }
];
