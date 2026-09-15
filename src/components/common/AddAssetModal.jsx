import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { X, Plus, Trash2 } from 'lucide-react';

const ASSET_TYPES = ['Power Transformer', 'Distribution Transformer', 'Substation', 'Circuit Breaker', 'Switchgear', 'Transmission Line', 'Generator', 'Feeder Line', 'Other'];
const SENSOR_TYPES = ['Temperature', 'Vibration', 'Partial Discharge', 'Oil Quality', 'Load', 'Voltage', 'Current', 'Humidity'];
const SENSOR_DEFAULTS = {
  Temperature: { unit: '°C', normalMin: 20, normalMax: 75, warningThreshold: 85, criticalThreshold: 95 },
  Vibration: { unit: 'mm/s', normalMin: 0, normalMax: 3.0, warningThreshold: 3.5, criticalThreshold: 5.0 },
  'Partial Discharge': { unit: 'pC', normalMin: 0, normalMax: 200, warningThreshold: 300, criticalThreshold: 600 },
  'Oil Quality': { unit: 'kV', normalMin: 45, normalMax: 70, warningThreshold: 35, criticalThreshold: 28 },
  Load: { unit: '%', normalMin: 0, normalMax: 80, warningThreshold: 80, criticalThreshold: 92 },
  Voltage: { unit: 'kV', normalMin: 0, normalMax: 140, warningThreshold: 145, criticalThreshold: 150 },
  Current: { unit: 'A', normalMin: 0, normalMax: 500, warningThreshold: 480, criticalThreshold: 500 },
  Humidity: { unit: '%', normalMin: 20, normalMax: 60, warningThreshold: 65, criticalThreshold: 80 }
};
const ZONES = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'];
const CRITICALITIES = ['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'];
const FACILITY_TYPES = ['Hospital', 'Emergency Services', 'Industrial Facility', 'Water Treatment', 'Data Center', 'Residential Area', 'Commercial Area'];

