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

The mobile work is published as stacked, reviewable stages. Review or merge them in order:

1. `feature/mobile-stage-1-core` — FastAPI client, dashboard, expense list/detail, and manual expense creation.
2. `feature/mobile-stage-2-receipts` — camera/library receipt upload, OCR extraction, editable review, and explicit confirmation.
3. `feature/mobile-stage-3-revenuecat` — real `pro` entitlement detection, RevenueCat paywall, restore purchases, safe missing-key handling, tests, and team documentation.

The existing web frontend and backend business logic are preserved. See the plan for verified status and remaining work; branch presence does not mean device/store validation is complete.
