# Stage 4C — Mobile OCR Quota Experience

## Status

Local mobile implementation complete. Not pushed. Shared backend quota API is not available in this repository and is represented by an explicit unavailable state.

## Mobile-only implementation

- Added an OCR quota adapter isolated from screen code.
- Added Free allowance, remaining scans, unlimited, loading, and unavailable UI states.
- Added a mobile upgrade action that opens the existing RevenueCat paywall.
- Added handling for backend HTTP 429 responses with a clear limit-reached prompt.
- Refreshes quota state after a rejected scan.
- Added focused adapter and error-state tests.

## Temporarily mocked or unavailable dependency

No quota count is invented or stored locally. When the shared API is missing or unreachable, the app displays:

`OCR allowance unavailable — Waiting for the shared BizExpense quota API.`

The RevenueCat client entitlement is displayed separately and is never used to bypass the backend OCR response.

## Shared BizExpense API contract required

The mobile adapter expects:

```http
GET /api/documents/ocr-usage
```

Free response:

```json
{ "used": 2, "limit": 5, "remaining": 3 }
```

Server-confirmed unlimited response:

```json
{ "used": 12, "limit": null, "remaining": null }
```

When extraction is denied, the existing extraction endpoint should return HTTP 429.

The shared backend remains responsible for authentication, usage persistence, monthly reset rules, concurrency, and server-side RevenueCat verification.

## Waiting for main BizExpense

- Stable OCR usage endpoint and response schema.
- Server-enforced monthly Free limit.
- Authenticated user ownership.
- Server-verified Pro/unlimited status.
- Confirmed error payload for quota exhaustion.

## Files or commits to sync from main later

- Final API route and schema documentation.
- Any generated API client types, if the main project adopts them.
- Backend commit that introduces authenticated OCR usage and 429 enforcement.

Do not copy backend models or migrations into this mobile branch.

## Local validation

- Full mobile tests: 7/7 passed across 3 files.
- `npx tsc --noEmit`: passed.
- `npx eslint .`: passed.