export default function AddAssetModal({ onClose }) {
  const { addAsset } = useGrid();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [sensors, setSensors] = useState([]);
  const [form, setForm] = useState({
    id: '', name: '', type: 'Power Transformer', manufacturer: '', model: '',
    serialNumber: '', installationDate: '', commissioningDate: '',
    status: 'Normal', location: '', latitude: '', longitude: '',
    zone: 'Zone 4', substation: '', capacityMVA: '', voltage: '',
    customersAffected: '', criticalFacilitiesList: [], criticalFacilities: 0,
    assetCriticality: 'P3 - Medium', age: '', priorFaults: 0,
    weatherExposure: 'Normal'
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const addSensor = () => {
    const type = SENSOR_TYPES[0];
    const defaults = SENSOR_DEFAULTS[type];
    setSensors(s => [...s, { id: `S-NEW-${Date.now()}`, type, currentValue: 0, ...defaults, lastUpdated: new Date().toISOString(), status: 'Normal' }]);
  };

  const updateSensor = (idx, key, val) => {
    setSensors(s => s.map((sensor, i) => {
      if (i !== idx) return sensor;
      if (key === 'type') {
        const defaults = SENSOR_DEFAULTS[val] || {};
        return { ...sensor, type: val, ...defaults };
      }
      return { ...sensor, [key]: key === 'currentValue' || key === 'warningThreshold' || key === 'criticalThreshold' ? parseFloat(val) || 0 : val };
    }));
  };

  const removeSensor = idx => setSensors(s => s.filter((_, i) => i !== idx));

  const validateStep1 = () => {
    const e = {};
    if (!form.id.trim()) e.id = 'Asset ID required';
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.location.trim()) e.location = 'Location required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validateStep1()) { setStep(1); return; }
    addAsset({
      ...form,
      capacityMVA: parseFloat(form.capacityMVA) || 0,
      customersAffected: parseInt(form.customersAffected) || 0,
      age: parseInt(form.age) || 0,
      priorFaults: parseInt(form.priorFaults) || 0,
      latitude: parseFloat(form.latitude) || 0,
      longitude: parseFloat(form.longitude) || 0,
      sensors,
      incidents: [],
      maintenanceHistory: []
    }, 'Admin');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-box-wide">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Add New Asset</h2>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
              Step {step} of 3 — {['', 'Basic Information', 'Grid Importance & Sensors', 'Review'][step]}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: n === step ? 'var(--color-accent)' : n < step ? 'var(--color-normal-bg)' : 'var(--bg-tertiary)',
                color: n === step ? 'white' : n < step ? 'var(--color-normal)' : 'var(--text-faint)',
                border: `1px solid ${n === step ? 'var(--color-accent)' : n < step ? 'var(--color-normal-border)' : 'var(--border-subtle)'}`
              }}>{n < step ? '✓' : n}</div>
              <span style={{ fontSize: 12, color: n === step ? 'var(--text-primary)' : 'var(--text-faint)' }}>
                {['', 'Basic Info', 'Grid & Sensors', 'Review'][n]}
              </span>
              {n < 3 && <div style={{ width: 24, height: 1, background: 'var(--border-subtle)' }} />}
            </div>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {step === 1 && (
            <div>
              <div className="form-section-title">Basic Information</div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label required">Asset ID</label>
                  <input className="form-input" placeholder="e.g. TR-105" value={form.id} onChange={e => set('id', e.target.value)} />
                  {errors.id && <div style={{ fontSize: 11, color: 'var(--color-critical)', marginTop: 4 }}>{errors.id}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label required">Asset Name</label>
                  <input className="form-input" placeholder="e.g. Transformer TR-105" value={form.name} onChange={e => set('name', e.target.value)} />
                  {errors.name && <div style={{ fontSize: 11, color: 'var(--color-critical)', marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label required">Asset Type</label>
                  <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                    {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option>Normal</option><option>Warning</option><option>High</option><option>Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Manufacturer</label>
                  <input className="form-input" placeholder="ABB India Ltd." value={form.manufacturer} onChange={e => set('manufacturer', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <input className="form-input" placeholder="OFAF-100/138" value={form.model} onChange={e => set('model', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Serial Number</label>
                  <input className="form-input" placeholder="SN-XXXX-TR" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age (years)</label>
                  <input type="number" className="form-input" placeholder="12" value={form.age} onChange={e => set('age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Installation Date</label>
                  <input type="date" className="form-input" value={form.installationDate} onChange={e => set('installationDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Commissioning Date</label>
                  <input type="date" className="form-input" value={form.commissioningDate} onChange={e => set('commissioningDate', e.target.value)} />
                </div>
              </div>

              <div className="form-section-title" style={{ marginTop: 8 }}>Location</div>
              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label required">Location Description</label>
                  <input className="form-input" placeholder="Pine Valley Substation Yard 3" value={form.location} onChange={e => set('location', e.target.value)} />
                  {errors.location && <div style={{ fontSize: 11, color: 'var(--color-critical)', marginTop: 4 }}>{errors.location}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="0.0001" className="form-input" placeholder="19.0760" value={form.latitude} onChange={e => set('latitude', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="0.0001" className="form-input" placeholder="72.8777" value={form.longitude} onChange={e => set('longitude', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="form-section-title">Grid Importance</div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Grid Zone</label>
                  <select className="form-input" value={form.zone} onChange={e => set('zone', e.target.value)}>
                    {ZONES.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Substation</label>
                  <input className="form-input" placeholder="Pine Valley Substation" value={form.substation} onChange={e => set('substation', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity (MVA)</label>
                  <input type="number" className="form-input" placeholder="100" value={form.capacityMVA} onChange={e => set('capacityMVA', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Voltage Level</label>
                  <input className="form-input" placeholder="138kV / 13.8kV" value={form.voltage} onChange={e => set('voltage', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Customers Served</label>
                  <input type="number" className="form-input" placeholder="50000" value={form.customersAffected} onChange={e => set('customersAffected', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Asset Criticality</label>
                  <select className="form-input" value={form.assetCriticality} onChange={e => set('assetCriticality', e.target.value)}>
                    {CRITICALITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Weather Exposure</label>
                  <select className="form-input" value={form.weatherExposure} onChange={e => set('weatherExposure', e.target.value)}>
                    <option>Normal</option><option>Moderate</option><option>Severe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prior Faults</label>
                  <input type="number" min="0" className="form-input" value={form.priorFaults} onChange={e => set('priorFaults', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Critical Facilities Served</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {FACILITY_TYPES.map(f => {
                      const selected = form.criticalFacilitiesList.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          className={`filter-btn ${selected ? 'active' : ''}`}
                          onClick={() => {
                            const list = selected ? form.criticalFacilitiesList.filter(x => x !== f) : [...form.criticalFacilitiesList, f];
                            set('criticalFacilitiesList', list);
                            set('criticalFacilities', list.length);
                          }}
                        >{f}</button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="form-section-title" style={{ marginTop: 8 }}>Sensor Configuration</div>
              {sensors.map((s, idx) => (
                <div key={s.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, marginBottom: 12, position: 'relative' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => removeSensor(idx)}
                  >
                    <Trash2 size={13} color="var(--color-critical)" />
                  </button>
                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Type</label>
                      <select className="form-input" value={s.type} onChange={e => updateSensor(idx, 'type', e.target.value)}>
                        {SENSOR_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Current Value</label>
                      <input type="number" className="form-input" value={s.currentValue} onChange={e => updateSensor(idx, 'currentValue', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Warning Threshold</label>
                      <input type="number" className="form-input" value={s.warningThreshold} onChange={e => updateSensor(idx, 'warningThreshold', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Critical Threshold</label>
                      <input type="number" className="form-input" value={s.criticalThreshold} onChange={e => updateSensor(idx, 'criticalThreshold', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={addSensor}>
                <Plus size={13} /> Add Sensor
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="form-section-title">Review Asset</div>
              <div className="grid-2">
                {[
                  ['Asset ID', form.id], ['Name', form.name], ['Type', form.type],
                  ['Location', form.location], ['Zone', form.zone], ['Capacity', `${form.capacityMVA} MVA`],
                  ['Voltage', form.voltage], ['Customers', form.customersAffected?.toLocaleString()],
                  ['Age', `${form.age} years`], ['Criticality', form.assetCriticality]
                ].map(([label, val]) => (
                  <div key={label} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>{val || '—'}</div>
                  </div>
                ))}
              </div>
              {sensors.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="form-section-title">Sensors ({sensors.length})</div>
                  {sensors.map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      {s.type}: {s.currentValue}{s.unit} (Warning: {s.warningThreshold}, Critical: {s.criticalThreshold})
                    </div>
                  ))}
                </div>
              )}
              <div className="alert-banner info" style={{ marginTop: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>AI Prediction will be automatically generated</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Based on sensor readings, weather, and asset data, the system will immediately compute a risk score and recommendations.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {step < 3
            ? <button className="btn btn-primary" onClick={() => { if (step === 1 && !validateStep1()) return; setStep(s => s + 1); }}>Next →</button>
            : <button className="btn btn-primary" onClick={handleSubmit}>Create Asset</button>
          }
        </div>
      </div>
    </div>
  );
}
