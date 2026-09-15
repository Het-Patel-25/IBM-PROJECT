# Contributing

This repository is a **IBM Bob AI Hackathon submission** and is not open for external contributions during the competition period.

## For team members

All source code lives in `src/` (frontend), `backend/`, and `ml/`.

### Branch strategy
- Work on `main` — this is a hackathon project, not a long-lived codebase
- Push before the deadline — evaluators use the state at deadline time

### What not to commit
- `.env` files (real credentials)
- `node_modules/` (install with `npm install`)
- `backend/node_modules/`
- `dist/` (Vite build output)
- `__pycache__/`, `.venv/`, `*.pyc` (Python artefacts)
- `ml/model.joblib` is committed intentionally — it is a pre-trained artifact judges need

### Before pushing
1. Run `npm run build` — confirm the frontend builds without errors
2. Start the backend and test `curl http://localhost:5001/api/health`
3. Check the GitHub Actions **Validate Submission** tab is green

## Contact

For questions about the hackathon, contact the organiser.
