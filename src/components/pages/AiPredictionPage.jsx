import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  RotateCcw,
  Wrench,
  HelpCircle,
  Zap
} from 'lucide-react';
import { predictRisk } from '../../services/api';
import { getRiskLevel } from '../../data/mockAssets';

export default function AiPredictionPage({ initialValues, onOpenMaintenance }) {
  // Form input state
  const [formData, setFormData] = useState({
    temperature: 75,
    load: 65,
    vibration: 2.5,
    humidity: 55,
    age: 12
  });

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // If navigated with initialValues from another page, load them
  useEffect(() => {
    if (initialValues) {
      setFormData({
        temperature: initialValues.temperature || 75,
        load: initialValues.load || 65,
        vibration: initialValues.vibration || 2.5,
        humidity: initialValues.humidity || 55,
        age: initialValues.age || 12
      });
      // Automatically run prediction on prefilled data
      handlePredict({
        temperature: initialValues.temperature || 75,
        load: initialValues.load || 65,
        vibration: initialValues.vibration || 2.5,
        humidity: initialValues.humidity || 55,
        age: initialValues.age || 12
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handlePredict = async (customData) => {
    const dataToPredict = customData || formData;
    setLoading(true);
    try {
      const result = await predictRisk(dataToPredict);
      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Preset scenarios for fast college project testing
  const presets = [
    {
      name: 'Safe Feeder (Normal)',
      data: { temperature: 48, load: 38, vibration: 1.1, humidity: 45, age: 5 },
      tag: 'Normal'
    },
    {
      name: 'Afternoon Peak (Warning)',
      data: { temperature: 72, load: 68, vibration: 2.6, humidity: 55, age: 12 },
      tag: 'Warning'
    },
    {
      name: 'Degraded Insulation (High)',
      data: { temperature: 84, load: 81, vibration: 3.7, humidity: 78, age: 20 },
      tag: 'High'
    },
    {
      name: 'Critical Overheat (Critical)',
      data: { temperature: 98, load: 94, vibration: 4.9, humidity: 65, age: 19 },
      tag: 'Critical'
    }
  ];

  const applyPreset = (presetData) => {
    setFormData(presetData);
    handlePredict(presetData);
  };

  const resultRisk = predictionResult ? getRiskLevel(predictionResult.failureProbability) : null;

  return (
    <div className="ai-prediction-page">
      {/* Intro Banner */}
      <div className="card prediction-intro-card">
        <div className="intro-icon-box">
          <Cpu size={28} />
        </div>
        <div>
          <h2 className="card-title">AI Grid Failure Risk Prediction Model</h2>
          <p className="card-subtitle">
            Enter sensor measurements below to evaluate asset failure probability using our trained Machine Learning classification model.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout: Form on Left, Result on Right */}
      <div className="prediction-grid">
        {/* Left Column: Form & Presets */}
        <div className="card prediction-form-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Asset Sensor Input Parameters</h3>
              <p className="card-subtitle">Adjust the 5 core telemetry variables</p>
            </div>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setFormData({ temperature: 70, load: 60, vibration: 2.0, humidity: 50, age: 10 })}
              title="Reset to default values"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="presets-section">
            <span className="presets-label">Quick Test Scenarios:</span>
            <div className="preset-buttons-row">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  className="preset-btn"
                  onClick={() => applyPreset(preset.data)}
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePredict();
            }}
            className="prediction-form"
          >
            {/* 1. Temperature */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="temperature">Operating Temperature (°C)</label>
                <span className="input-range-badge">{formData.temperature}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="130"
                step="1"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="range-slider"
              />
              <div className="slider-limits">
                <span>Safe: 20–70°C</span>
                <span className="text-warning">Warning: 71–85°C</span>
                <span className="text-danger">Critical: &gt;85°C</span>
              </div>
            </div>

            {/* 2. Load */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="load">Grid Load Percentage (%)</label>
                <span className="input-range-badge">{formData.load}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="1"
                id="load"
                name="load"
                value={formData.load}
                onChange={handleChange}
                className="range-slider"
              />
              <div className="slider-limits">
                <span>Nominal: 10–70%</span>
                <span className="text-warning">High: 71–85%</span>
                <span className="text-danger">Overload: &gt;85%</span>
              </div>
            </div>

            {/* 3. Vibration */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="vibration">Vibration Velocity (mm/s)</label>
                <span className="input-range-badge">{formData.vibration} mm/s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                id="vibration"
                name="vibration"
                value={formData.vibration}
                onChange={handleChange}
                className="range-slider"
              />
              <div className="slider-limits">
                <span>Normal: &lt;2.5 mm/s</span>
                <span className="text-warning">Moderate: 2.5–3.5 mm/s</span>
                <span className="text-danger">Severe: &gt;3.5 mm/s</span>
              </div>
            </div>

            {/* 4. Humidity */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="humidity">Relative Humidity (%)</label>
                <span className="input-range-badge">{formData.humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                id="humidity"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="range-slider"
              />
              <div className="slider-limits">
                <span>Low: 10–40%</span>
                <span>Moderate: 40–70%</span>
                <span className="text-warning">High: &gt;70%</span>
              </div>
            </div>

            {/* 5. Asset Age */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="age">Asset Age in Service (Years)</label>
                <span className="input-range-badge">{formData.age} yrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="range-slider"
              />
              <div className="slider-limits">
                <span>New: 1–8 yrs</span>
                <span>Mid-Life: 9–18 yrs</span>
                <span className="text-warning">Aging: &gt;18 yrs</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button 
              type="submit" 
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small" />
                  <span>Computing Model Prediction...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Predict Failure Risk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Result Card */}
        <div className="prediction-result-column">
          {predictionResult ? (
            <div className="card prediction-result-card">
              <div className="result-header">
                <span className="result-header-tag">PREDICTION OUTPUT</span>
                <span className={`status-badge status-${resultRisk.level.toLowerCase()}`}>
                  Risk Level: {resultRisk.level.toUpperCase()}
                </span>
              </div>

              {/* Big Score Gauge */}
              <div className="probability-display-box">
                <div className="prob-label">Failure Probability</div>
                <div className={`prob-value text-${resultRisk.level.toLowerCase()}`}>
                  {predictionResult.failureProbability}%
                </div>
                {/* Progress bar */}
                <div className="prob-progress-bar">
                  <div 
                    className={`prob-fill fill-${resultRisk.level.toLowerCase()}`}
                    style={{ width: `${predictionResult.failureProbability}%` }}
                  />
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="result-details-section">
                {/* Possible Failure */}
                <div className="result-detail-item">
                  <div className="detail-item-label">
                    <AlertTriangle size={16} />
                    <span>Possible Failure</span>
                  </div>
                  <div className="detail-item-value highlight-problem">
                    {predictionResult.possibleFailure}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="result-detail-item">
                  <div className="detail-item-label">
                    <CheckCircle2 size={16} />
                    <span>Recommendation</span>
                  </div>
                  <div className="detail-item-value highlight-rec">
                    {predictionResult.recommendation}
                  </div>
                </div>

                {/* ML Model Source */}
                <div className="model-source-footer">
                  <span className="source-label">Model:</span>
                  <span className="source-name">{predictionResult.modelUsed || 'GridPulse Random Forest Classifier'}</span>
                </div>
              </div>

              {/* Maintenance Dispatch Action if Risk > 40% */}
              {predictionResult.failureProbability > 40 && (
                <div className="ticket-dispatch-box">
                  <p className="dispatch-hint">
                    Risk exceeds nominal boundary. Would you like to create a maintenance ticket?
                  </p>
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => onOpenMaintenance(
                      'AI Simulated Asset',
                      predictionResult.possibleFailure,
                      resultRisk.level
                    )}
                  >
                    <Wrench size={16} />
                    <span>Create Maintenance Ticket</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card empty-result-card">
              <div className="empty-icon-wrapper">
                <Sparkles size={36} />
              </div>
              <h3 className="empty-title">Awaiting Telemetry Input</h3>
              <p className="empty-desc">
                Select sensor values on the left and click "Predict Failure Risk" to compute asset failure probability.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => handlePredict()}
              >
                Run Baseline Evaluation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
