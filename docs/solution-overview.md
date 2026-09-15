# Solution Overview

## GridPulse AI — How It Works

---

## Core Mechanism

GridPulse AI works by continuously exposing sensor telemetry through a monitored dashboard, running AI failure probability predictions on demand, and enforcing role-appropriate access to every function in the system.

The core insight is that **failure prediction doesn't require real-time streaming ML** at the college/prototype level. What it requires is:

1. A **well-trained, well-validated model** that maps sensor readings to failure probability
2. A **feature engineering step** that encodes electrical engineering domain knowledge into the model's inputs
3. A **role-based access system** that ensures only qualified personnel can interpret and act on predictions
4. A **maintenance workflow** that connects predictions to action

---

## What Makes This Different

### 1. Physics-informed feature engineering, not black-box ML

Most student ML projects feed raw sensor readings into a Random Forest and report train-set accuracy. GridPulse AI encodes IEC 60076 and ISO 10816 standards directly into the feature set:

- `thermal_load_idx = temperature × load / 100` — the IEEE C57 combined thermal stress metric
- `mech_health = vibration × age` — cumulative mechanical wear (older assets degrade faster at the same vibration level)
- `moisture_age = humidity × age / 100` — moisture-accelerated insulation aging
- `overload_flag = (load > 85%) OR (temperature > 90°C)` — binary critical overload signal

These features let the Random Forest capture physical interactions it cannot discover from raw inputs alone. This is why the model achieves 97.73% accuracy on a 1,500-sample dataset — the domain knowledge is doing real work.

### 2. Proper validation methodology

Training accuracy is not validation. GridPulse AI uses:
- A genuinely held-out **test split** (300 samples, never seen during training or hyperparameter search)
- **5-fold stratified cross-validation** on the full dataset
- The full metric suite: accuracy, precision, recall, **F1, ROC-AUC, PR-AUC, MCC**, confusion matrix
- **Platt scaling** (sigmoid calibration) to ensure predicted probabilities are actually calibrated — a prediction of 80% failure probability should correspond to an ~80% empirical failure rate

### 3. Production-grade security at hackathon scale

- **JWT authentication** with 8-hour sessions
- **TOTP two-factor authentication** (Google Authenticator, Authy) — not simulated, actually working
- **Three-tier RBAC** enforced at both API middleware (backend) and React component level (frontend)
- **Bcrypt password hashing** at cost factor 12
- **Pre-auth token pattern** for 2FA: credentials → short-lived (5 min) pre-auth JWT → TOTP verification → full session JWT

### 4. Resilient-by-design architecture

The application is designed to work in degraded environments — critical for a demo:
- **No MongoDB?** → In-memory store activates automatically with seeded data
- **No Python?** → Formula-based ML fallback activates (same equations used in training)
- **No network?** → localStorage fallback for assets and maintenance records

---

## Key Design Decisions

### Why Random Forest over deep learning?

1. **Interpretability**: Feature importances tell engineers *why* an asset is high-risk (e.g., "vibration accounts for 42% of risk score")
2. **Data efficiency**: Random Forests perform well on structured tabular data with 1,000–5,000 samples — we don't have millions of labelled field failures
3. **Inference speed**: Sub-millisecond prediction, critical for real-time dashboard updates
4. **Calibration**: Platt scaling works well with RF; temperature scaling is overkill at this scale

### Why TOTP (not SMS/email 2FA)?

SMS 2FA is vulnerable to SIM-swapping attacks. TOTP (RFC 6238) is standard in critical infrastructure security and requires no external service (no Twilio, no AWS SES). The `speakeasy` library is production-grade, used by enterprise applications.

### Why role filtering at both API and UI level?

Defense in depth. A frontend-only guard can be bypassed by directly calling the API. A backend-only guard can be bypassed if a frontend bug exposes actions to unauthorised users. Both layers are required for genuine security.

### Why in-memory fallback?

A hackathon demo that requires MongoDB to be running will fail when MongoDB is not available. The resilient fallback ensures the application is always demonstrable, regardless of the judge's environment.

---

## User Experience Flow

### Admin
1. **Signs up** → automatically becomes admin (first user)
2. **Prompted to set up 2FA** → scans QR code in Google Authenticator
3. **Dashboard** → sees all 5 grid assets, alerts, risk overview
4. **AI Prediction** → enters sensor values → gets failure probability + recommendation → creates maintenance work order
5. **User Management** → creates accounts for managers and employees, assigns roles and departments
6. **Maintenance** → reviews all work orders, updates statuses

### Department Manager
1. **Signs in** → 2FA if enabled
2. **Dashboard + Assets** → full asset view with telemetry
3. **AI Prediction** → can run predictions on any asset
4. **Maintenance** → can create and update work orders
5. **Crew Planning** → manages technician pre-positioning
6. **Cannot** access User Management panel

### Field Employee
1. **Signs in** → limited dashboard
2. **Assets** → sees only assigned assets (scoped at API level)
3. **Maintenance** → view-only access to work orders
4. **Cannot** run AI predictions, view Risk Analysis, or access any admin functions

---

## What the User Experience Looks Like

- **Login page**: Clean dark-themed auth card with email/password form
- **2FA step**: Large OTP input field with instructions, "back to login" escape
- **Signup**: Role selection cards with clear permission descriptions
- **Dashboard**: Grid of asset cards with colour-coded risk status, alert feed, model accuracy widget
- **AI Prediction Studio**: Sensor sliders → "Run Prediction" → animated result card with probability gauge, failure mode, and recommendation
- **Admin panel**: User table with inline role editor, status toggles, 2FA indicator column
