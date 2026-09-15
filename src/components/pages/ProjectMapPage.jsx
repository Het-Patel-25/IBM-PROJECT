import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayerGroup, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGrid } from '../../context/GridContext';
import { useAuth } from '../../context/AuthContext';
import { computeSensorStatus } from '../../data/gridSentinelData';
import {
  Search, Layers, Filter, Edit2, Target, Eye, Save, X, ZoomIn, ZoomOut,
  Map, Grid, Users, AlertTriangle, Activity, CloudRain, Crosshair, Plus,
  Wrench, ChevronRight, Shield, Wind, Thermometer, Zap, RefreshCw, Check,
  Radio, Siren, RotateCcw, Info, MapPin
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const WEATHER_API_KEY = '546ecaf191b70ac37dd68236ddff4721';
const OWM_TILE = (layer) =>
  `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`;

const CANVAS_W = 1400;
const CANVAS_H = 860;

const ASSET_TYPE_ICONS = {
  'Power Transformer': '⚡',
  'Distribution Transformer': '⚡',
  'Substation': '▣',
  'Circuit Breaker': '▤',
  'Switchgear': '◈',
  'Feeder Line': '━',
  'Transmission Line': '━',
  'Generator': '◎',
  'Other': '●',
};

const STATUS_COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Warning: '#eab308',
  Normal: '#22c55e',
};

const DEFAULT_ZONES = [
  { id: 'z1', label: 'Transformer Area',   x: 100, y: 80,  w: 380, h: 260, color: 'rgba(239,68,68,0.06)' },
  { id: 'z2', label: 'Switchgear Bay',     x: 520, y: 80,  w: 360, h: 200, color: 'rgba(234,179,8,0.06)' },
  { id: 'z3', label: 'Control Room',       x: 920, y: 80,  w: 420, h: 180, color: 'rgba(59,130,246,0.06)' },
  { id: 'z4', label: 'Feeder Corridor',    x: 920, y: 380, w: 420, h: 260, color: 'rgba(34,197,94,0.06)' },
  { id: 'z5', label: 'Emergency Bay',      x: 100, y: 600, w: 380, h: 200, color: 'rgba(168,85,247,0.06)' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function assetStatusColor(asset) {
  return STATUS_COLORS[asset.status] || '#6b7280';
}

function SetView({ center, zoom }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom]);
  return null;
}

