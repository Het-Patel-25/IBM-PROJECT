# GridSentinel AI ⚡🛡️
### Intelligent Power Grid Asset Monitoring & Failure Prediction System
> **IBM Bob AI Hackathon Submission** · Team: **Team Syntax** · Track: **AI**

[![Validate Submission](https://github.com/Het-Patel-25/IBM-PROJECT/actions/workflows/validate.yml/badge.svg)](https://github.com/Het-Patel-25/IBM-PROJECT/actions/workflows/validate.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?logo=mysql)
![Python](https://img.shields.io/badge/Python-scikit--learn-3776AB?logo=python)
![ML Accuracy](https://img.shields.io/badge/ML%20Accuracy-97.73%25-success)

---

## 👥 Team

| Field | Detail |
|---|---|
| **Team Name** | **Team Syntax** |
| **Track** | AI |
| **Lead** | Krish Kaneria (`krishkaneria9@gmail.com`) |
| **Member** | Het Patel (`het.patel@gridpulse.ai`) |
| **Repository** | [github.com/Het-Patel-25/IBM-PROJECT](https://github.com/Het-Patel-25/IBM-PROJECT) |

---

## 📌 Executive Summary

Modern power transmission and distribution (T&D) networks face increasing stress from aging assets, fluctuating renewable loads, and extreme weather events. **GridSentinel AI** is an enterprise-grade operational command center designed to transition utilities from reactive fire-fighting to proactive, predictive grid reliability.

Combining real-time IoT sensor telemetry, Dissolved Gas Analysis (DGA), AI risk modeling, and a geospatial digital-twin map, GridSentinel AI empowers grid operators, reliability engineers, and field technicians to detect anomalies weeks before catastrophic outages occur — all backed by a hardened MySQL + Sequelize backend with JWT authentication and role-based access control.

---

## 🎬 Project Deliverables

| Deliverable | Format | Access / Direct Link | Description |
|---|---|---|---|
| 🎥 **Video Demo** | Video Walkthrough | [**Watch Video on Google Drive**](https://drive.google.com/file/d/1rtmvM_DhnBSR7Lp-Rpp-pmLvf9YZi222/view?usp=sharing) | Full end-to-end demonstration of GridSentinel AI, live sensor telemetry, DGA, digital twin map, and maintenance dispatch |
| 📊 **Presentation** | PPTX Slide Deck | [**presentation/slides.pptx**](presentation/slides.pptx) <br> *(Source: [`presentation/IBM-BOB-PRESENTATION.pptx`](presentation/IBM-BOB-PRESENTATION.pptx))* | Hackathon pitch deck covering problem scope, system architecture, ML models, and market impact |
| 📸 **Screenshots** | High-Res Gallery | [**demo/screenshots/**](demo/screenshots/) <br> *(Local folder: [`screenshots/`](screenshots/))* | High-resolution UI screenshots of the running system and workflow |

### 📸 Application Screenshot Navigation

| # | Screen | Link | Description |
|:---:|---|---|---|
| **01** | **Login Experience** | [`01-login-page.png`](demo/screenshots/01-login-page.png) | High-tech auth with GridSentinel vector emblem & 1-click role logins |
| **02** | **Executive Dashboard** | [`02-dashboard-overview.png`](demo/screenshots/02-dashboard-overview.png) | Real-time fleet KPI metrics, critical assets, and automated audit trail |
| **03** | **Project Map & Blueprint** | [`03-project-map-blueprint.png`](demo/screenshots/03-project-map-blueprint.png) | Substation Alpha operational blueprint with AI weather risk alerts |
| **04** | **AI Remediation Plan** | [`04-ai-remediation-plan.png`](demo/screenshots/04-ai-remediation-plan.png) | 99% risk breakdown, failure contributors & direct work-order creation |
| **05** | **Add Asset Workflow** | [`05-add-asset-modal.png`](demo/screenshots/05-add-asset-modal.png) | Modal workflow for registering and configuring grid infrastructure |
| **06** | **Live CSV Export** | [`06-asset-registry-csv-export.png`](demo/screenshots/06-asset-registry-csv-export.png) | Asset registry with verified live CSV spreadsheet export download |

---

## 🎯 Key Features & Modules

### 1. 🛡️ Operational Command Dashboard
- **Fleet Telemetry Summary**: Live KPI tracking for total assets, critical health alerts, high-risk units, open maintenance tickets, and available field crews.
- **Incident Command Stream**: Real-time audit log tracking automated telemetry warnings, system triggers, and crew assignments.
- **Advisory Bar**: Instant alert marquee for inbound severe weather fronts and NERC CIP compliance advisories.

### 2. ⚡ Asset Monitoring & Registry
- **Comprehensive Fleet View**: High-voltage power transformers, distribution substations, circuit breakers, and underground feeder lines with full telemetry.
- **Health Scoring Engine**: Dynamic composite scores combining oil temperature, load percentage, vibration amplitude, dissolved hydrogen/acetylene ppm, and acoustic partial discharge.
- **Add Asset Modal**: In-app form to register new grid assets directly into the live registry without leaving the dashboard.
- **1-Click CSV Export**: Enterprise-grade reporting with UTF-8 BOM compatibility for instant analysis in Excel, Python, or external SCADA/GIS tools.

### 3. 🔎 Asset Detail View
- **Per-Asset Deep Dive**: Dedicated full-page drill-down for any selected asset showing composite health score, failure probability gauge, risk contributor breakdown, and all open/closed maintenance tickets.
- **Inline Incident Reporting**: Operators can submit field observations and severity flags directly from the asset detail view without switching pages.
- **Sensor Status Badges**: Colour-coded live readouts for every individual sensor channel (temperature, vibration, load, humidity, DGA ppm).

### 4. 🔬 AI Failure Prediction & Explainability
- **Multi-Input Sensor Scoring**: Machine learning ensemble evaluating failure probability using temperature, load percentage, vibration amplitude, humidity, and asset age.
- **Duval Triangle Method**: Automated DGA fault classification (Partial Discharge, Thermal Faults <300 °C / 300–700 °C / >700 °C, and High Energy Arcing).
- **Risk Attribution**: Factor breakdown revealing top contributors (combustible gas delta, winding overheating, ambient storm exposure).
- **Calibrated Formula Fallback**: If Python/scikit-learn is unavailable, a mathematically calibrated in-server scoring function produces equivalent risk results with no downtime.

### 5. 🗺️ Digital Twin Geospatial Project Map
- **Interactive Grid Topology (react-leaflet)**: Spatial visualisation of transmission lines, primary bulk substations, and distribution nodes on a real-world map layer.
- **Live OpenWeatherMap Radar Layers**: Real-time atmospheric integration — precipitation radar, temperature maps, cloud layer, and wind speed overlays toggled via a layer panel.
- **Dynamic Node Telemetry Drawer**: Select any substation node to view instant bus voltage, active load, telemetry health score, open ticket count, and current dispatch status.
- **Canvas Blueprint Mode**: Secondary 1 400 × 860 px schematic overlay for single-line diagram topology editing, with draggable node positions persisted to `localStorage`.

### 6. 🔧 Closed-Loop Maintenance & Crew Staging
- **Smart Work Order Generation**: Automated ticket creation from AI failure predictions, complete with NERC-compliant safety checklists and pre-filled technician notes.
- **Crew Planning Module**: Dedicated crew management page showing unit availability, dispatch status, and unassigned task queue with one-click crew assignment.
- **Field Technician Workflow**: Interactive checklist verification, technician note submission, and post-service health restoration tracking.

### 7. 🔑 Role-Based Access Control (RBAC)
Three enterprise personas with tailored operational views:

| Role | Persona | Email | Password | Access Scope |
|---|---|---|---|---|
| **Admin** | Ananya Sharma | `admin@voltguard.com` | `password123` | Full System Access (All Modules) |
| **Technician** | Rahul Verma | `tech@voltguard.com` | `password123` | Maintenance, Crew Planning, Asset Detail |
| **Viewer / Data Scientist** | Dr. Vikram Singh | `viewer@voltguard.com` | `password123` | Risk Analysis & AI Prediction (read-only) |

> Use the **1-click "Instant In"** button on any role card on the login screen for frictionless demo access.

---

## 🛠️ Architecture & Technology Stack

### Frontend

| Layer | Technology |
|---|---|
| **Framework** | React 19.2 + Vite 8.3 |
| **Routing & State** | React Context — `AuthContext`, `GridContext`, `SimulationContext` |
| **Map Engine** | react-leaflet 5 + Leaflet 1.9 + OpenWeatherMap tile API |
| **Styling** | Custom dark-mode CSS design system (HSL tokens, glassmorphism) |
| **Icons & Visuals** | Lucide React + custom `GridSentinelSymbol` SVG vector emblem |
| **Data Export** | Client-side CSV via `exportCsv.js` — UTF-8 BOM, auto-escaping, fallback |
| **Compliance** | NERC CIP-014, IEEE C57.104 (DGA Guide), IEC 60599 |

### Backend

| Layer | Technology |
|---|---|
| **Runtime** | Node.js + Express 4.21 |
| **Database** | MySQL 8 + Sequelize 6 ORM (auto-creates `voltguard_db` on first run) |
| **Auth** | JWT (`jsonwebtoken 9`) — Bearer token, 1-day expiry |
| **Password Hashing** | bcrypt 6 (salt rounds: 10, Sequelize `beforeCreate` / `beforeUpdate` hooks) |
| **ML Bridge** | `child_process.spawn` → `ml/predict.py`; formula fallback if Python absent |
| **Seeding** | `backend/seed.js` — idempotent DB init with users, assets, and maintenance records |

### Machine Learning

| Component | Detail |
|---|---|
| **Algorithm** | Random Forest Classifier (GridSearchCV-tuned) + Platt calibration |
| **Training Data** | 800-sample physics-informed simulated dataset (`ml/grid_sensor_dataset.csv`) |
| **Feature Set** | temperature (°C), load (%), vibration (mm/s), humidity (%), age (years) |
| **Accuracy** | **97.73%** cross-validated · ROC-AUC **0.9962** |
| **Standards** | IEC 60076 (transformer), ISO 10816 (vibration) |
| **Artefact** | Serialised model at `ml/model.joblib` (loaded at inference time) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18.0
- [MySQL](https://dev.mysql.com/downloads/) 8.0 running locally (default port 3306)
- Python 3.8+ with `scikit-learn`, `numpy`, `pandas`, `joblib` *(optional — formula fallback active if absent)*

---

### 1 — Frontend (React + Vite)

```bash
# Clone the repository
git clone https://github.com/Het-Patel-25/IBM-PROJECT.git
cd IBM-PROJECT

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

```bash
# Production build
npm run build
# Output: dist/
```

---

### 2 — Backend (Express + MySQL)

```bash
cd backend

# Install backend dependencies
npm install
```

The database credentials are hard-coded in `backend/config/db.js` for local development:

| Setting | Value |
|---|---|
| Host | `127.0.0.1` |
| User | `root` |
| Password | `Acpc@2025` |
| Database | `voltguard_db` (auto-created on start) |

> To use different credentials, edit `backend/config/db.js` before starting.

```bash
# Start the backend server (auto-seeds the database on first run)
npm run dev
# Server runs on http://localhost:5001
```

On startup, `backend/seed.js` will:
1. Auto-create the `voltguard_db` database if it doesn't exist.
2. Sync all Sequelize models (`force: true` — drops & re-creates tables).
3. Seed 3 users, 5 assets, and 2 maintenance records.

---

### 3 — ML Model (Python · optional)

```bash
cd ml

# (Optional) create a virtualenv
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install scikit-learn numpy pandas joblib

# Retrain the model (generates model.joblib)
python train.py

# Test a single prediction
python predict.py '{"temperature":95,"load":88,"vibration":4.2,"humidity":70,"age":18}'
```

If Python is unavailable, the backend automatically falls back to a calibrated formula-based scorer with identical risk thresholds.

---

## 📁 Project Structure

```
IBM-PROJECT/
├── public/
│   ├── favicon.svg                   # GridSentinel custom vector shield symbol
│   └── logo.jpg                      # Project brand mark
├── src/
│   ├── assets/
│   │   ├── grid_bg_1.jpg             # Dashboard hero background
│   │   ├── grid_bg_2.jpg
│   │   └── grid_bg_3.jpg
│   ├── components/
│   │   ├── common/
│   │   │   ├── AddAssetModal.jsx     # In-app asset registration form
│   │   │   ├── ArchitectureModal.jsx
│   │   │   ├── GridSentinelSymbol.jsx # Custom SVG shield-node matrix emblem
│   │   │   ├── IncidentReportModal.jsx
│   │   │   ├── NercAlertModal.jsx
│   │   │   └── WorkOrderModal.jsx
│   │   ├── modules/
│   │   │   ├── AssetTelemetryDGA.jsx
│   │   │   ├── GridSeverityRanking.jsx
│   │   │   ├── HistoricalMLTuning.jsx
│   │   │   └── ThreatOutageMatrix.jsx
│   │   ├── pages/
│   │   │   ├── AiPredictionPage.jsx
│   │   │   ├── AssetDetailPage.jsx   # Per-asset deep-dive with inline incident reporting
│   │   │   ├── AssetMonitoringPage.jsx
│   │   │   ├── CrewPlanningPage.jsx  # Crew availability, dispatch & task assignment
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx         # Role-selector with 1-click Instant In
│   │   │   ├── MaintenancePage.jsx
│   │   │   ├── ProjectMapPage.jsx    # react-leaflet digital twin + weather radar
│   │   │   └── RiskAnalysisPage.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopNavbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx           # JWT session management & role guards
│   │   ├── GridContext.jsx           # Central asset/ticket/crew state store
│   │   └── SimulationContext.jsx     # Simulation-mode asset & crew state provider
│   ├── data/
│   │   ├── assetsData.js
│   │   ├── crewStagingData.js
│   │   ├── gridSentinelData.js       # Master data + all AI computation functions
│   │   ├── historicalIncidents.js
│   │   ├── mockAssets.js
│   │   ├── telemetryStream.js
│   │   └── weatherFusionData.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── exportCsv.js              # UTF-8 BOM CSV export utility
│   │   └── formatters.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css                     # Full dark-mode design system (HSL tokens)
│   └── main.jsx
├── backend/
│   ├── config/
│   │   └── db.js                     # Sequelize + MySQL connection & DB auto-init
│   ├── models/
│   │   ├── Asset.js                  # Sequelize Asset model
│   │   ├── Maintenance.js            # Sequelize Maintenance model
│   │   └── User.js                   # Sequelize User model (bcrypt hooks, matchPassword)
│   ├── seed.js                       # Database seeding (users, assets, maintenance)
│   ├── server.js                     # Express API server (auth, assets, maintenance, ML)
│   └── package.json
├── ml/
│   ├── grid_sensor_dataset.csv       # 800-sample physics-informed training dataset
│   ├── model.joblib                  # Serialised trained Random Forest model
│   ├── predict.py                    # Inference script (stdin JSON → stdout JSON)
│   └── train.py                      # Training + GridSearchCV + Platt calibration
├── build_css.py                      # CSS design-system build helper
├── index.html
├── package.json
├── submission.yaml                   # Hackathon submission metadata
└── vite.config.js
```

---

## 🔌 API Reference

All protected endpoints require the header: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user, receive JWT token |
| `GET` | `/api/health` | Public | Backend health check |
| `GET` | `/api/assets` | ✅ | Fetch all assets (ordered by risk score DESC) |
| `GET` | `/api/assets/:id` | ✅ | Fetch single asset by ID |
| `POST` | `/api/assets` | ✅ | Register a new asset |
| `GET` | `/api/maintenance` | ✅ | Fetch all maintenance records |
| `POST` | `/api/maintenance` | ✅ | Create a new maintenance ticket |
| `PATCH` | `/api/maintenance/:id` | ✅ | Update maintenance status / technician |
| `POST` | `/api/predict` | ✅ | Run ML failure prediction (Python or formula fallback) |

---

## 🤖 IBM Bob AI Integration

IBM Bob AI was the primary development assistant throughout this project. Bob's contributions include:

- **Full RBAC architecture** — User model with role enum, JWT middleware (`protect`), and role-gated React routes
- **MySQL + Sequelize migration** — replacing MongoDB with Sequelize ORM, auto-DB-creation, and `beforeCreate` / `beforeUpdate` bcrypt hooks
- **Database seeding system** — idempotent `seed.js` initialising all three personas, 5 assets, and 2 maintenance records
- **ML model optimisation** — feature engineering from IEC 60076 / ISO 10816 standards, GridSearchCV tuning, Platt calibration, and 5-fold cross-validation methodology
- **GridContext & SimulationContext** — React context architecture for centralised asset/ticket/crew state with `localStorage` persistence
- **react-leaflet digital twin map** — live OpenWeatherMap tile layer integration and draggable node canvas
- **CSV export utility** — UTF-8 BOM robust export covering all edge cases for Excel/Python/GIS compatibility
- **UI design system** — HSL token-based dark-mode CSS with glassmorphism card components

---

## ⚠️ Known Limitations

| Area | Limitation |
|---|---|
| Telemetry | Data is physics-simulated — real SCADA/MQTT ingestion not implemented |
| Notifications | No email, SMS, or push alert delivery |
| JWT | No refresh token rotation — tokens expire after 24 hours |
| Database creds | Credentials hard-coded in `config/db.js` — use environment variables for production |
| Map | OpenWeatherMap API key is public demo key — rate-limited |
| Responsive | Dashboard optimised for ≥1 280 px screens; mobile is functional but unpolished |

---

## 📄 License & Attribution

Developed for the **IBM Bob AI Hackathon**. All rights reserved.
GridSentinel AI follows IEEE power equipment guidelines and NERC reliability frameworks.
