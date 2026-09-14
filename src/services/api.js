// GridPulse AI - Frontend API Service Layer
// Connects to Express backend with seamless fallback to simulated data

import { INITIAL_ASSETS, INITIAL_MAINTENANCE, getRiskLevel } from '../data/mockAssets';

const API_BASE_URL = '/api';

// Helper to check if backend is alive
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { connected: true, ...data };
    }
  } catch (err) {
    // Expected when backend is not running
  }
  return { connected: false, message: 'Local Demo Mode' };
}

// 1. Fetch Assets
export async function getAssets() {
  try {
    const res = await fetch(`${API_BASE_URL}/assets`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    // Fallback to local storage or initial
  }

  const stored = localStorage.getItem('gridpulse_assets');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  localStorage.setItem('gridpulse_assets', JSON.stringify(INITIAL_ASSETS));
  return INITIAL_ASSETS;
}

// 2. Fetch Single Asset
export async function getAssetById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const assets = await getAssets();
  return assets.find((a) => a.id === id || a._id === id) || assets[0];
}

// 3. Predict Failure Risk (Sends sensor values to backend ML API or local simulation)
export async function predictRisk(sensorData) {
  const { temperature, load, vibration, humidity, age } = sensorData;

  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensorData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Seamless fallback to deterministic ML scoring formula
  }

  // Baseline scoring logic matching Random Forest weights:
  // Temp threshold: 75°C, Load threshold: 75%, Vib: 3.0mm/s, Age: 15yrs, Humidity: 70%
  let score = 15; // base nominal risk

  if (temperature > 70) score += (temperature - 70) * 1.6;
  if (temperature > 90) score += 15;

  if (load > 65) score += (load - 65) * 0.9;
  if (load > 85) score += 12;

  if (vibration > 2.5) score += (vibration - 2.5) * 14;

  if (humidity > 70) score += (humidity - 70) * 0.4;
  if (age > 10) score += (age - 10) * 0.8;

  score = Math.min(99, Math.max(5, Math.round(score)));

  let riskCategory = 'Normal';
  let possibleFailure = 'Nominal Condition';
  let recommendation = 'No immediate maintenance required. Maintain standard monitoring schedule.';

  if (score >= 86) {
    riskCategory = 'Critical';
    if (temperature > 85 && vibration > 3.5) {
      possibleFailure = 'Severe Transformer Overheating & Bearing Failure';
      recommendation = 'IMMEDIATE INTERVENTION REQUIRED. Transfer load immediately, inspect forced cooling radiators, and dispatch emergency repair crew.';
    } else if (temperature > 85) {
      possibleFailure = 'Thermal Overheating & Winding Dielectric Breakdown';
      recommendation = 'Urgent: Reduce feeder load immediately, inspect cooling oil/fans, and perform emergency thermal imaging.';
    } else {
      possibleFailure = 'Severe Mechanical Wear / Structural Vibration Anomaly';
      recommendation = 'Halt or bypass feeder, balance rotating parts, and inspect mounting anchor bolts.';
    }
  } else if (score >= 71) {
    riskCategory = 'High';
    possibleFailure = 'Accelerated Thermal & Mechanical Stress';
    recommendation = 'Schedule priority inspection within 24 hours. Verify oil levels, clean cooling vents, and monitor hourly load curve.';
  } else if (score >= 41) {
    riskCategory = 'Warning';
    possibleFailure = 'Moderate Operational Degradation';
    recommendation = 'Monitor closely during peak afternoon load. Plan preventative maintenance during next maintenance window.';
  }

  return {
    failureProbability: score,
    riskCategory,
    possibleFailure,
    recommendation,
    modelUsed: 'Simulated Random Forest Baseline (Local Mode)'
  };
}

// 4. Fetch Maintenance Records
export async function getMaintenance() {
  try {
    const res = await fetch(`${API_BASE_URL}/maintenance`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}

  const stored = localStorage.getItem('gridpulse_maintenance');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(INITIAL_MAINTENANCE));
  return INITIAL_MAINTENANCE;
}

// 5. Create Maintenance Task
export async function createMaintenance(newTask) {
  try {
    const res = await fetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const current = await getMaintenance();
  const task = {
    id: `maint-${Date.now()}`,
    ...newTask,
    createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
  };
  const updated = [task, ...current];
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(updated));
  return task;
}

// 6. Update Maintenance Task
export async function updateMaintenance(id, updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  const current = await getMaintenance();
  const updated = current.map((item) => (item.id === id || item._id === id ? { ...item, ...updates } : item));
  localStorage.setItem('gridpulse_maintenance', JSON.stringify(updated));
  return updated.find((item) => item.id === id || item._id === id);
}
