import React from 'react';
import {
  Zap,
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
  return (
    <header className="eoc-header">
      {/* Brand & Command Center Tag */}
      <div className="header-brand">
        <div className="brand-logo-icon">
          <Zap size={18} />
        </div>
        <div className="brand-title-wrap">
          <div className="brand-title">
            GridPulse <span className="accent">AI</span>
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
            KV
          </div>
          <div className="user-text-wrap">
            <span className="user-name">Dir. K. Vance</span>
            <span className="user-role">EOC Shift Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
