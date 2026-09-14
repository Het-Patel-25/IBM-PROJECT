import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './components/pages/DashboardPage';
import AssetMonitoringPage from './components/pages/AssetMonitoringPage';
import RiskAnalysisPage from './components/pages/RiskAnalysisPage';
import AiPredictionPage from './components/pages/AiPredictionPage';
import MaintenancePage from './components/pages/MaintenancePage';
import ArchitectureModal from './components/common/ArchitectureModal';

import { 
  getAssets, 
  getMaintenance, 
  checkBackendHealth 
} from './services/api';
import { STRATEGIC_ASSETS, LIVE_ALERTS } from './data/mockAssets';

export default function App() {
  // Navigation State: 'dashboard' | 'assets' | 'risk' | 'prediction' | 'maintenance' | 'crew'
  const [activePage, setActivePage] = useState('dashboard');
  
  // Data States
  const [assets, setAssets] = useState(STRATEGIC_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState('pv-tx-001');
  const [alerts, setAlerts] = useState(LIVE_ALERTS);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [predictionPrefill, setPredictionPrefill] = useState(null);

  // Sync initial assets from backend if available
  useEffect(() => {
    getAssets().then((backendAssets) => {
      if (backendAssets && backendAssets.length >= 5) {
        // Merge or maintain rich fields
        setAssets((prev) => {
          // Keep rich strategic assets and augment if needed
          return prev;
        });
      }
    }).catch(() => {});
  }, []);

  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
    setActivePage('assets');
  };

  const handleNavigateToPrediction = (asset) => {
    if (asset) {
      setPredictionPrefill({
        temperature: asset.temperature,
        load: asset.load,
        vibration: asset.vibration,
        humidity: 65,
        age: asset.age,
        assetName: asset.name
      });
    }
    setActivePage('prediction');
  };

  return (
    <div className="academic-app-container">
      {/* 1. Left Academic Sidebar */}
      <Sidebar 
        activePage={activePage === 'crew' ? 'maintenance' : activePage} 
        onNavigate={(page) => setActivePage(page)} 
      />

      {/* 2. Main Content Body */}
      <div className="academic-main-pane">
        {/* Top Navbar matching screenshots */}
        <TopNavbar 
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onNavigate={(page) => setActivePage(page)}
          alertsCount={alerts.length}
        />

        {/* Dynamic Page Views */}
        <main className="academic-page-content">
          {activePage === 'dashboard' && (
            <DashboardPage 
              assets={assets}
              onSelectAsset={handleSelectAsset}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'assets' && (
            <AssetMonitoringPage 
              assets={assets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'risk' && (
            <RiskAnalysisPage 
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {/* AI Prediction Studio preserved exactly as requested! */}
          {activePage === 'prediction' && (
            <AiPredictionPage 
              initialValues={predictionPrefill}
              onOpenMaintenance={(assetName, problem, priority) => {
                setActivePage('maintenance');
              }}
            />
          )}

          {(activePage === 'maintenance' || activePage === 'crew') && (
            <MaintenancePage 
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Architecture & ML Specs Modal */}
      <ArchitectureModal 
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
