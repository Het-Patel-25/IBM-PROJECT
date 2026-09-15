import React from 'react';
import { useAuth } from '../context/AuthContext';
import GridSentinelSymbol from './common/GridSentinelSymbol';
import {
  Radio,
  Plus,
  Bell,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ShieldCheck
} from 'lucide-react';

export default function Header({
  forecastHorizon = 'Next 6h',
  onSelectForecastHorizon,
  theme = 'light',
  onToggleTheme,
  soundEnabled = true,
  onToggleSound,
  onOpenNercAlert,
  onOpenIncidentReport
}) {
  const { user } = useAuth();

  return (
    <header className="eoc-header">
      {/* Brand & Command Center Tag */}
      <div className="header-brand">
        <div className="brand-logo-icon" style={{ background: 'transparent', padding: 0 }}>
          <GridSentinelSymbol size={26} glow={true} />
        </div>
        <div className="brand-title-wrap">
          <div className="brand-title">
            GridSentinel <span className="accent">AI</span>
          </div>
          <span className="brand-subtitle">T&amp;D OPERATIONAL COMMAND (EOC)</span>
        </div>
      </div>

      {/* Center Warning Marquee Pill */}
      <div className="header-advisory-pill">
        <span className="pulsing-dot" />
        <span>STATUS: ADVISORY ELEVATED — HURRICANE / SEVERE FRONT INBOUND</span>
      </div>

      {/* Forecast Horizon Selector Group */}
      <div className="forecast-selector-group">
        {[
          { key: 'Next 6h', label: 'Next 6h' },
          { key: '24h Forecast', label: '24h Forecast' },
          { key: '72h Storm Mode', label: '72h Storm Mode' },
          { key: '7-Day Pred', label: '7-Day Pred' }
        ].map((item) => (
          <button
            key={item.key}
            className={`forecast-btn ${forecastHorizon === item.key ? 'active' : ''}`}
            onClick={() => onSelectForecastHorizon && onSelectForecastHorizon(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Controls & User Profile */}
      <div className="header-actions">
        <button className="header-btn" onClick={onOpenIncidentReport}>
          <Plus size={13} /> Plan
        </button>

        <button className="header-btn" onClick={onOpenNercAlert} style={{ color: '#fb7185', borderColor: 'rgba(225, 29, 72, 0.4)' }}>
          <Radio size={13} /> NERC
        </button>

        {/* Audio Toggle */}
        <button
          className="header-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Alert audio enabled' : 'Alert audio muted'}
          style={{ padding: '0.35rem 0.45rem' }}
        >
          {soundEnabled ? <Volume2 size={14} color="#38bdf8" /> : <VolumeX size={14} color="#94a3b8" />}
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          className="header-btn"
          onClick={onToggleTheme}
          title="Toggle Command Center Theme"
          style={{ padding: '0.35rem 0.45rem' }}
        >
          {theme === 'dark' ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#94a3b8" />}
        </button>

        {/* User Profile */}
        <div className="header-user-profile">
          <div className="user-avatar">
            {user?.role === 'admin' ? 'AS' : user?.role === 'technician' ? 'RV' : user?.role === 'viewer' ? 'VS' : 'VG'}
          </div>
          <div className="user-text-wrap">
            <span className="user-name">
              {user?.role === 'admin' ? 'Ananya Sharma' : 
               user?.role === 'technician' ? 'Rahul Verma' : 
               user?.role === 'viewer' ? 'Dr. Vikram Singh' : 'Loading...'}
            </span>
            <span className="user-role">
              {user?.role === 'admin' ? 'Grid Operations Director' : 
               user?.role === 'technician' ? 'Lead Field Technician' : 
               user?.role === 'viewer' ? 'Data Scientist' : ''}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
