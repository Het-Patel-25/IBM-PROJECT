# GridSentinel AI ⚡🛡️
### Intelligent Power Grid Asset Monitoring & Failure Prediction System
> **IBM Project / Hackathon Initiative** — Real-time sensor telemetry, AI-driven failure prediction, Duval Gas Analysis, and closed-loop maintenance dispatch for mission-critical electrical infrastructure.

---

## 📌 Executive Summary

Modern power transmission and distribution (T&D) networks face increasing stress from aging assets, fluctuating renewable loads, and extreme weather events. **GridSentinel AI** is an enterprise-grade operational command center designed to transition utilities from reactive fire-fighting to proactive, predictive grid reliability.

Combining real-time IoT sensor telemetry, Dissolved Gas Analysis (DGA), AI risk modeling, and geospatial digital-twin mapping, GridSentinel AI empowers grid operators, reliability engineers, and field technicians to detect anomalies weeks before catastrophic outages occur.

---

## 🎯 Key Features & Modules

### 1. 🛡️ Operational Command Dashboard
* **Fleet Telemetry Summary**: Live KPI tracking for total assets, critical health alerts, high-risk units, open maintenance tickets, and available field crews.
* **Incident Command Stream**: Real-time audit log tracking automated telemetry warnings, system triggers, and crew assignments.
* **Advisory Bar**: Instant alert marquee for inbound severe weather fronts and NERC CIP compliance advisories.

### 2. ⚡ Asset Monitoring & Registry
* **Comprehensive Fleet View**: High-voltage power transformers, distribution substations, circuit breakers, and underground feeder lines.
* **Health Scoring & Telemetry**: Dynamic calculations combining oil temperature, load percentage, vibration amplitude, dissolved hydrogen/acetylene ppm, and acoustic partial discharge.
* **1-Click CSV Export**: Enterprise-grade CSV reporting with UTF-8 BOM compatibility for instant analysis in Excel, Python, or external SCADA/GIS tools.

### 3. 🔬 AI Failure Prediction & Explainability
* **Multi-Modal AI Diagnostics**: Machine learning ensemble (XGBoost + LSTM) evaluating failure probability over 24-hour and 7-day forecast horizons.
* **Duval Triangle Method**: Automated DGA fault classification (Partial Discharge, Thermal Faults <300°C / 300-700°C / >700°C, and High Energy Arcing).
* **SHAP / Risk Attribution**: Factor breakdown revealing exact contributors (e.g., Combustible Gas Delta +42%, Winding Overheating +28%, Ambient Storm Front +18%).

### 4. 🗺️ Digital Twin Geospatial Project Map
* **Interactive Grid Topology**: Spatial visualization of transmission lines, primary bulk substations, and distribution nodes.
* **Live Weather Fusion Radar**: Real-time atmospheric layer integration (lightning strike density, precipitation radar, ambient ambient thermal maps).
* **Dynamic Node Telemetry Drawer**: Select any substation node to view instant bus voltage, active load, telemetry health, and dispatch status.

### 5. 🔧 Closed-Loop Maintenance & Crew Staging
* **Smart Work Order Generation**: Automated ticket generation from AI failure predictions with predefined NERC-compliant safety checklists.
* **Crew Mobilization & Staging**: Unit assignment (High-Voltage Bucket Trucks, DGA Specialists, Substation Mechanics) with real-time ETA and travel routing.
* **Field Technician Workflow**: Interactive checklist verification, technician notes submission, and post-service health restoration.

### 6. 👥 Role-Based Access Control (RBAC)
Tailored operational views and permissions across three enterprise personas:
* **Grid Operations Director (Admin)**: Full oversight, risk thresholds, response approvals, crew deployment, and registry modifications.
* **Lead Field Technician**: Focused operational queue, maintenance checklists, asset diagnostic inspection, and repair completion reports.
* **Data Scientist**: Telemetry analytics, model calibration, Duval coordinate projections, and failure distribution metrics.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling & Design System** | Modern Dark-Mode CSS Design System (Custom Glassmorphism, HSL Tokens) |
| **Icons & Visuals** | Lucide React + GridSentinel Custom Vector Shield-Node Matrix Symbol |
| **State & Data Store** | React Context (`AuthContext`, `GridContext`) with simulated real-time telemetry stream |
| **Data Export** | Client-side CSV generation with UTF-8 BOM, automated escaping, and fallback handlers |
| **Compliance & Standards** | NERC CIP-014, IEEE C57.104 (DGA Guide), IEC 60599 |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
* `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Het-Patel-25/IBM-PROJECT.git
   cd IBM-PROJECT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Production Build**:
   ```bash
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

---

## 🔑 Demo Credentials

GridSentinel AI includes built-in quick login personas accessible directly from the login page:

| Role | Persona | Email | Default Password | Access Scope |
|---|---|---|---|---|
| **Admin** | Ananya Sharma | `admin@voltguard.com` | `password123` | Full System Access (All Modules) |
| **Field Tech** | Rahul Verma | `tech@voltguard.com` | `password123` | Maintenance & Crew Planning |
| **Data Scientist** | Dr. Vikram Singh | `viewer@voltguard.com` | `password123` | Risk Analysis & AI Prediction |

*(You can also use the 1-click **"Instant In"** button on any role card on the login screen).*

---

## 📁 Project Structure

```
IBM-PROJECT/
├── public/
│   ├── favicon.svg               # GridSentinel custom vector shield symbol
│   ├── logo.jpg                  # Project brand mark
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AddAssetModal.jsx
│   │   │   ├── GridSentinelSymbol.jsx  # Vector project emblem (shield-node matrix)
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
│   │   │   ├── AssetDetailPage.jsx
│   │   │   ├── AssetMonitoringPage.jsx
│   │   │   ├── CrewPlanningPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MaintenancePage.jsx
│   │   │   ├── ProjectMapPage.jsx
│   │   │   └── RiskAnalysisPage.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopNavbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── GridContext.jsx
│   ├── data/
│   │   ├── gridSentinelData.js
│   │   ├── mockAssets.js
│   │   ├── telemetryStream.js
│   │   └── weatherFusionData.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── exportCsv.js          # Robust UTF-8 BOM CSV export utility
│   │   └── formatters.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License & Attribution

Developed for the **IBM Project / Hackathon Initiative**. All rights reserved.
GridSentinel AI follows IEEE power equipment guidelines and NERC reliability frameworks.
