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
