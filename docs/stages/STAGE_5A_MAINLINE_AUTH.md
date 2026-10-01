# Stage 5A — Mainline Authentication

## Mobile-only implementation

- Added sign-in and registration UI for the shared BizExpense authentication API.
- Stores JWTs with Expo SecureStore on native devices and local storage on web.
- Adds the Bearer token to Mobile API requests.
- Restores the authenticated user through `/auth/me` and signs out on HTTP 401.
- Keeps standalone demo mode backend-free and visibly separate.

## Reused mainline APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

No authentication service, user model, token generator, tenant logic, or migration was copied into the Mobile project.

## Validation

- `npm run validate` passed.
- TypeScript and ESLint passed.
- 13 tests across 6 files passed, including Bearer header and HTTP 401 behavior.

## Waiting for main BizExpense

- A deployed API URL reachable by physical devices.
- Server-side RevenueCat entitlement verification.
- An authenticated OCR quota endpoint.
