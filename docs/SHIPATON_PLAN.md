# BizExpense Shipaton 2026 Plan

## Goal

Transform the existing BizExpense MVP into a mobile-first expense and receipt management app for RevenueCat Shipaton 2026.

The current project already provides:

- Expense CRUD
- Receipt upload
- OCR
- OCR review and confirmation
- Categories
- Dashboard
- FastAPI backend
- PostgreSQL database
- Automated tests

The goal is to reuse the existing backend and business logic rather than rebuild the application from scratch.

## Mobile Version

A new React Native / Expo mobile app will be added.

Core workflow:

Receipt photo
→ OCR
→ Review / Correct
→ Confirm
→ Categorise
→ Dashboard

## RevenueCat Integration

RevenueCat will manage the Free and Pro tiers.

### Free

- Manual expense entry
- Basic dashboard
- Limited monthly OCR

### Pro

- Unlimited OCR
- AI categorisation
- Advanced analytics
- CSV / PDF export
- Business expense reports

RevenueCat entitlements must actually control access to premium features.

## Architecture

Mobile App
→ FastAPI API
→ Existing BizExpense backend
→ PostgreSQL

RevenueCat
→ Subscription
→ Pro Entitlement
→ Premium Features

## Priorities

1. Create mobile application
2. Connect mobile app to existing backend
3. Integrate RevenueCat
4. Add Paywall and entitlement checks
5. Test Free / Pro flows
6. Prepare demo video
7. Prepare Shipaton submission

## Team Workflow

Each contributor should work on a separate branch and submit changes through Pull Requests.

Suggested areas:

- Mobile UI
- RevenueCat integration
- Backend/API
- Testing
- Documentation
- Demo / submission

## Current staged delivery

The implementation is intentionally split into stacked branches so each milestone can be reviewed independently:

| Stage | Branch | Included | Verification status |
| --- | --- | --- | --- |
| 1 | `feature/mobile-stage-1-core` | Backend API client, dashboard, expense list/detail, manual creation | TypeScript checked |
| 2 | `feature/mobile-stage-2-receipts` | Camera/library input, upload, OCR extraction, editable confirmation | TypeScript checked; device flow still required |
| 3 | `feature/mobile-stage-3-revenuecat` | `pro` entitlement, paywall, restore, missing-key fallback, gating tests | Local checks required before PR |

Stages 2 and 3 are based on the preceding stage. Merge them in order or open each PR against its preceding stage branch.

### Remaining teammate work

- RevenueCat dashboard: create products, offering, paywall, and connect them to the `pro` entitlement.
- Add platform public API keys to local/EAS environment configuration; never commit secret keys.
- Add a server-backed monthly OCR usage counter before claiming that Free OCR is limited or Pro OCR is unlimited.
- Build the actual advanced analytics, CSV/PDF export, and business report screens; the current entitlement gate unlocks the Pro area but those features are not yet implemented.
- Validate camera, upload, purchase, cancellation, entitlement refresh, and restore on iOS/Android development builds.
- Run backend/frontend regressions, record the demo, and prepare the public submission materials.
