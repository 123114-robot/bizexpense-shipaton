# Stage 4F — Standalone Interactive Demo

## Status

Implementation and validation complete. This stage is ready for its dedicated branch.

## Mobile-only implementation

- Added an explicit `EXPO_PUBLIC_DEMO_MODE` adapter switch.
- Added in-memory sample dashboard and expense data.
- Manual expense creation updates the demo list and dashboard during the session.
- Camera or image selection continues into deterministic mock OCR review.
- OCR confirmation creates an expense and updates the demo totals.
- Free OCR allowance changes during the demo session.
- Demo mode is clearly labelled and never presented as persisted backend data.
- Corrected manual mobile expenses to be confirmed records, matching the existing web behavior.

## Temporarily mocked main-line dependencies

- Dashboard summary
- Expense list and creation
- Categories
- Receipt upload identifier
- OCR result
- OCR usage allowance

All mock behavior is behind `EXPO_PUBLIC_DEMO_MODE=true`. Normal mode continues to use the shared FastAPI API.

## Waiting for main BizExpense

- Stable production API URL and contracts.
- Authenticated OCR quota endpoint.
- Server-verified Pro access.

## How to run

Create `mobile/.env`:

```env
EXPO_PUBLIC_DEMO_MODE=true
```

Then:

```powershell
cd mobile
npm install
npm start
```

## Demo flow

1. Open Dashboard and show sample totals.
2. Open Expenses and inspect a record.
3. Add a manual expense.
4. Return to Dashboard and refresh totals.
5. Choose a receipt image or take a photo.
6. Review the deterministic OCR result.
7. Confirm it and show the updated expense list and OCR allowance.

## Validation

- `npm run validate` passed: config check, TypeScript, 11 tests across 5 files, and ESLint.
- `EXPO_PUBLIC_DEMO_MODE=true npm run export:web` passed and produced four static routes.
- Config validation correctly reports missing account-owned API and RevenueCat values as warnings.