// ── Asset Detail Panel ────────────────────────────────────────────────────────
function AssetPanel({ asset, onClose, onNavigate, tickets, crews, onCreateTask }) {
  if (!asset) return null;
  const color = assetStatusColor(asset);
  const openTicket = tickets.find(
    t => t.assetId === asset.id && !['Completed', 'Cancelled'].includes(t.status)
  );
  const assignedCrew = openTicket ? crews.find(c => c.id === openTicket.assignedCrew) : null;

  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, width: 296, zIndex: 1000,
      background: 'var(--bg-secondary)',
      border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 10,
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', marginBottom: 2 }}>{asset.id} · {asset.type}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{asset.name}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}15`, padding: '2px 8px', borderRadius: 4, border: `1px solid ${color}30` }}>{asset.status}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 2 }}><X size={14} /></button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        {[
          { l: 'Health', v: `${asset.healthScore}/100`, c: asset.healthScore >= 70 ? 'var(--color-normal)' : asset.healthScore >= 50 ? 'var(--color-warning)' : 'var(--color-critical)' },
          { l: 'Risk', v: `${asset.overallRisk}/100`, c: color },
          { l: 'Failure', v: `${asset.failureProbability}%`, c: color },
          { l: 'Impact', v: `${asset.gridImpact}/100`, c: 'var(--text-primary)' },
        ].map(m => (
          <div key={m.l} style={{ textAlign: 'center', padding: '7px 4px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>{m.l}</div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-mono)', color: m.c, letterSpacing: '-0.5px' }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Health bar */}
      <div style={{ padding: '6px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${asset.healthScore}%`, background: asset.healthScore >= 70 ? 'var(--color-normal)' : asset.healthScore >= 50 ? 'var(--color-warning)' : 'var(--color-critical)', borderRadius: 2, transition: 'width 400ms ease' }} />
        </div>
      </div>

      {/* Sensors */}
      {asset.sensors?.length > 0 && (
        <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Live Sensors</div>
          {asset.sensors.slice(0, 4).map(s => {
            const st = computeSensorStatus(s);
            const sc = { Critical: 'var(--color-critical)', Warning: 'var(--color-warning)', Normal: 'var(--color-normal)' }[st];
            return (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.type}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: sc }}>
                  {s.currentValue}{s.unit} {st !== 'Normal' ? '⚠' : '✓'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Maintenance */}
      {openTicket && (
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(239,68,68,0.04)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Active Task</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{openTicket.id} · {openTicket.priority} · {openTicket.status}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Crew: {assignedCrew ? assignedCrew.name : 'Unassigned'}</div>
        </div>
      )}

      {/* Recent incident */}
      {asset.incidents?.length > 0 && (
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Latest Incident</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{asset.incidents[asset.incidents.length - 1]?.description}</div>
        </div>
      )}

      {/* Weather */}
      <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>Zone Weather</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: asset.weather.risk === 'Severe' ? 'var(--color-critical)' : asset.weather.risk === 'Moderate' ? 'var(--color-warning)' : 'var(--color-normal)' }}>
          {asset.weather.condition} · {asset.weather.risk} · {asset.weather.wind} km/h
        </div>
      </div>

      {/* AI Recommendation snippet */}
      {asset.recommendation?.actions?.length > 0 && (
        <div style={{ padding: '7px 14px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(59,130,246,0.04)' }}>
          <div style={{ fontSize: 9, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>AI Priority Action</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{asset.recommendation.actions[0]}</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('asset-detail', asset.id)}>
            <Activity size={11} /> Detail
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('prediction')}>
            <Zap size={11} /> AI
          </button>
        </div>
        {!openTicket ? (
          <button className="btn btn-danger btn-sm btn-block" onClick={() => onCreateTask(asset.id)}>
            <Wrench size={11} /> Create Maintenance Task
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm btn-block" onClick={() => onNavigate('maintenance')}>
            <Wrench size={11} /> View Maintenance
          </button>
        )}
      </div>
    </div>
  );
}

// ── AI Recommendation Map Banner ───────────────────────────────────────────────
function AIRecommendationBanner({ assets, weatherData, onNavigate }) {
  const criticalWithSevereWeather = assets.filter(a => {
    const w = weatherData[a.zone];
    return (a.status === 'Critical' || a.status === 'High') && w?.risk === 'Severe';
  });

  if (criticalWithSevereWeather.length === 0) return null;
  const top = criticalWithSevereWeather[0];

  return (
    <div style={{
      position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1001, background: 'rgba(239,68,68,0.12)',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: 10, padding: '12px 20px', minWidth: 440, maxWidth: 600,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-critical)', marginBottom: 4 }}>
            AI WEATHER-RISK ALERT — {criticalWithSevereWeather.length} Assets Affected
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Severe weather approaching <strong>{top.zone}</strong>. High-risk asset{' '}
            <strong style={{ color: 'var(--color-critical)' }}>{top.id}</strong> ({top.failureProbability}% failure prob.) is exposed.
            Recommend immediate crew pre-positioning.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-danger btn-sm" onClick={() => onNavigate('crew')}>
              Pre-position Crew
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('maintenance')}>
              View Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Incident Response Mode Overlay ────────────────────────────────────────────
function IncidentResponseOverlay({ assets, tickets, crews, weatherData, onNavigate, onExit }) {
  const criticalAssets = assets.filter(a => a.status === 'Critical' || a.status === 'High');
  const openTickets = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status));
  const availableCrews = crews.filter(c => c.status === 'Available');
  const weatherAlerts = Object.entries(weatherData).filter(([, w]) => w.risk === 'Severe');

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{ background: 'rgba(239,68,68,0.15)', borderBottom: '1px solid rgba(239,68,68,0.3)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}>
            <style>{`@keyframes pulse-red { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }`}</style>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse-red 1s infinite' }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', letterSpacing: 1, textTransform: 'uppercase' }}>
            🚨 Incident Response Mode
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onExit}>
          <X size={14} /> Exit Response Mode
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, padding: 24 }}>
        {/* Critical Assets */}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>
            Critical Assets ({criticalAssets.length})
          </div>
          {criticalAssets.map(a => (
            <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
              onClick={() => onNavigate('asset-detail', a.id)}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{a.name}</div>
              <div style={{ fontSize: 10, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{a.id} · Risk {a.overallRisk}/100 · {a.failureProbability}% fail</div>
            </div>
          ))}
          {criticalAssets.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>No critical assets</div>}
        </div>

        {/* Weather Events */}
        <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>
            Weather Alerts ({weatherAlerts.length})
          </div>
          {weatherAlerts.map(([zone, w]) => (
            <div key={zone} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{zone}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.condition} · {w.wind} km/h · {w.rain}mm</div>
              <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>⚠ Severe Risk</div>
            </div>
          ))}
          {weatherAlerts.length === 0 && (
            <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {Object.entries(weatherData).slice(0, 3).map(([zone, w]) => (
                <div key={zone} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{zone}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.condition} · {w.risk}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Maintenance */}
        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-high)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>
            Open Tasks ({openTickets.length})
          </div>
          {openTickets.slice(0, 5).map(t => (
            <div key={t.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
              onClick={() => onNavigate('maintenance')}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-high)' }}>{t.id} · {t.priority}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{t.assetName}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {t.status} · {t.assignedCrewName || 'Unassigned'}
              </div>
            </div>
          ))}
        </div>

        {/* Available Crews */}
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>
            Available Crews ({availableCrews.length})
          </div>
          {availableCrews.map(c => (
            <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.techCount} techs · {c.currentDepot}</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{c.skills?.slice(0, 2).join(', ')}</div>
            </div>
          ))}
          {availableCrews.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>All crews dispatched</div>}
          <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12 }} onClick={() => onNavigate('crew')}>
            <Users size={12} /> Open Crew Planning
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{ margin: '0 24px 24px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 700 }}>
          ⚡ AI Recommended Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {criticalAssets.slice(0, 3).map((a, i) => (
            <div key={a.id} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-critical)', marginBottom: 6 }}>{a.name}</div>
              {a.recommendation?.actions?.slice(0, 2).map((action, j) => (
                <div key={j} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '3px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 6 }}>
                  <span style={{ color: 'var(--text-faint)' }}>{j + 1}.</span>{action}
                </div>
              ))}
            </div>
          ))}
          {criticalAssets.length === 0 && (
            <div style={{ gridColumn: '1/-1', fontSize: 13, color: 'var(--text-muted)' }}>
              No critical assets detected. System operating normally.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Blueprint Map ──────────────────────────────────────────────────────────────
function BlueprintMap({
  assets, mapPositions, pendingPositions, setPendingPositions,
  selectedAsset, onSelectAsset, editMode, layers, filters, showHeatmap, focusMode, tickets
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  const effectivePositions = { ...mapPositions, ...pendingPositions };

  const assetsWithPos = useMemo(() => assets.map((a, idx) => {
    const pos = effectivePositions[a.id] || {
      x: 150 + (idx % 5) * 240,
      y: 100 + Math.floor(idx / 5) * 200
    };
    return { ...a, mapX: pos.x, mapY: pos.y };
  }), [assets, effectivePositions]);

  const visibleAssets = useMemo(() => assetsWithPos.filter(a => {
    if (focusMode && a.status !== 'Critical' && a.status !== 'High') return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(a.status)) return false;
    return true;
  }), [assetsWithPos, focusMode, filters]);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setScale(Math.min(width / CANVAS_W, height / CANVAS_H, 1));
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const toCanvas = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: (clientX - rect.left - pan.x) / scale, y: (clientY - rect.top - pan.y) / scale };
  };

  const handleMouseDown = (e, assetId) => {
    if (!editMode) return;
    e.stopPropagation();
    const asset = assetsWithPos.find(a => a.id === assetId);
    const { x, y } = toCanvas(e.clientX, e.clientY);
    setDragging({ assetId, offsetX: x - asset.mapX, offsetY: y - asset.mapY });
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const nx = Math.max(20, Math.min(CANVAS_W - 60, x - dragging.offsetX));
      const ny = Math.max(20, Math.min(CANVAS_H - 60, y - dragging.offsetY));
      setPendingPositions(prev => ({ ...prev, [dragging.assetId]: { x: nx, y: ny } }));
    } else if (isPanning && panStart) {
      setPan({ x: panStart.panX + e.clientX - panStart.x, y: panStart.panY + e.clientY - panStart.y });
    }
  }, [dragging, isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setIsPanning(false);
    setPanStart(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef}
      style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0a', cursor: editMode ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      onMouseDown={e => { if (editMode && !dragging) { setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }); } }}
      onClick={() => onSelectAsset(null)}
    >
      <svg
        width={CANVAS_W * scale} height={CANVAS_H * scale}
        style={{ position: 'absolute', top: pan.y, left: pan.x, userSelect: 'none' }}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5" />
          </pattern>
          <filter id="heatGlow"><feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.6)" /></filter>
        </defs>

        {/* Background */}
        <rect width={CANVAS_W} height={CANVAS_H} fill="#0d0d0d" />
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />
        <rect width={CANVAS_W} height={CANVAS_H} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" rx="6" />

        {/* Substation border */}
        <rect x="40" y="50" width={CANVAS_W - 80} height={CANVAS_H - 60} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" rx="8" strokeDasharray="8 4" />
        <text x={CANVAS_W / 2} y={34} textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="13" fontFamily="'Inter',sans-serif" fontWeight="700" letterSpacing="5">
          SUBSTATION ALPHA — OPERATIONAL BLUEPRINT
        </text>

        {/* Zones */}
        {DEFAULT_ZONES.map(z => (
          <g key={z.id}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" rx="4" strokeDasharray="5 3" />
            <text x={z.x + 10} y={z.y + 18} fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="'Inter',sans-serif" fontWeight="700" letterSpacing="1.5">
              {z.label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Risk Heatmap */}
        {showHeatmap && visibleAssets.map(a => (
          <circle key={`heat-${a.id}`} cx={a.mapX} cy={a.mapY}
            r={70 + (a.overallRisk / 100) * 60}
            fill={`${assetStatusColor(a)}10`} filter="url(#heatGlow)" />
        ))}

        {/* Connection lines */}
        {layers.connections && (() => {
          const transformers = visibleAssets.filter(a => a.type.includes('Transformer'));
          const substations = visibleAssets.filter(a => a.type === 'Substation' || a.type === 'Switchgear');
          return transformers.map(t => {
            const s = substations[0];
            if (!s) return null;
            return <line key={`conn-${t.id}`} x1={t.mapX} y1={t.mapY} x2={s.mapX} y2={s.mapY}
              stroke="rgba(59,130,246,0.18)" strokeWidth="1.5" strokeDasharray="7 3" />;
          });
        })()}

        {/* Incident markers */}
        {layers.incidents && visibleAssets.filter(a => a.incidents?.length > 0).map(a => (
          <g key={`inc-${a.id}`}>
            <rect x={a.mapX + 24} y={a.mapY - 38} width={52} height={18} rx="3" fill="rgba(234,179,8,0.15)" stroke="rgba(234,179,8,0.4)" strokeWidth="0.8" />
            <text x={a.mapX + 50} y={a.mapY - 26} textAnchor="middle" fill="#eab308" fontSize="9" fontFamily="'Inter',sans-serif" fontWeight="700">
              {a.incidents.length} INC
            </text>
          </g>
        ))}

        {/* Asset markers */}
        {layers.assets && visibleAssets.map(a => {
          const color = assetStatusColor(a);
          const isSelected = selectedAsset?.id === a.id;
          const hasOpenTicket = tickets.some(t => t.assetId === a.id && !['Completed', 'Cancelled'].includes(t.status));
          const icon = ASSET_TYPE_ICONS[a.type] || '●';
          const r = isSelected ? 27 : 21;

          return (
            <g key={a.id} style={{ cursor: 'pointer' }}
              onMouseDown={e => handleMouseDown(e, a.id)}
              onClick={e => { if (!dragging) { e.stopPropagation(); onSelectAsset(selectedAsset?.id === a.id ? null : a); } }}
            >
              {/* Pulse ring for critical */}
              {(a.status === 'Critical') && (
                <circle cx={a.mapX} cy={a.mapY} r={r + 14} fill="none" stroke={color} strokeWidth="1" opacity="0.25">
                  <animate attributeName="r" values={`${r + 8};${r + 18};${r + 8}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Selection ring */}
              {isSelected && <circle cx={a.mapX} cy={a.mapY} r={r + 6} fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />}

              {/* Circle body */}
              <circle cx={a.mapX} cy={a.mapY} r={r}
                fill={`${color}16`} stroke={color} strokeWidth={isSelected ? 2.5 : 1.5}
                filter={a.status === 'Critical' ? 'url(#shadow)' : undefined} />

              {/* Icon */}
              <text x={a.mapX} y={a.mapY + 1} textAnchor="middle" dominantBaseline="middle"
                fill={color} fontSize="15" style={{ userSelect: 'none' }}>{icon}</text>

              {/* Maintenance indicator dot */}
              {hasOpenTicket && (
                <circle cx={a.mapX + r - 3} cy={a.mapY - r + 3} r="5.5"
                  fill="#f97316" stroke="#0a0a0a" strokeWidth="1.5" />
              )}

              {/* ID label */}
              <rect x={a.mapX - 26} y={a.mapY + r + 4} width="52" height="15" rx="3" fill="rgba(0,0,0,0.75)" />
              <text x={a.mapX} y={a.mapY + r + 14} textAnchor="middle"
                fill="rgba(255,255,255,0.88)" fontSize="8.5" fontFamily="'JetBrains Mono',monospace" fontWeight="600">
                {a.id}
              </text>

              {/* Risk badge */}
              {a.overallRisk >= 55 && (
                <>
                  <rect x={a.mapX - 14} y={a.mapY + r + 21} width="28" height="12" rx="2"
                    fill={`${color}22`} stroke={`${color}44`} strokeWidth="0.5" />
                  <text x={a.mapX} y={a.mapY + r + 30} textAnchor="middle"
                    fill={color} fontSize="7.5" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
                    {a.overallRisk}%
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Crew icons near assigned assets */}
        {layers.crews && visibleAssets.map(a => {
          const ticket = tickets.find(t => t.assetId === a.id && t.assignedCrew && !['Completed', 'Cancelled'].includes(t.status));
          if (!ticket) return null;
          return (
            <g key={`crew-${a.id}`}>
              <circle cx={a.mapX + 34} cy={a.mapY - 14} r="9"
                fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.2" />
              <text x={a.mapX + 34} y={a.mapY - 14} textAnchor="middle" dominantBaseline="middle"
                fontSize="10">🔧</text>
            </g>
          );
        })}
      </svg>

      {/* Zoom Controls */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 10 }}>
        <button className="btn btn-secondary btn-icon" onClick={() => setScale(s => Math.min(2, s + 0.12))} title="Zoom In"><ZoomIn size={14} /></button>
        <button className="btn btn-secondary btn-icon" onClick={() => setScale(s => Math.max(0.3, s - 0.12))} title="Zoom Out"><ZoomOut size={14} /></button>
        <button className="btn btn-secondary btn-icon" onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} title="Reset"><Crosshair size={14} /></button>
      </div>

      {editMode && (
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(234,179,8,0.14)', border: '1px solid rgba(234,179,8,0.4)', color: '#eab308', padding: '5px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, zIndex: 10, pointerEvents: 'none' }}>
          ✏ Edit Mode — Drag assets to reposition
        </div>
      )}
    </div>
  );
}

// ── Geo Map ────────────────────────────────────────────────────────────────────
function GeoMap({ assets, selectedAsset, onSelectAsset, layers, filters, focusMode, tickets, liveWeather }) {
  const center = useMemo(() => {
    const lats = assets.map(a => a.latitude).filter(Boolean);
    const lngs = assets.map(a => a.longitude).filter(Boolean);
    if (!lats.length) return [19.076, 72.877];
    return [lats.reduce((a, b) => a + b) / lats.length, lngs.reduce((a, b) => a + b) / lngs.length];
  }, [assets]);

  const visible = useMemo(() => assets.filter(a => {
    if (!a.latitude || !a.longitude) return false;
    if (focusMode && a.status !== 'Critical' && a.status !== 'High') return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(a.status)) return false;
    return true;
  }), [assets, focusMode, filters]);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer center={center} zoom={11} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        {/* Dark base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
        />
        {/* OWM Weather tiles */}
        {layers.weather && (
          <LayerGroup>
            <TileLayer url={OWM_TILE('precipitation_new')} opacity={0.55} />
            <TileLayer url={OWM_TILE('wind_new')} opacity={0.3} />
          </LayerGroup>
        )}
        <SetView center={center} zoom={11} />

        {/* Asset markers */}
        {layers.assets && visible.map(asset => {
          const color = assetStatusColor(asset);
          const isSelected = selectedAsset?.id === asset.id;
          const hasTicket = tickets.some(t => t.assetId === asset.id && !['Completed', 'Cancelled'].includes(t.status));
          const r = isSelected ? 18 : asset.status === 'Critical' ? 14 : 10;

          return (
            <CircleMarker key={asset.id}
              center={[asset.latitude, asset.longitude]} radius={r}
              pathOptions={{ color: isSelected ? '#ffffff' : color, fillColor: color, fillOpacity: 0.75, weight: isSelected ? 3 : 2 }}
              eventHandlers={{ click: () => onSelectAsset(selectedAsset?.id === asset.id ? null : asset) }}
            >
              <Popup>
                <div style={{ fontFamily: 'sans-serif', fontSize: 12, minWidth: 170 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{asset.name}</div>
                  <div>Status: <strong style={{ color }}>{asset.status}</strong></div>
                  <div>Risk: {asset.overallRisk}/100 · Failure: {asset.failureProbability}%</div>
                  <div>Grid Impact: {asset.gridImpact}/100</div>
                  {hasTicket && <div style={{ color: '#f97316', marginTop: 4, fontWeight: 600 }}>⚠ Maintenance Active</div>}
                  {asset.incidents?.length > 0 && <div style={{ color: '#eab308', fontWeight: 600 }}>{asset.incidents.length} Incident(s)</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Live Weather Panel */}
      {liveWeather && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(10,10,10,0.9)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', minWidth: 190, backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: 9, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>🌐 OpenWeatherMap Live</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{liveWeather.weather?.[0]?.main}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{liveWeather.weather?.[0]?.description}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>🌡 {Math.round(liveWeather.main?.temp || 0)}°C</span>
            <span>💨 {Math.round((liveWeather.wind?.speed || 0) * 3.6)} km/h</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4 }}>{liveWeather.name}</div>
        </div>
      )}

      {/* Geo map legend */}
      <div style={{ position: 'absolute', bottom: 16, left: 12, zIndex: 1000, background: 'rgba(10,10,10,0.88)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
        <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Status</div>
        {[['Critical', '#ef4444'], ['High', '#f97316'], ['Warning', '#eab308'], ['Normal', '#22c55e']].map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />{s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Project Map Page ──────────────────────────────────────────────────────
export default function ProjectMapPage({ onNavigate }) {
  const { assets, tickets, crews, mapPositions, saveMapPositions, addAudit, dashboardStats, weatherData, createMaintenanceTask } = useGrid();
  const { user } = useAuth();

  const [mapMode, setMapMode] = useState('blueprint');
  const [editMode, setEditMode] = useState(false);
  const [pendingPositions, setPendingPositions] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [incidentResponseMode, setIncidentResponseMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [liveWeather, setLiveWeather] = useState(null);
  const [lastSync, setLastSync] = useState(new Date());
  const [layers, setLayers] = useState({ assets: true, risk: true, weather: true, crews: true, incidents: true, connections: false });
  const [filters, setFilters] = useState({ statuses: [] });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch live weather
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=19.076&lon=72.877&appid=${WEATHER_API_KEY}&units=metric`);
        if (res.ok) { setLiveWeather(await res.json()); setLastSync(new Date()); }
      } catch { /* demo mode */ }
    };
    fetch_();
    const iv = setInterval(fetch_, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setLastSync(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(assets.filter(a => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)).slice(0, 6));
  }, [searchQuery, assets]);

  const handleSaveLayout = () => {
    saveMapPositions({ ...mapPositions, ...pendingPositions });
    addAudit(`Map layout saved — ${Object.keys(pendingPositions).length} positions updated`, user?.name || 'Admin', 'map');
    setPendingPositions({});
    setEditMode(false);
  };

  const handleCreateTask = (assetId) => {
    createMaintenanceTask(assetId, user?.name || 'Admin');
    onNavigate('maintenance');
  };

  const toggleLayer = k => setLayers(l => ({ ...l, [k]: !l[k] }));
  const toggleStatus = s => setFilters(f => ({
    ...f, statuses: f.statuses.includes(s) ? f.statuses.filter(x => x !== s) : [...f.statuses, s]
  }));

  const criticalCount = assets.filter(a => a.status === 'Critical').length;
  const weatherAlertZones = Object.entries(weatherData).filter(([, w]) => w.risk === 'Severe');
  const maintenanceActive = tickets.filter(t => !['Completed', 'Cancelled'].includes(t.status)).length;
  const hasPendingChanges = Object.keys(pendingPositions).length > 0;
  const syncAgo = Math.round((Date.now() - lastSync.getTime()) / 60000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Top Bar ── */}
      <div style={{ height: 52, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', flexShrink: 0, zIndex: 100 }}>
        {/* Project selector */}
        <Map size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
        <select style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, padding: '4px 8px', fontWeight: 600 }}>
          <option>Substation Alpha — Zone 4</option>
          <option>Westside Industrial Grid</option>
          <option>Harbor Point Marine</option>
        </select>

        <div style={{ width: 1, height: 22, background: 'var(--border-default)' }} />

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-tertiary)', padding: 2, borderRadius: 6 }}>
          {[{ id: 'blueprint', label: '⊞ Blueprint' }, { id: 'geo', label: '🌍 Geo Map' }].map(m => (
            <button key={m.id} onClick={() => setMapMode(m.id)} style={{ padding: '4px 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: mapMode === m.id ? 'var(--color-accent)' : 'transparent', color: mapMode === m.id ? 'white' : 'var(--text-muted)', transition: 'all 150ms ease' }}>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: 'var(--border-default)' }} />

        {/* Search */}
        <div style={{ position: 'relative', width: 210 }}>
          <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
          <input style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, padding: '4px 8px 4px 26px', fontFamily: 'var(--font-sans)' }}
            placeholder="Search asset..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 6, boxShadow: 'var(--shadow-lg)', zIndex: 300, marginTop: 2 }}>
              {searchResults.map(a => (
                <div key={a.id} onClick={() => { setSelectedAsset(a); setSearchQuery(''); setSearchResults([]); }}
                  style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>{a.id} · {a.zone}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: assetStatusColor(a) }}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Tools */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <button className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowHeatmap(!showHeatmap)}>
            🌡 Heatmap
          </button>
          <button className={`btn btn-sm ${focusMode ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setFocusMode(!focusMode)}>
            <Target size={12} /> Focus
          </button>
          <button className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={12} /> Filter
          </button>
          <button className="btn btn-sm" onClick={() => setIncidentResponseMode(true)}
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}>
            🚨 Response Mode
          </button>

          <div style={{ width: 1, height: 22, background: 'var(--border-default)' }} />

          {!editMode ? (
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(true)}>
              <Edit2 size={12} /> Edit Map
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-success btn-sm" disabled={!hasPendingChanges} onClick={handleSaveLayout}>
                <Save size={12} /> Save {hasPendingChanges ? `(${Object.keys(pendingPositions).length})` : ''}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPendingPositions({}); setEditMode(false); }}>
                <X size={12} /> Discard
              </button>
            </div>
          )}
        </div>

        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', border: '1px solid var(--border-subtle)', borderRadius: 100, fontSize: 11, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-normal)', display: 'block' }} />
          <span style={{ color: 'var(--text-faint)' }}>LIVE · {syncAgo === 0 ? 'just now' : `${syncAgo}m ago`}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left panel */}
        <div style={{ width: 210, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', overflow: 'auto', flexShrink: 0 }}>
          {/* Layers */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Layers</div>
            {[
              { key: 'assets', label: 'Assets', icon: '●' },
              { key: 'risk', label: 'Risk Heatmap', icon: '🌡' },
              { key: 'weather', label: 'Weather (OWM)', icon: '🌧' },
              { key: 'crews', label: 'Crew Positions', icon: '🔧' },
              { key: 'incidents', label: 'Incident Markers', icon: '⚠' },
              { key: 'connections', label: 'Power Lines', icon: '━' },
            ].map(l => (
              <label key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={layers[l.key]} onChange={() => toggleLayer(l.key)} style={{ accentColor: 'var(--color-accent)', width: 12, height: 12 }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l.icon} {l.label}</span>
              </label>
            ))}
          </div>

          {/* Status filters */}
          {showFilters && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Filter Status</div>
              {['Critical', 'High', 'Warning', 'Normal'].map(s => {
                const col = STATUS_COLORS[s];
                const active = filters.statuses.length === 0 || filters.statuses.includes(s);
                return (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 0', cursor: 'pointer' }}>
                    <input type="checkbox" checked={active} onChange={() => toggleStatus(s)} style={{ accentColor: col, width: 12, height: 12 }} />
                    <span style={{ fontSize: 11, color: col, fontWeight: 600 }}>{s}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-faint)', marginLeft: 'auto' }}>{assets.filter(a => a.status === s).length}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Weather alerts */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Weather Alerts</div>
            {weatherAlertZones.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>No severe alerts</div>
            ) : weatherAlertZones.map(([zone, w]) => (
              <div key={zone} style={{ marginBottom: 7, padding: 8, background: 'var(--color-critical-bg)', borderRadius: 6, border: '1px solid var(--color-critical-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-critical)' }}>🌩 {zone}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{w.condition} · {w.wind} km/h</div>
              </div>
            ))}
            {liveWeather && (
              <div style={{ marginTop: 6, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 9, color: 'var(--color-accent)', fontWeight: 700, marginBottom: 4 }}>🌐 OWM Live</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{liveWeather.weather?.[0]?.main}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{Math.round(liveWeather.main?.temp)}°C · {Math.round((liveWeather.wind?.speed || 0) * 3.6)} km/h</div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ padding: '12px 14px', flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>Legend</div>
            {[['⚡', 'Transformer'], ['▣', 'Substation'], ['◈', 'Switchgear'], ['▤', 'Circuit Breaker'], ['━', 'Feeder Line']].map(([i, l]) => (
              <div key={l} style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 0', display: 'flex', gap: 7 }}>
                <span>{i}</span><span>{l}</span>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              {[['Critical', '#ef4444'], ['High', '#f97316'], ['Warning', '#eab308'], ['Normal', '#22c55e']].map(([s, c]) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />{s}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316', display: 'inline-block', flexShrink: 0 }} />🔧 Crew Active
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308', display: 'inline-block', flexShrink: 0 }} />⚠ Incidents
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
          {mapMode === 'blueprint' ? (
            <BlueprintMap
              assets={assets} mapPositions={mapPositions}
              pendingPositions={pendingPositions} setPendingPositions={setPendingPositions}
              selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset}
              editMode={editMode} layers={layers} filters={filters}
              showHeatmap={showHeatmap} focusMode={focusMode} tickets={tickets}
            />
          ) : (
            <GeoMap
              assets={assets} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset}
              layers={layers} filters={filters} focusMode={focusMode}
              tickets={tickets} liveWeather={liveWeather}
            />
          )}

          {/* Asset Info Panel */}
          {selectedAsset && (
            <AssetPanel
              asset={assets.find(a => a.id === selectedAsset.id) || selectedAsset}
              onClose={() => setSelectedAsset(null)}
              onNavigate={onNavigate}
              tickets={tickets} crews={crews}
              onCreateTask={handleCreateTask}
            />
          )}

          {/* AI Weather-Risk Banner */}
          {!selectedAsset && (
            <AIRecommendationBanner assets={assets} weatherData={weatherData} onNavigate={onNavigate} />
          )}

          {/* Focus mode banner */}
          {focusMode && (
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444', padding: '5px 16px', borderRadius: 100, fontSize: 11, fontWeight: 700, zIndex: 20, display: 'flex', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
              <Target size={12} /> Focus Mode — Critical & High Risk only · {criticalCount} critical
            </div>
          )}

          {/* Incident Response Mode Overlay */}
          {incidentResponseMode && (
            <IncidentResponseOverlay
              assets={assets} tickets={tickets} crews={crews}
              weatherData={weatherData} onNavigate={onNavigate}
              onExit={() => setIncidentResponseMode(false)}
            />
          )}
        </div>
      </div>

      {/* ── Bottom Stats ── */}
      <div style={{ height: 42, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {[
          { label: 'Total Assets', val: dashboardStats.totalAssets, color: 'var(--text-secondary)' },
          { label: 'Critical', val: dashboardStats.criticalAssets, color: '#ef4444' },
          { label: 'High Risk', val: dashboardStats.highRiskAssets, color: '#f97316' },
          { label: 'Open Tasks', val: maintenanceActive, color: '#eab308' },
          { label: 'Crews Active', val: dashboardStats.activeCrews, color: 'var(--color-accent)' },
          { label: 'Weather Alerts', val: weatherAlertZones.length, color: weatherAlertZones.length > 0 ? '#ef4444' : '#22c55e' },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center', padding: '0 6px', borderRight: i < 5 ? '1px solid var(--border-subtle)' : 'none', height: '100%' }}>
            <span style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
