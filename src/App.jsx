import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GridProvider, useGrid } from './context/GridContext';
import LoginPage from './components/pages/LoginPage';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './components/pages/DashboardPage';
import AssetMonitoringPage from './components/pages/AssetMonitoringPage';
import RiskAnalysisPage from './components/pages/RiskAnalysisPage';
import AiPredictionPage from './components/pages/AiPredictionPage';
import MaintenancePage from './components/pages/MaintenancePage';
import CrewPlanningPage from './components/pages/CrewPlanningPage';
import AssetDetailPage from './components/pages/AssetDetailPage';
import ProjectMapPage from './components/pages/ProjectMapPage';

function AppContent() {
  const { user, isLoading, hasAccess } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const navigate = (page, assetId = null) => {
    setActivePage(page);
    if (assetId !== undefined) setSelectedAssetId(assetId);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
        Loading GridSentinel...
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const renderPage = () => {
    if (activePage === 'asset-detail' && selectedAssetId) {
      return <AssetDetailPage assetId={selectedAssetId} onBack={() => setActivePage('assets')} onNavigate={navigate} />;
    }
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={navigate} />;
      case 'assets': return <AssetMonitoringPage onViewAsset={(id) => navigate('asset-detail', id)} onNavigate={navigate} />;
      case 'risk': return hasAccess('risk') ? <RiskAnalysisPage onNavigate={navigate} /> : null;
      case 'prediction': return hasAccess('prediction') ? <AiPredictionPage onNavigate={navigate} /> : null;
      case 'maintenance': return hasAccess('maintenance') ? <MaintenancePage onNavigate={navigate} /> : null;
      case 'crew': return hasAccess('crew') ? <CrewPlanningPage onNavigate={navigate} /> : null;
      case 'map': return hasAccess('map') ? <ProjectMapPage onNavigate={navigate} /> : null;
      default: return <DashboardPage onNavigate={navigate} />;
    }
  };

  const pageTitle = {
    'dashboard': 'Overview Dashboard',
    'assets': 'Asset Monitoring',
    'asset-detail': 'Asset Detail',
    'risk': 'Risk Analysis',
    'prediction': 'AI Prediction',
    'maintenance': 'Maintenance Queue',
    'crew': 'Crew Planning',
    'map': 'Project Map'
  }[activePage] || 'GridSentinel';

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <div className="main-content">
        <TopNavbar pageTitle={pageTitle} onNavigate={navigate} />
        <main className={activePage === 'map' ? 'page-container-map' : 'page-container'}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GridProvider>
        <AppContent />
      </GridProvider>
    </AuthProvider>
  );
}

export default App;
