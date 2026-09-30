# Stage 4B — Anonymous Subscription Identity

## Status

Local implementation complete. Not pushed. Device and RevenueCat dashboard behavior are not verified.

## Decision

Use RevenueCat-generated anonymous App User IDs for the Shipaton MVP. The SDK is configured without a custom App User ID, so RevenueCat creates and caches an anonymous identifier on the device.

This is intentionally smaller than adding authentication. It preserves the existing backend, which currently has no production authentication or tenant-isolation contract.

## Included

- Loads the current RevenueCat App User ID after SDK configuration.
- Detects whether the RevenueCat customer is anonymous or identified.
- Displays the App User ID as a selectable support identifier, following RevenueCat support guidance.
- Keeps the existing user-triggered restore flow.
- Adds unit tests for configured, anonymous, and future identified identity states.

## Data flow

1. The app starts without a custom user identifier.
2. RevenueCat creates or restores its cached anonymous App User ID.
3. The subscription provider loads `CustomerInfo`, the App User ID, and anonymous status together.
4. Entitlements continue to come only from `CustomerInfo`.
5. The user can view the support identifier and explicitly trigger Restore Purchases.

## Important limitations

- Deleting and reinstalling the app can create a new anonymous ID.
- Anonymous identity does not provide reliable cross-platform or multi-device account continuity.
- This ID is not used as backend authentication and must not be trusted for expense ownership or OCR quota enforcement.
- Do not hardcode an App User ID or use an email address as an App User ID.
- If account login is added later, call RevenueCat `logIn()` with a non-guessable backend user ID and test anonymous-to-identified merge behavior.

## RevenueCat dashboard requirement

For an app without login, keep the default **Transfer to new App User ID** restore behavior so customers can restore after reinstalling. Confirm this setting in the correct RevenueCat project before device testing.

## Validation performed locally

- `npx tsc --noEmit` — passed.
- `npm test` — passed, 4/4 tests across 2 files.
- `npx eslint .` — passed.

## Exit criteria for production identity

Before using subscription identity for backend authorization or cross-device access, add real authentication and define:

- Backend-issued non-guessable user IDs.
- RevenueCat `logIn()` and account-switch behavior.
- Anonymous purchase migration.
- Account recovery and restore behavior.
- Webhook/API verification for backend premium authorization.
