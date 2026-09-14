import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Cpu, 
  Wrench, 
  Users,
  Zap
} from 'lucide-react';

export default function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Activity },
    { id: 'risk', label: 'Risk Analysis', icon: BarChart3 },
    { id: 'prediction', label: 'AI Prediction', icon: Cpu },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'crew', label: 'Crew Planning', icon: Users }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header matching screenshots */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Zap className="brand-icon" size={22} />
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-title">GridPulse AI</span>
            <span className="brand-version-badge">v2.4</span>
          </div>
          <span className="brand-subtitle">EE Final Project</span>
        </div>
      </div>

      {/* Academic Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">ACADEMIC NAVIGATION</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Model Accuracy Footer Box from screenshots */}
      <div className="sidebar-footer">
        <div className="model-accuracy-card">
          <div className="accuracy-header">
            <span className="acc-label">Model Accuracy</span>
            <span className="acc-val">94.8%</span>
          </div>
          <div className="acc-progress-bar">
            <div className="acc-progress-fill" style={{ width: '94.8%' }} />
          </div>
          <div className="accuracy-sub">
            <span>Random Forest</span>
            <span>F1: 0.92</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
