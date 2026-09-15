import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ASSETS, INITIAL_MAINTENANCE, CREW_UNITS, WEATHER_SECTORS, LIVE_ALERTS } from '../data/mockAssets';

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('sim_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sim_tickets');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [crews, setCrews] = useState(() => {
    const saved = localStorage.getItem('sim_crews');
    return saved ? JSON.parse(saved) : CREW_UNITS;
  });

  const [weatherSectors] = useState(WEATHER_SECTORS);
  const [liveAlerts] = useState(LIVE_ALERTS);
  const [responseApproved, setResponseApproved] = useState(() => {
    return localStorage.getItem('sim_response_approved') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sim_assets', JSON.stringify(assets));
    localStorage.setItem('sim_tickets', JSON.stringify(tickets));
    localStorage.setItem('sim_crews', JSON.stringify(crews));
    localStorage.setItem('sim_response_approved', responseApproved.toString());
  }, [assets, tickets, crews, responseApproved]);

  const approveResponsePlan = (eventId) => {
    setResponseApproved(true);
    
    // Assign Crew Alpha to T-104 task
    setCrews(prev => prev.map(c => 
      c.id === 'crew-alpha' ? { ...c, status: 'Dispatched', distance: 'En Route (8m)' } : c
    ));

    // Update the task in maintenance queue to Dispatched
    setTickets(prev => prev.map(t => 
      t.id === 'task-001' ? { ...t, status: 'Dispatched (Alpha En Route)' } : t
    ));
  };

  const sendToMaintenance = (asset) => {
    const newTicket = {
      id: `task-${Date.now()}`,
      priorityNum: 3,
      priorityTag: 'High #3',
      priorityColor: 'warning',
      assetName: asset.name,
      assetSub: asset.code,
      riskScore: `${asset.failureRisk}/100`,
      riskCategory: 'High',
      riskSub: `Risk: ${asset.overallRisk}%`,
      deadline: 'ASAP',
      recommendedActions: [
        { id: 'a1', text: 'Inspect telemetry sensors', checked: false },
        { id: 'a2', text: 'Run diagnostic sweep', checked: false }
      ],
      assignedCrew: 'Unassigned',
      assignedCrewDetails: 'Needs Dispatch',
      status: 'Pre-dispatch'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const generateRecommendation = (assetId) => {
    // Just a UI trigger in this mock
  };

  const completeMaintenanceTask = (ticketId, observations) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: 'Completed & Feedback Sent' } : t
    ));

    // If it was T-104 (task-001), update the asset risk lower
    if (ticketId === 'task-001') {
      setAssets(prev => prev.map(a => 
        a.id === 'tx-104' ? { 
          ...a, 
          failureRisk: 22, 
          overallRisk: 34, 
          status: 'Normal', 
          priority: 'Normal',
          gridImpactScore: 24,
          weatherExposure: 'Resolved'
        } : a
      ));

      // Free up Crew Alpha
      setCrews(prev => prev.map(c => 
        c.id === 'crew-alpha' ? { ...c, status: 'Available', distance: 'Returning to Base' } : c
      ));
    }
  };

  const addAsset = () => {
    const newAsset = {
      id: `asset-${Date.now()}`,
      name: 'New Substation Beta',
      location: 'Sector 7 Expansion',
      type: 'Substation',
      temperature: 65,
      load: 45,
      vibration: 1.2,
      riskScore: 25,
      status: 'Normal',
      rank: assets.length + 1,
      failureRisk: 12,
      overallRisk: 15,
      code: 'SUB-BETA',
      priority: 'Normal',
      gridImpactScore: 40,
      weatherExposure: 'None'
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const resetSimulation = () => {
    setAssets(INITIAL_ASSETS);
    setTickets(INITIAL_MAINTENANCE);
    setCrews(CREW_UNITS);
    setResponseApproved(false);
  };

  return (
    <SimulationContext.Provider value={{
      assets,
      tickets,
      crews,
      weatherSectors,
      liveAlerts,
      responseApproved,
      approveResponsePlan,
      sendToMaintenance,
      generateRecommendation,
      completeMaintenanceTask,
      addAsset,
      resetSimulation,
      setTickets
    }}>
      {children}
    </SimulationContext.Provider>
  );
};
