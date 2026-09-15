import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import TwoFactorSetupModal from './components/auth/TwoFactorSetupModal';

import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './components/pages/DashboardPage';
import AssetMonitoringPage from './components/pages/AssetMonitoringPage';
import RiskAnalysisPage from './components/pages/RiskAnalysisPage';
import AiPredictionPage from './components/pages/AiPredictionPage';
import MaintenancePage from './components/pages/MaintenancePage';
import AdminPanelPage from './components/pages/AdminPanelPage';
import ArchitectureModal from './components/common/ArchitectureModal';

import { getAssets, getMaintenance, checkBackendHealth } from './services/api';
import { STRATEGIC_ASSETS, LIVE_ALERTS } from './data/mockAssets';

// ─── Inner app — rendered only when authenticated ────────────────────────────
function AuthenticatedApp() {
  const { user, canAccessPage, can } = useAuth();

  const [activePage, setActivePage]           = useState('dashboard');
  const [assets, setAssets]                   = useState(STRATEGIC_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState('pv-tx-001');
  const [alerts, setAlerts]                   = useState(LIVE_ALERTS);
  const [isArchitectureOpen, setIsArchOpen]   = useState(false);
  const [predictionPrefill, setPredPrefill]   = useState(null);
  const [show2FASetup, setShow2FASetup]        = useState(false);

  // Prompt 2FA setup once after first login if not enabled
  useEffect(() => {
    if (user && !user.twoFactorEnabled) {
      const dismissed = sessionStorage.getItem('gp_2fa_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShow2FASetup(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  useEffect(() => {
    getAssets().then((backendAssets) => {
      if (backendAssets && backendAssets.length >= 5) {
        // Keep rich strategic assets
        setAssets(prev => prev);
      }
    }).catch(() => {});
  }, []);

  // Guard navigation: silently redirect to dashboard if role lacks access
  const handleNavigate = (page) => {
    if (canAccessPage(page)) {
      setActivePage(page);
    } else {
      setActivePage('dashboard');
    }
  };

  const handleSelectAsset = (assetId) => {
    setSelectedAssetId(assetId);
    handleNavigate('assets');
  };

  const handleNavigateToPrediction = (asset) => {
    if (!can('canRunPrediction')) return;
    if (asset) {
      setPredPrefill({
        temperature: asset.temperature,
        load: asset.load,
        vibration: asset.vibration,
        humidity: 65,
        age: asset.age,
        assetName: asset.name
      });
    }
    handleNavigate('prediction');
  };

  return (
    <div className="academic-app-container">
      <Sidebar
        activePage={activePage === 'crew' ? 'maintenance' : activePage}
        onNavigate={handleNavigate}
      />

      <div className="academic-main-pane">
        <TopNavbar
          onOpenArchitecture={() => setIsArchOpen(true)}
          onNavigate={handleNavigate}
          alertsCount={alerts.length}
          onOpenProfile={() => setShow2FASetup(true)}
        />

        <main className="academic-page-content">
          {activePage === 'dashboard' && (
            <DashboardPage
              assets={assets}
              onSelectAsset={handleSelectAsset}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'assets' && canAccessPage('assets') && (
            <AssetMonitoringPage
              assets={assets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'risk' && canAccessPage('risk') && (
            <RiskAnalysisPage onNavigate={handleNavigate} />
          )}

          {activePage === 'prediction' && canAccessPage('prediction') && (
            <AiPredictionPage
              initialValues={predictionPrefill}
              onOpenMaintenance={() => handleNavigate('maintenance')}
            />
          )}

          {(activePage === 'maintenance' || activePage === 'crew') && canAccessPage('maintenance') && (
            <MaintenancePage onOpenArchitecture={() => setIsArchOpen(true)} />
          )}

          {activePage === 'admin' && canAccessPage('admin') && (
            <AdminPanelPage />
          )}

          {/* Access denied fallback */}
          {!canAccessPage(activePage) && activePage !== 'dashboard' && (
            <div className="access-denied-page">
              <div className="access-denied-card">
                <div className="access-denied-icon">🔒</div>
                <h2>Access Restricted</h2>
                <p>Your role <strong>{user?.role}</strong> does not have permission to access this page.</p>
                <button className="auth-submit-btn" onClick={() => setActivePage('dashboard')}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {show2FASetup && (
        <TwoFactorSetupModal
          onClose={() => {
            setShow2FASetup(false);
            sessionStorage.setItem('gp_2fa_dismissed', '1');
          }}
          onComplete={() => {
            setShow2FASetup(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Root app — handles auth state routing ───────────────────────────────────
function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p>Loading GridPulse AI…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <SignupPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToSignup={() => setAuthView('signup')} />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
