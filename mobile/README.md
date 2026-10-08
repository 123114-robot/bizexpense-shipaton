# BizExpense Mobile

Expo/React Native client for the shared BizExpense FastAPI backend and the RevenueCat Shipaton 2026 prototype.

## Current status

The Mobile prototype provides:

- Dashboard KPIs, confirmed-expense analytics, category trends, average expense and top suppliers
- Expense search, status/category/date filters, create, edit, detail and delete flows
- Camera, photo-library and PDF/JPEG/PNG upload with offline and 10 MB validation
- OCR draft review, editable extracted fields, explicit confirmation and field-confidence warnings
- Non-blocking duplicate-expense warnings returned by the shared backend
- Access/refresh-token rotation with SecureStore on native platforms
- RevenueCat `pro` presentation, paywall, restore flow, premium analytics and CSV export
- Android, iOS and Web bundles plus a reproducible Playwright demo recording

## Ownership boundary

This project owns Mobile screens, navigation, device interaction, RevenueCat client presentation, OCR review UX, error states, tests and packaging.

The shared BizExpense mainline remains the source of truth for authentication, tenant isolation, expenses, documents, OCR processing, database migrations, Dashboard calculations, duplicate detection and production authorization. Do not add a second backend or trust a client-side RevenueCat entitlement as server authorization.

## Setup

```powershell
Copy-Item .env.example .env
npm install
npm run validate
npm start
```

Set `EXPO_PUBLIC_API_URL` to a backend URL reachable from the device. Android emulators commonly use `http://10.0.2.2:8000/api`; physical devices need the computer's reachable LAN or HTTPS address.

Configure the RevenueCat public SDK key for each target platform. Missing keys keep the app usable in Free mode. Purchases require a development build rather than Expo Go.

## Demo mode

Set this value in `mobile/.env`:

```dotenv
EXPO_PUBLIC_DEMO_MODE=true
```

Demo Mode is visibly labelled, uses in-memory sample data and deterministic mock OCR, and resets when the app restarts. It does not prove live OCR, persistence, billing or server-side Pro authorization.

Run the recorded browser walkthrough from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\demo\run-demo.ps1
```

The recording is written to `demo/recordings/bizexpense-demo.webm` and is intentionally ignored by Git.

## Validation and packaging

```powershell
npm run validate
npx expo-doctor
npm run export:web
npm run export:all
```

EAS profiles in `eas.json`:

- `development`: internal development client
- `ios-simulator`: iOS Simulator development client
- `preview`: internal production-like build
- `production`: store build with automatic build-number incrementing

Before a signed build, the team must configure the EAS project/owner, bundle identifiers, signing credentials, production API URL and RevenueCat keys. These account-owned values must not be committed to this public repository.

## Shared mainline dependencies

The Mobile adapter currently uses:

- `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me`
- `/api/health`
- `/api/dashboard/summary`
- `/api/categories`
- `/api/expenses` and `/api/expenses/export.csv`
- `/api/documents/upload` and `/api/documents/{id}/extract`

`/api/documents/ocr-usage` is not yet available in BizExpense mainline. Mobile therefore shows an explicit unavailable state outside Demo Mode.

OCR `field_confidence` currently comes from the mainline `phase-19-ocr-field-confidence` branch and remains optional until that contract is merged. Real OCR accuracy still requires a configured provider and representative invoice validation.

## Delivery history

Stages 1–4F established the Mobile client, receipt capture, RevenueCat integration, offline/quota UX, packaging baseline and standalone Demo Mode.

Stages 5A–5Q added authenticated mainline integration, hardened OCR review, analytics, filters and expense management, CSV export, refresh sessions, PDF upload, supplier insights, duplicate warnings, field-confidence UX, Expo SDK alignment, end-to-end demo regression coverage and this handoff.

Each stage is documented in [`../docs/stages/`](../docs/stages/). The latest stacked branch is `feature/mobile-stage-5q-team-handoff`; branch publication does not mean it has been merged to `main` or validated with production accounts.
