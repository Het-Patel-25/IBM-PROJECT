// GridPulse AI - Weather & Severe Storm Fusion Dataset

export const WEATHER_FUSION_DATA = {
  fusionId: '#WCV-8820-A',
  systemName: 'Category 3 Severe Mesoscale Convective Vortex (MCV)',
  etaToImpactHours: 4.5,
  combinedRiskCoefficient: 96.8,
  breakdown: {
    assetThermalStrain: 95.4,
    windGustConeMph: 78,
    precipAccumulationInHr: 3.5,
    barometricPressureDropHpa: -18.4,
    lightningFlashesPerHour: 3420,
    nexradStatus: 'DUAL-POL LOCKED',
    inundationCrestHours: 3.2,
    spatialResolutionMeters: 250
  },
  corridorGauges: {
    substation18FloodBerm: '+10.4 in Over Berm',
    line502CanopyMargin: '-2.2 ft Margin Deficit',
    line502ConductorTemp: '104.8 °C (Max 110 °C)',
    corridorRealtimeLimit: '1,248 MVA (92.4% rating)'
  },
  zoneVulnerabilities: [
    { zone: 'Z1 - West Industrial', score: 42, color: 'normal' },
    { zone: 'Z2 - North Corridor', score: 88, color: 'severe' },
    { zone: 'Z3 - Bay Basin Hub', score: 96, color: 'critical' },
    { zone: 'Z4 - Metro Core', score: 74, color: 'elevated' },
    { zone: 'Z5 - South Refinery', score: 58, color: 'normal' },
    { zone: 'Z6 - East Coastal', score: 91, color: 'critical' }
  ],
  synchronized72hCurve: [
    { hour: 'T-0', time: '14:00', windMph: 45.2, loadMW: 4200, exposureScore: 68 },
    { hour: 'T+2', time: '16:00', windMph: 64.0, loadMW: 4520, exposureScore: 82 },
    { hour: 'T+4', time: '18:00', windMph: 78.4, loadMW: 4890, exposureScore: 96.8, isPeak: true },
    { hour: 'T+6', time: '20:00', windMph: 72.0, loadMW: 4710, exposureScore: 92 },
    { hour: 'T+8', time: '22:00', windMph: 58.5, loadMW: 4350, exposureScore: 78 },
    { hour: 'T+12', time: '02:00', windMph: 42.0, loadMW: 3800, exposureScore: 62 },
    { hour: 'T+24', time: '14:00', windMph: 28.0, loadMW: 4100, exposureScore: 40 },
    { hour: 'T+48', time: '14:00', windMph: 16.5, loadMW: 4050, exposureScore: 24 },
    { hour: 'T+72', time: '14:00', windMph: 12.0, loadMW: 3950, exposureScore: 15 }
  ],
  correlatedHazards: [
    {
      id: 'haz-1',
      asset: 'Line 502 (Span 48)',
      voltage: '345kV Bulk Transmission - Pinedale Cut',
      weatherVector: '68 mph Sustained Wind Cone, Convective Gusts 84 mph',
      scadaTelemetry: 'Current Sag: 24.2 ft (Limit: 22.0 ft, Deficit: -2.2 ft)',
      compoundedConsequence: 'Phase-to-Ground Tree Canopy Flashover; cascade trip risk across Intertie East 1 & 4',
      outageEta: 'T + 3.8h',
      urgency: 'CRITICAL',
      prescriptiveAction: 'Apply Dynamic Line Rating (DLR) Curtailment - De-rate bulk load capacity by 250 MW to cool conductor core and regain +2.6 ft ground clearance.'
    },
    {
      id: 'haz-2',
      asset: 'Coastal Substation 9',
      voltage: '230/138kV Intertie - Bayou Frontage',
      weatherVector: '4.2 ft Marine Storm Surge + Precip Influx 3.8 in/hr tidal compound',
      scadaTelemetry: 'Sump Pump #1 & #2 Telemetry Error; Basement Well Sensor: High Saturated',
      compoundedConsequence: 'Control House 125V DC Battery Submersion; Instant blind loss of protective relaying on 4 feeders',
      outageEta: 'T + 2.1h',
      urgency: 'IMMINENT',
      prescriptiveAction: 'Switch Coastal Sub 9 to Remote Automation Lockout - Pre-emptively isolate transfer of 5 feeder breakers to inland Ring Bus 12 before DC battery loss.'
    },
    {
      id: 'haz-3',
      asset: 'Pine Valley Substation',
      voltage: '500kV Bulk Autotransformer T-1',
      weatherVector: 'Delta 32°F Rapid Cold Shock; severe microburst sudden temperature plunge',
      scadaTelemetry: 'DGA Moisture: 44 ppm (Rising); Aged Nitrile Gasket Deflection Alert',
      compoundedConsequence: 'Oil Dielectric Breakdown & Internal Flashover; Catastrophic autotransformer failure ($8.5M asset)',
      outageEta: 'T + 5.6h',
      urgency: 'WARNING',
      prescriptiveAction: 'Deploy Mobile Aqua-Barrier & Aux Generators to Sub 18 / Pine Valley - Staged Unit Crew #4 (ETA 42m). Immediate fortification of pump bays.'
    }
  ]
};
