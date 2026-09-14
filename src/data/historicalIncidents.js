// GridPulse AI - Historical Incident Archive & ML Benchmark Dataset

export const HISTORICAL_DATASET_SUMMARY = {
  totalIncidents: 14200,
  yearsOfData: 25,
  catastrophicAverted: 842,
  preventativeROI: '395x Average Return on Investment',
  meanTimeToPredictDays: 18.4,
  modelAccuracyAUC: 0.964,
  falseNegativeRatePercent: 1.2
};

export const MODEL_BENCHMARK = [
  {
    model: 'Physics-Informed Neural Network (PINN Multi-Modal)',
    auc: 0.964,
    f1Score: 0.938,
    leadTimeDays: 21.4,
    falseNegRate: '1.2%',
    weatherCoupled: 'Yes (Dynamic Non-linear)',
    status: 'ACTIVE MODEL v4.1.8'
  },
  {
    model: 'Supervised Gradient Boosting (XGBoost + Random Forest)',
    auc: 0.886,
    f1Score: 0.842,
    leadTimeDays: 9.6,
    falseNegRate: '7.8%',
    weatherCoupled: 'Yes (Linear features)',
    status: 'Benchmark Tier 2'
  },
  {
    model: 'Pure Statistical Time-Series (ARIMA / Holt-Winters)',
    auc: 0.781,
    f1Score: 0.712,
    leadTimeDays: 3.4,
    falseNegRate: '14.8%',
    weatherCoupled: 'No (Univariate SCADA)',
    status: 'Legacy Statistical'
  },
  {
    model: 'Calendar-Based Maintenance (Standard Utility Practice)',
    auc: 0.512,
    f1Score: 0.420,
    leadTimeDays: 0.0,
    falseNegRate: '58.6%',
    weatherCoupled: 'None (Blind to weather)',
    status: 'Deprecating Utility Baseline'
  }
];

export const SHAP_FEATURE_IMPORTANCE = [
  { feature: 'DGA Acetylene (C2H2) Rate-of-Rise (ppm/day)', weight: 0.284, importance: 98, category: 'DGA Oil' },
  { feature: 'IEEE C57.91 Dynamic Hotspot Delta (>110°C Limit)', weight: 0.231, importance: 88, category: 'Thermal' },
  { feature: 'Partial Discharge Acoustic Triangulation (PRPD peak pC)', weight: 0.186, importance: 74, category: 'PD Acoustic' },
  { feature: 'Convective Wind Gust & Dynamic Line Rating Sag Deficit', weight: 0.142, importance: 62, category: 'Weather Fusion' },
  { feature: 'Vibration 100/200Hz Harmonics & Loose Core Clamping', weight: 0.098, importance: 48, category: 'Mechanical' },
  { feature: 'Asset Age (>30 yrs) & Historic Overload Thermal Cycles', weight: 0.059, importance: 32, category: 'Asset Age' }
];

export const HISTORICAL_CASE_STUDIES = [
  {
    id: 'CS-2024-08',
    event: 'Tropical Storm Beryl - Coastal Feeder Galloping',
    date: 'July 2024',
    assetClass: '345kV Bulk Transmission',
    failureMode: 'Aero-elastic galloping resulting in phase-to-phase flashover',
    detectionMethod: 'FLIR drone thermal signature + high-frequency vibration sensors',
    outcomeWithAI: 'Dynamic Line Rating curtailed load 3.5 hours prior to storm crest; crews installed aerodynamic dampers pre-impact. Zero outage.',
    financialAverted: '$8,400,000'
  },
  {
    id: 'CS-2023-09',
    event: 'Metro Substation 500kV Autotransformer Thermal Runaway',
    date: 'August 2023',
    assetClass: '500kV 600MVA Autotransformer',
    failureMode: 'Inter-turn paper insulation breakdown leading to acetylene gas surge',
    detectionMethod: 'Online DGA photo-acoustic spectroscopy detected C2H2 rise from 2 to 180 ppm over 96 hours',
    outcomeWithAI: 'Automated BES load shifting diverted 220 MW to Oakridge bypass; emergency vacuum degasification deployed. Tank explosion averted.',
    financialAverted: '$24,200,000'
  },
  {
    id: 'CS-2021-02',
    event: 'Winter Storm Uri - Deep Freeze Moisture Dielectric Collapse',
    date: 'February 2021',
    assetClass: '230kV Bushing & Breaker Fleet',
    failureMode: 'Rapid thermal contraction deflecting aged nitrile gaskets; moisture ingress into oil',
    detectionMethod: 'Capacitance tap drift (C1) and dielectric dissipation factor (tan delta)',
    outcomeWithAI: 'Pre-emptive heated blanket deployments and dry nitrogen purge on 18 critical bays prevented cascading trips.',
    financialAverted: '$16,700,000'
  }
];
