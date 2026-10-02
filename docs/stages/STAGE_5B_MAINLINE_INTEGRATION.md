# Stage 5B — Mainline API Integration Check

## Scope

This mobile-only stage verifies that the configured API is the authenticated BizExpense mainline before the user starts the receipt workflow.

## Included

- Checks `GET /api/health` from the sign-in screen.
- Shows a connected state for the current mainline API.
- Distinguishes an older incompatible backend (`404`) from an unreachable API.
- Keeps demo mode and all backend business logic unchanged.

## Required mainline baseline

Use BizExpense `origin/main` at or after commit `2c0c226`. The backend bundled in the Shipaton repository is an older snapshot and must not be used for authenticated Mobile testing.

Required existing endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/documents/upload`
- `POST /api/documents/{id}/extract`
- `POST /api/expenses`
- `GET /api/dashboard/summary`

## Still waiting for mainline

- `GET /api/documents/ocr-usage`
- Server-enforced monthly OCR limits.
- Server-verified RevenueCat Pro access.
- Production-grade OCR validation and parser hardening.

This stage does not claim that real OCR is production ready.
