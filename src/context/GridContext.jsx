import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ASSETS, INITIAL_CREWS, INITIAL_TICKETS, INITIAL_AUDIT_LOG, WEATHER_DATA,
  computeAssetHealth, computeFailureProbability, computeGridImpact, computeOverallRisk,
  computeRiskContributors, getStatusFromRisk, getPriority, generateAIRecommendation,
  computeSensorStatus
} from '../data/gridSentinelData';

const GridContext = createContext();
export const useGrid = () => useContext(GridContext);

const STORAGE_KEYS = {
  assets: 'gs_assets_v2',
  tickets: 'gs_tickets_v2',
  crews: 'gs_crews_v2',
  auditLog: 'gs_audit_v2',
  mapPositions: 'gs_map_positions_v1'
};

// Default blueprint positions for known assets (x, y in 1400x900 canvas)
const DEFAULT_MAP_POSITIONS = {
  'TR-104':  { x: 220, y: 140 },
  'SS-022':  { x: 580, y: 200 },
  'TR-087':  { x: 320, y: 440 },
  'TR-031':  { x: 880, y: 320 },
  'FDR-004': { x: 1100, y: 520 },
};

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

/** Compute derived fields for a single asset */
function deriveAsset(asset) {
  const failureProbability = computeFailureProbability(asset);
  const gridImpact = computeGridImpact(asset, failureProbability);
  const overallRisk = computeOverallRisk(failureProbability, gridImpact);
  const healthScore = computeAssetHealth(asset);
  const riskContributors = computeRiskContributors(asset);
  const status = getStatusFromRisk(overallRisk);
  const priority = getPriority(overallRisk);
  const recommendation = generateAIRecommendation(asset);
  const weather = WEATHER_DATA[asset.zone] || { condition: 'Unknown', risk: 'Normal', wind: 0, rain: 0, humidity: 0, temp: 0, forecast: 'No data' };
  
  return {
    ...asset,
    failureProbability,
    gridImpact,
    overallRisk,
    healthScore,
    riskContributors,
    status,
    priority,
    recommendation,
    weather
  };
}

