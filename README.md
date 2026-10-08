# BizExpense

BizExpense is a portfolio-quality MVP for Australian SMEs to record expenses, upload invoices, review mock OCR results and see live spending totals. It deliberately keeps authentication, production OCR and accounting integrations out of scope.

## What works

- Expense create, list/search, view, edit and delete
- PDF/JPEG/PNG upload (10 MB limit) and replaceable Mock/Tesseract `OCRProvider`
- Mandatory user confirmation on the OCR review screen
- Database-backed dashboard totals, monthly spend, GST and count
- Seeded demo admin and ten expense categories
- FastAPI OpenAPI docs at `http://localhost:8000/docs`

## Local setup

Prerequisites: Python 3.11+, Node 20+, and Docker (for PostgreSQL).

```powershell
Copy-Item .env.example .env
docker compose up -d db
python -m venv backend/.venv
backend/.venv/Scripts/Activate.ps1
pip install -r backend/requirements-dev.txt
uvicorn app.main:app --reload --app-dir backend
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API reads `DATABASE_URL`; the `.env.example` value is its default. Tables and reference data are created on API startup for this MVP.

Mock OCR is the default. The Tesseract integration is a prototype with basic PNG/JPEG invoice-field parsing, not production-grade OCR. Enable it with `OCR_PROVIDER=tesseract`; Windows standard installs are detected automatically, otherwise set `TESSERACT_CMD`. Production accuracy, broad layout compatibility, PDF OCR, field-level confidence, cloud OCR and validation against a large real-invoice dataset are intentionally deferred.

## Verification

```powershell
cd backend; python -m pytest -q; ruff check .
cd ../frontend; npm test; npm run build; npm run lint
```

See [docs/project-overview.md](docs/project-overview.md), [PROJECT_TASKS.md](PROJECT_TASKS.md), and the remaining `docs/` files for design decisions and future phases.

## Shipaton 2026

This repository is being adapted for RevenueCat Shipaton 2026.

The current plan is to extend the existing BizExpense MVP with:

- React Native / Expo mobile app
- RevenueCat Free / Pro subscriptions
- Paywall and entitlement checks
- Limited OCR for Free users
- Unlimited OCR and premium analytics for Pro users

See [docs/SHIPATON_PLAN.md](docs/SHIPATON_PLAN.md) for the detailed project plan.

### Mobile delivery branches

The Mobile work is published as stacked, reviewable stages. Stages 1–4F establish the client, receipt flow, RevenueCat integration, device UX and Demo Mode. Stages 5A–5Q connect the authenticated mainline APIs and add expense management, analytics, CSV export, refresh sessions, PDF upload, duplicate warnings, OCR field confidence, packaging validation, automated demo regression coverage and the current team handoff.

The latest stacked branch is `feature/mobile-stage-5q-team-handoff`. See [`mobile/README.md`](mobile/README.md) and [`docs/stages/`](docs/stages/) for the implementation boundary, setup, validation commands, mock limitations and remaining mainline/account dependencies. Branch publication does not mean the work has been merged to `main` or validated with production accounts.
