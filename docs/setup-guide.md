# Setup Guide

## GridSentinel AI — Complete Setup Instructions

> **Important:** Test these instructions yourself in a clean terminal before submitting.
> The application requires MySQL to be running locally. The ML Python step is optional — a calibrated formula fallback activates automatically if Python is unavailable.

---

## Prerequisites

| Tool | Version | Check command | Install |
|---|---|---|---|
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| npm | 9+ | `npm --version` | Bundled with Node.js |
| MySQL | 8.0+ | `mysql --version` | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| Python | 3.8+ | `python --version` or `python3 --version` | [python.org](https://python.org) (**Optional** — formula fallback active if absent) |
| Git | any | `git --version` | [git-scm.com](https://git-scm.com) |

---

## Environment Variables

The application runs with hard-coded defaults for local development. No `.env` file is required to get started.

To customise, create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5001` | Port the Express server listens on |
| `JWT_SECRET` | `supersecretenterprisekey` | Secret key for JWT signing. **Change this in production.** |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | `Acpc@2025` | MySQL password |
| `DB_NAME` | `voltguard_db` | MySQL database name (auto-created on startup) |

> **Note:** Credentials are currently hard-coded in `backend/config/db.js`. For production, move them to environment variables.

---

## Installation Steps

### Step 1 — Clone the repository

```bash
git clone https://github.com/Het-Patel-25/IBM-PROJECT.git
cd IBM-PROJECT
```

### Step 2 — Install frontend dependencies

```bash
npm install
```

Expected output: `added XX packages, and audited XX packages`

### Step 3 — Install backend dependencies

```bash
cd backend
npm install
cd ..
```

Expected output: `added XX packages, and audited XX packages`

### Step 4 — Ensure MySQL is running

The backend will auto-create the `voltguard_db` database on startup. You only need a running MySQL instance accessible at `127.0.0.1:3306`.

**Windows:**
```powershell
# Start MySQL service
net start mysql
# Or from MySQL installer: open MySQL Workbench → start the local instance
```

**Mac (Homebrew):**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

Verify MySQL is reachable:
```bash
mysql -u root -p -e "SELECT 1;"
```

### Step 5 — (Optional) Install Python ML dependencies

```bash
pip install scikit-learn numpy pandas joblib
```

Or on systems where `pip` maps to Python 2:
```bash
pip3 install scikit-learn numpy pandas joblib
```

### Step 6 — (Optional) Retrain the ML model

The pre-trained `ml/model.joblib` is already committed. To regenerate it:

**Windows:**
```bash
cd ml
python train.py
cd ..
```

**Mac/Linux:**
```bash
cd ml
python3 train.py
cd ..
```

Expected output:
```
[OK] Dataset: 800 samples -> grid_sensor_dataset.csv
Mean Accuracy: 97.73% +/- 0.13%
Model artifact saved -> model.joblib
```

> If this step fails (Python not available), skip it. The backend activates a formula-based fallback for ML predictions automatically.

---

## Running the Application

You need **two terminal windows running simultaneously**.

### Terminal 1 — Backend API server

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Database 'voltguard_db' ensured to exist.
✅ Database schemas synced.
✅ Users seeded successfully.
✅ Assets seeded successfully.
✅ Maintenance seeded successfully.
✅ Entire Database seeded successfully.
🚀 VoltGuard Backend Server listening on port 5001
```

### Terminal 2 — Frontend dev server

```bash
npm run dev
```

Expected output:
```
  VITE v8.3.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Verifying It Works

### 1. Health check

```bash
curl http://localhost:5001/api/health
```

Expected:
```json
{
  "status": "ok",
  "service": "VoltGuard Backend",
  "database": "MySQL Connected",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### 2. Auth guard check — unauthenticated request should return 401

```bash
curl http://localhost:5001/api/assets
```

Expected:
```json
{"error":"Not authorized, no token"}
```

### 3. Open the application

Navigate to **[http://localhost:5173](http://localhost:5173)**

You should see the **Login** page with the GridSentinel AI branding and three role cards.

### 4. Log in with a demo account

Click the **"Instant In"** button on any role card, or enter credentials manually:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@voltguard.com` | `password123` |
| Technician | `tech@voltguard.com` | `password123` |
| Viewer | `viewer@voltguard.com` | `password123` |

You should be taken directly to the **Dashboard**.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Error: listen EADDRINUSE :::5001` | Port 5001 already occupied | Change `PORT` in `backend/config/db.js` or kill the process using port 5001 |
| `Access denied for user 'root'` | Wrong MySQL credentials | Edit the `dbConfig` object in `backend/config/db.js` with your MySQL root password |
| `ER_ACCESS_DENIED_ERROR` | MySQL not started | Start MySQL service (see Step 4 above) |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL service not running | Start MySQL: `net start mysql` / `brew services start mysql` |
| `ModuleNotFoundError: No module named 'sklearn'` | scikit-learn not installed | `pip install scikit-learn` (ML step is optional — formula fallback activates) |
| `Cannot find module 'sequelize'` | Backend npm install not run | `cd backend && npm install` |
| Login always returns 401 | JWT_SECRET changed after tokens issued | Clear `token` from browser localStorage and log in again |
| White screen on frontend | Build error | Check Terminal 2 for Vite error messages |
| Frontend can't reach backend | CORS or proxy misconfiguration | Ensure backend is on port 5001 and frontend on port 5173 |
| `force: true` wipes my data | seed.js syncs with force on every restart | This is intentional for a demo — the DB is always seeded fresh |

---

## Running the Production Build

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

The production build will be available at `http://localhost:4173`.

---

## Project Structure Reference

```
IBM-PROJECT/
├── src/                         # React frontend source
│   ├── components/
│   │   ├── common/              # AddAssetModal, GridSentinelSymbol, modals
│   │   ├── pages/               # Dashboard, Assets, AssetDetail, Map, Prediction, Maintenance, Crew, Login
│   │   └── modules/             # Complex dashboard sub-modules (DGA, ranking, tuning)
│   ├── context/
│   │   ├── AuthContext.jsx      # JWT session management & role guards
│   │   ├── GridContext.jsx      # Central asset/ticket/crew state store
│   │   └── SimulationContext.jsx # Simulation-mode provider
│   ├── data/                    # gridSentinelData.js, mockAssets.js, weatherFusionData.js
│   ├── utils/
│   │   └── exportCsv.js         # UTF-8 BOM CSV export utility
│   └── index.css                # Full dark-mode HSL token design system
├── backend/
│   ├── config/
│   │   └── db.js                # Sequelize + MySQL connection & auto-DB-creation
│   ├── models/
│   │   ├── User.js              # Sequelize model (UUID PK, bcrypt hooks, matchPassword)
│   │   ├── Asset.js             # Sequelize Asset model
│   │   └── Maintenance.js       # Sequelize Maintenance model
│   ├── seed.js                  # DB seeding (users, assets, maintenance)
│   ├── server.js                # Express app — auth, assets, maintenance, ML predict
│   └── package.json
├── ml/
│   ├── train.py                 # ML training + GridSearchCV + Platt calibration
│   ├── predict.py               # ML inference script (JSON in → JSON out)
│   ├── model.joblib             # Pre-trained Random Forest artifact
│   └── grid_sensor_dataset.csv  # 800-sample physics-informed training dataset
├── docs/                        # Written documentation
├── demo/                        # Demo video link, screenshots
├── presentation/                # Slide deck
└── submission.yaml              # Hackathon submission metadata
```
