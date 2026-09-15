# Source Code — GridPulse AI

## Structure

```
src/                            ← React 19 frontend (Vite)
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx       ← Login form + 2FA TOTP step
│   │   ├── SignupPage.jsx      ← Signup with role selector
│   │   └── TwoFactorSetupModal.jsx  ← In-app QR code 2FA setup
│   ├── pages/
│   │   ├── DashboardPage.jsx   ← Main overview dashboard
│   │   ├── AssetMonitoringPage.jsx  ← Per-asset telemetry deep-dive
│   │   ├── AiPredictionPage.jsx     ← ML prediction studio
│   │   ├── MaintenancePage.jsx      ← Work orders + crew planning
│   │   ├── RiskAnalysisPage.jsx     ← Grid severity ranking
│   │   └── AdminPanelPage.jsx       ← User management (admin only)
│   ├── modules/
│   │   ├── AssetTelemetryDGA.jsx    ← DGA dissolved gas analysis
│   │   ├── GridSeverityRanking.jsx  ← Threat-outage matrix
│   │   ├── HistoricalMLTuning.jsx   ← Historical model tuning view
│   │   ├── CrewPrePositioning.jsx   ← Spatial crew staging
│   │   ├── ThreatOutageMatrix.jsx   ← Criticality heatmap
│   │   └── WeatherSevereFusion.jsx  ← Weather + risk overlay
│   └── common/
│       ├── ArchitectureModal.jsx    ← System architecture modal
│       ├── DuvalTriangle.jsx        ← DGA Duval Triangle chart
│       ├── FFTHarmonicsChart.jsx    ← FFT frequency analysis
│       ├── IncidentReportModal.jsx  ← Incident report form
│       ├── NercAlertModal.jsx       ← NERC compliance alert
│       ├── PRPDScatterPlot.jsx      ← Partial discharge scatter
│       ├── ThermalCurveChart.jsx    ← Thermal aging curve
│       ├── ThreatRadarCanvas.jsx    ← Multi-axis threat radar
│       └── WorkOrderModal.jsx       ← Work order creation
├── context/
│   └── AuthContext.jsx         ← JWT auth state, login/signup/2FA, can()/canAccessPage()
├── services/
│   └── api.js                  ← All backend API calls (Bearer token auto-attached)
├── data/
│   ├── mockAssets.js           ← Rich strategic asset data (offline fallback)
│   ├── assetsData.js           ← Asset telemetry seed data
│   ├── crewStagingData.js      ← Crew pre-positioning mock data
│   ├── historicalIncidents.js  ← Historical failure events
│   ├── telemetryStream.js      ← Simulated live telemetry
│   └── weatherFusionData.js    ← Weather event data
└── utils/
    ├── calculations.js         ← Risk score calculations
    └── formatters.js           ← Date, number, status formatters

backend/                        ← Express REST API
├── models/
│   ├── User.js                 ← User schema (RBAC, 2FA, bcrypt)
│   ├── Asset.js                ← Grid asset schema
│   └── Maintenance.js         ← Work order schema
├── routes/
│   └── auth.js                 ← All auth endpoints (signup, login, 2FA, user CRUD)
├── middleware/
│   └── auth.js                 ← requireAuth, requireRole, requirePermission, applyAssetScope
├── config/
│   └── permissions.js          ← RBAC permission matrix (3 roles × N permissions)
├── .env.example                ← Environment variable template
└── server.js                   ← Express app, all protected API routes

ml/                             ← Python ML pipeline
├── train.py                    ← Dataset generation, feature engineering, RF training, full validation
├── predict.py                  ← Inference script (feature-aware, dict artifact support)
├── model.joblib                ← Trained RF artifact {model, feature_cols, metrics}
├── validation_report.json      ← Full test set + CV metrics
└── grid_sensor_dataset.csv     ← 1,500-sample physics-informed dataset
```

## Key Design Decisions

- No TypeScript (kept simple for rapid hackathon development)
- No external CSS framework (custom design system in `src/index.css`)  
- All source in `src/` (frontend) and `backend/` — template-compliant layout
- ML inference as a child process (not a separate service) — simpler to run locally