export const GridProvider = ({ children }) => {
  const [rawAssets, setRawAssets] = useState(() => loadFromStorage(STORAGE_KEYS.assets, INITIAL_ASSETS));
  const [tickets, setTickets] = useState(() => loadFromStorage(STORAGE_KEYS.tickets, INITIAL_TICKETS));
  const [crews, setCrews] = useState(() => loadFromStorage(STORAGE_KEYS.crews, INITIAL_CREWS));
  const [auditLog, setAuditLog] = useState(() => loadFromStorage(STORAGE_KEYS.auditLog, INITIAL_AUDIT_LOG));
  const [mapPositions, setMapPositions] = useState(() => loadFromStorage(STORAGE_KEYS.mapPositions, DEFAULT_MAP_POSITIONS));

  // Derived assets with computed fields
  const assets = rawAssets.map(deriveAsset);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.assets, JSON.stringify(rawAssets)); }, [rawAssets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.crews, JSON.stringify(crews)); }, [crews]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(auditLog)); }, [auditLog]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.mapPositions, JSON.stringify(mapPositions)); }, [mapPositions]);

  // ── AUDIT LOG ───────────────────────────────────────────────────────────────
  const addAudit = useCallback((action, user = 'System', type = 'action') => {
    const entry = { id: `A${Date.now()}`, time: new Date().toISOString(), action, user, type };
    setAuditLog(prev => [entry, ...prev.slice(0, 49)]);
  }, []);

  // ── ASSET OPERATIONS ────────────────────────────────────────────────────────
  const addAsset = useCallback((assetData, userName = 'Admin') => {
    const newAsset = {
      ...assetData,
      sensors: assetData.sensors || [],
      incidents: [],
      maintenanceHistory: [],
      auditLog: []
    };
    setRawAssets(prev => [newAsset, ...prev]);
    addAudit(`Asset ${newAsset.id} — "${newAsset.name}" added`, userName, 'asset');
    return newAsset.id;
  }, [addAudit]);

  const updateAsset = useCallback((assetId, updates, userName = 'Admin') => {
    setRawAssets(prev => prev.map(a => a.id === assetId ? { ...a, ...updates } : a));
    addAudit(`Asset ${assetId} updated`, userName, 'asset');
  }, [addAudit]);

  const updateSensorValue = useCallback((assetId, sensorId, newValue, userName = 'System') => {
    setRawAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      const updatedSensors = (a.sensors || []).map(s => {
        if (s.id !== sensorId) return s;
        const updated = { ...s, currentValue: newValue, lastUpdated: new Date().toISOString() };
        updated.status = computeSensorStatus(updated);
        return updated;
      });
      return { ...a, sensors: updatedSensors };
    }));
    addAudit(`Sensor ${sensorId} on ${assetId} updated to ${newValue}`, userName, 'sensor');
  }, [addAudit]);

  const addSensor = useCallback((assetId, sensorData, userName = 'Admin') => {
    setRawAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      return { ...a, sensors: [...(a.sensors || []), { ...sensorData, id: `S-${assetId}-${Date.now()}` }] };
    }));
    addAudit(`Sensor added to ${assetId}`, userName, 'sensor');
  }, [addAudit]);

  // ── INCIDENT OPERATIONS ─────────────────────────────────────────────────────
  const addIncident = useCallback((assetId, incident, userName = 'Admin') => {
    const newIncident = { id: `INC-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...incident };
    setRawAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      return { ...a, incidents: [newIncident, ...(a.incidents || [])] };
    }));
    addAudit(`Incident reported for ${assetId}: ${incident.description}`, userName, 'incident');
  }, [addAudit]);

  // ── MAINTENANCE OPERATIONS ──────────────────────────────────────────────────
  const createMaintenanceTask = useCallback((assetId, userName = 'Admin') => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return null;
    const task = {
      id: `TASK-${Date.now()}`,
      assetId,
      assetName: asset.name,
      assetLocation: asset.location,
      priority: asset.priority.code,
      priorityLabel: asset.priority.label,
      riskScore: asset.overallRisk,
      failureProbability: asset.failureProbability,
      status: 'Open',
      assignedCrew: null,
      assignedCrewName: null,
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      aiReason: asset.recommendation.reasons.join('; ') || 'AI risk threshold exceeded',
      checklist: asset.recommendation.actions.map((a, i) => ({ id: `c${Date.now()}${i}`, text: a, checked: false })),
      technicianReport: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTickets(prev => [task, ...prev]);
    addAudit(`Maintenance task ${task.id} created for ${assetId}`, userName, 'maintenance');
    return task.id;
  }, [assets, addAudit]);

  const assignCrew = useCallback((taskId, crewId, userName = 'Admin') => {
    const crew = crews.find(c => c.id === crewId);
    if (!crew) return;
    setTickets(prev => prev.map(t => t.id === taskId
      ? { ...t, status: 'Assigned', assignedCrew: crewId, assignedCrewName: crew.name, updatedAt: new Date().toISOString() }
      : t
    ));
    setCrews(prev => prev.map(c => c.id === crewId ? { ...c, status: 'Dispatched', currentAssignment: taskId } : c));
    addAudit(`${crew.name} assigned to task ${taskId}`, userName, 'crew');
  }, [crews, addAudit]);

  const updateTicketStatus = useCallback((taskId, status, userName = 'Technician') => {
    setTickets(prev => prev.map(t => t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    addAudit(`Task ${taskId} status updated to: ${status}`, userName, 'maintenance');
  }, [addAudit]);

  const toggleChecklistItem = useCallback((taskId, checkId) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, checklist: t.checklist.map(c => c.id === checkId ? { ...c, checked: !c.checked } : c) };
    }));
  }, []);

  const completeMaintenanceTask = useCallback((taskId, report, userName = 'Technician') => {
    const task = tickets.find(t => t.id === taskId);
    if (!task) return;

    // Update ticket
    setTickets(prev => prev.map(t => t.id === taskId
      ? { ...t, status: 'Completed', technicianReport: report, updatedAt: new Date().toISOString() }
      : t
    ));

    // Free up crew
    if (task.assignedCrew) {
      setCrews(prev => prev.map(c => c.id === task.assignedCrew
        ? { ...c, status: 'Available', currentAssignment: null }
        : c
      ));
    }

    // Update asset: add maintenance history, add incident, update lastMaintenanceDate
    setRawAssets(prev => prev.map(a => {
      if (a.id !== task.assetId) return a;
      const newMaint = {
        id: task.id,
        type: 'Field Inspection',
        date: new Date().toISOString().split('T')[0],
        technician: userName,
        crew: task.assignedCrewName || 'Unassigned',
        result: report?.findings || 'Inspection completed',
        status: 'Completed'
      };
      const newIncident = report?.findings ? {
        id: `INC-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Field inspection result: ${report.findings}`,
        severity: report.severity || 'Low',
        reportedBy: userName,
        result: report.recommendation || 'See maintenance report'
      } : null;
      return {
        ...a,
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceHistory: [newMaint, ...(a.maintenanceHistory || [])],
        incidents: newIncident ? [newIncident, ...(a.incidents || [])] : (a.incidents || [])
      };
    }));

    addAudit(`Task ${taskId} completed by ${userName}. Findings: ${report?.findings || 'N/A'}`, userName, 'maintenance');
  }, [tickets, addAudit]);

  // ── DASHBOARD STATS ─────────────────────────────────────────────────────────
  const dashboardStats = {
    totalAssets: assets.length,
    criticalAssets: assets.filter(a => a.status === 'Critical').length,
    highRiskAssets: assets.filter(a => a.status === 'High').length,
    openMaintenance: tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status)).length,
    activeCrews: crews.filter(c => c.status === 'Dispatched').length,
    availableCrews: crews.filter(c => c.status === 'Available').length,
    completedToday: tickets.filter(t => t.status === 'Completed').length
  };

  const resetAll = useCallback(() => {
    setRawAssets(INITIAL_ASSETS);
    setTickets(INITIAL_TICKETS);
    setCrews(INITIAL_CREWS);
    setAuditLog(INITIAL_AUDIT_LOG);
    setMapPositions(DEFAULT_MAP_POSITIONS);
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }, []);

  const updateMapPosition = useCallback((assetId, x, y, userName = 'Admin') => {
    setMapPositions(prev => ({ ...prev, [assetId]: { x, y } }));
    addAudit(`Map position updated for ${assetId} → (${Math.round(x)}, ${Math.round(y)})`, userName, 'map');
  }, [addAudit]);

  const saveMapPositions = useCallback((positions) => {
    setMapPositions(positions);
  }, []);

  return (
    <GridContext.Provider value={{
      assets,
      rawAssets,
      tickets,
      crews,
      auditLog,
      dashboardStats,
      weatherData: WEATHER_DATA,
      mapPositions,
      // Actions
      addAsset,
      updateAsset,
      updateSensorValue,
      addSensor,
      addIncident,
      createMaintenanceTask,
      assignCrew,
      updateTicketStatus,
      toggleChecklistItem,
      completeMaintenanceTask,
      addAudit,
      resetAll,
      updateMapPosition,
      saveMapPositions
    }}>
      {children}
    </GridContext.Provider>
  );
};
