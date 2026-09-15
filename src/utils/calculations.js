// VoltGuard - Grid Impact & Asset Health Calculations

export function calculateDuvalCoords(ch4, c2h4, c2h2) {
  const sum = (ch4 || 0) + (c2h4 || 0) + (c2h2 || 0);
  if (sum === 0) return { pctCH4: 33.3, pctC2H4: 33.3, pctC2H2: 33.3 };
  return {
    pctCH4: Number(((ch4 / sum) * 100).toFixed(1)),
    pctC2H4: Number(((c2h4 / sum) * 100).toFixed(1)),
    pctC2H2: Number(((c2h2 / sum) * 100).toFixed(1))
  };
}

export function classifyDuvalFault(pctCH4, pctC2H4, pctC2H2) {
  // IEEE / IEC 60599 Duval Triangle 1 Zones standard logic
  if (pctC2H2 > 13) {
    if (pctC2H4 >= 38) return 'D2 - High Energy Electrical Arc';
    return 'D1 - Low Energy Sparking / Partial Arcing';
  }
  if (pctCH4 > 98) return 'PD - Partial Discharge';
  if (pctC2H4 < 23) return 'T1 - Low Temp Thermal Fault (<300°C)';
  if (pctC2H4 < 50) return 'T2 - Medium Temp Thermal Fault (300-700°C)';
  return 'T3 - Severe High Temp Thermal Fault (>700°C)';
}

export function calculateAssetHealthScore(asset) {
  // Inverse scale: 100 = Brand New / Perfect, 0 = Catastrophic Imminent Failure
  if (!asset || !asset.telemetry) return 50;
  const dgaRisk = Math.min(100, ((asset.telemetry.dga?.acetylene || 0) * 0.4) + ((asset.telemetry.dga?.rateOfRisePpmDay || 0) * 2.5));
  const thermalRisk = Math.min(100, Math.max(0, ((asset.telemetry.windingHotspot - 80) / (asset.telemetry.hotspotLimit - 80)) * 100));
  const pdRisk = Math.min(100, (asset.telemetry.partialDischarge?.peakPC || 0) / 70);
  const vibRisk = Math.min(100, (asset.telemetry.vibration?.velocityRMS || 0) * 12);

  const compositeRisk = (dgaRisk * 0.35) + (thermalRisk * 0.25) + (pdRisk * 0.20) + (vibRisk * 0.20);
  const healthScore = Math.max(5, Math.min(99, Math.round(100 - compositeRisk)));
  return healthScore;
}
