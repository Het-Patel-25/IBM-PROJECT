import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  BookOpen, 
  User, 
  Zap,
  Activity
} from 'lucide-react';

export default function TopNavbar({ 
  onOpenArchitecture, 
  onNavigate, 
  alertsCount = 4 
}) {
  const [currentTime, setCurrentTime] = useState('March 30, 2026 - 14:32 EST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleString('en-US', options).replace(',', ' -'));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="academic-topbar">
      {/* Brand Header */}
      <div className="topbar-brand">
        <div className="topbar-logo-box">
          <Zap size={18} />
        </div>
        <div>
          <h2 className="topbar-title">GridPulse AI</h2>
          <p className="topbar-sub">College AI Project • ML Outage Prediction</p>
        </div>
      </div>

      {/* Simulation Active Pill (Center) */}
      <div className="topbar-center">
        <div className="simulation-status-pill">
          <div className="pulse-dot-blue" />
          <span>Simulation Active • 25 Grid Assets Monitored • Random Forest ML Model Ready</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        {/* Time */}
        <div className="topbar-time">
          <Clock size={14} className="text-muted" />
          <span>{currentTime}</span>
        </div>

        {/* System Architecture & ML Specs Modal Trigger */}
        <button 
          className="btn-spec-trigger"
          onClick={onOpenArchitecture}
          title="View Viva System Architecture and MongoDB Schemas"
        >
          <BookOpen size={15} />
          <span>System Architecture &amp; ML Specs</span>
        </button>

        {/* Alerts Bell */}
        <button 
          className="topbar-icon-btn"
          onClick={() => onNavigate('dashboard')}
          title="Active Alerts"
        >
          <Bell size={17} />
          {alertsCount > 0 && <span className="topbar-badge">{alertsCount}</span>}
        </button>

        {/* User Avatar */}
        <div className="topbar-avatar" title="Student Evaluator / Admin">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
