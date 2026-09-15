# Setup Guide

## GridPulse AI — Complete Setup Instructions

> **Important:** Test these instructions yourself in a clean terminal before submitting.
> The application is designed to work without MongoDB and without Python — fallbacks activate automatically.

---

## Prerequisites

| Tool | Version | Check command | Install |
|---|---|---|---|
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| npm | 9+ | `npm --version` | Bundled with Node.js |
| Python | 3.8+ | `python --version` or `python3 --version` | [python.org](https://python.org) |
| pip | latest | `pip --version` | `python -m pip install --upgrade pip` |
| MongoDB | 7+ | `mongod --version` | [mongodb.com](https://www.mongodb.com/try/download/community) (**Optional** — app works without it) |
| Git | any | `git --version` | [git-scm.com](https://git-scm.com) |

---

## Environment Variables

All environment variables are optional — the app runs with defaults if not set.

Copy the example file:
```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/gridpulse` | MongoDB connection string. Use a MongoDB Atlas URI for cloud DB. |
| `JWT_SECRET` | `gridpulse-secret-key-change-in-production` | Secret key for JWT signing. **Change this in production.** |
| `PORT` | `5001` | Port the Express server listens on |

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

### Step 4 — Install Python ML dependencies

```bash
pip install scikit-learn numpy pandas joblib
```

Or, if `pip` maps to Python 2:
```bash
pip3 install scikit-learn numpy pandas joblib
```

### Step 5 — Train the ML model

```bash
cd ml
python -X utf8 train.py --regen
cd ..
```

**On Mac/Linux:**
```bash
cd ml
python3 train.py --regen
cd ..
```

Expected output:
```
[OK] Dataset generated: 1500 samples -> .../grid_sensor_dataset.csv
   Failure rate: 16.9%  |  Safe: 83.1%
...
  Mean Accuracy: 97.73% +/- 0.13%
  Model artifact saved -> .../model.joblib
  Validation report saved -> .../validation_report.json
```

> If this step fails (Python not available), skip it. The app will use a formula-based fallback for ML predictions.

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
🚀 GridPulse AI Backend v2.5 listening on port 5001
🔐 RBAC enabled: admin | department_manager | employee
🛡️  2FA (TOTP) authentication: enabled
ℹ️  MongoDB not connected — in-memory store active.  (← if no MongoDB)
```
or:
```
✅ Connected to MongoDB at: mongodb://127.0.0.1:27017/gridpulse
🌱 Seeded 5 baseline grid assets.
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
  "service": "GridPulse AI Backend",
  "version": "2.5",
  "rbac": "enabled",
  "twoFactor": "enabled",
  "database": "MongoDB Connected"
}
```

### 2. Auth guard check — unauthenticated request should return 401

```bash
curl http://localhost:5001/api/assets
```

Expected:
```json
{"error":"Authentication required. No token provided."}
```

### 3. Open the application

Navigate to **[http://localhost:5173](http://localhost:5173)**

You should see the **Sign In** page with the GridPulse AI branding.

### 4. Create the admin account

Click **"Create account"** and fill in:
- Name: any name
- Email: any valid email format
- Password: at least 8 characters
- Role: **Admin** (first user is always admin)
- Department: any

Click **"Create Account"** — you should be redirected to the dashboard immediately.

### 5. Set up 2FA (optional, recommended to demo)

After login, the 2FA setup modal appears automatically. Click **"Begin Setup"**, scan the QR code with Google Authenticator or Authy, enter the 6-digit code to confirm.

On the next login, you will be asked for your TOTP code after entering your password.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Error: listen EADDRINUSE :::5001` | Port 5001 already occupied | `npx kill-port 5001` or change `PORT` in `backend/.env` |
| `MongoDB not connected` in logs | MongoDB service not running | Ignore — in-memory fallback activates. Or start MongoDB: `mongod` |
| Python `UnicodeEncodeError` on Windows | Windows console encoding | Run `python -X utf8 train.py --regen` |
| `ModuleNotFoundError: No module named 'sklearn'` | scikit-learn not installed | `pip install scikit-learn` |
| `Cannot find module 'speakeasy'` | Backend npm install not run | `cd backend && npm install` |
| Login always returns 401 | JWT_SECRET changed after tokens issued | Clear `gp_token` from browser localStorage |
| 2FA code says "invalid or expired" | System clock drift | Sync your system clock. TOTP allows ±60 second window |
| White screen on frontend | Build error | Check Terminal 2 for Vite error messages |
| Frontend can't reach backend | CORS or proxy misconfiguration | Ensure backend is on port 5001 and frontend on port 5173 |
| `dist/` not found on first build | Not built yet | Run `npm run build` or just use `npm run dev` |

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
├── src/                    # React frontend source
│   ├── components/
│   │   ├── auth/           # LoginPage, SignupPage, TwoFactorSetupModal
│   │   ├── pages/          # Dashboard, Assets, Prediction, Maintenance, Admin
│   │   ├── modules/        # Complex dashboard modules
│   │   └── common/         # Shared modals, charts
│   ├── context/
│   │   └── AuthContext.jsx # JWT + role state management
│   ├── services/
│   │   └── api.js          # All backend API calls (auth-aware)
│   └── data/               # Mock/seed data for offline mode
├── backend/
│   ├── models/             # Mongoose schemas (User, Asset, Maintenance)
│   ├── routes/
│   │   └── auth.js         # All auth endpoints
│   ├── middleware/
│   │   └── auth.js         # requireAuth, requireRole, requirePermission
│   ├── config/
│   │   └── permissions.js  # RBAC permission matrix
│   └── server.js           # Express app entry point
├── ml/
│   ├── train.py            # ML training + validation script
│   ├── predict.py          # ML inference script
│   ├── model.joblib        # Trained model artifact
│   ├── validation_report.json  # Full validation metrics
│   └── grid_sensor_dataset.csv # Training dataset
├── docs/                   # This documentation
├── demo/                   # Demo video, screenshots
├── presentation/           # Slide deck
└── submission.yaml         # Hackathon submission metadata
```
