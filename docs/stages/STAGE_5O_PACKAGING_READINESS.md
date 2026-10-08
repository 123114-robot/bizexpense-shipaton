# Stage 5O — Mobile packaging readiness

## Completed

- Aligned Expo, Expo Router, Expo Constants, Expo Linking and Expo UI with the patch versions expected by SDK 57.
- Added `npm run export:all` to verify Android, iOS and Web bundles with one command.
- Confirmed the existing EAS development, simulator, preview and production profiles remain valid.
- Confirmed generated native and export output stays outside version control.

## Verified locally

- `npx expo install --check`
- `npx expo-doctor` — 21/21 checks passed
- `npm run validate` — configuration, TypeScript, 32 tests and ESLint passed
- `npx expo export --platform all --output-dir dist-all` — Android, iOS and Web bundles generated

## Account-owned requirements

Before a signed EAS build, configure the production API URL, RevenueCat public SDK keys, EAS project ownership, bundle identifiers and store signing credentials. These values are intentionally not committed to the public repository.

## External dependencies

Signed device builds do not prove that the shared OCR provider, RevenueCat products or mainline API deployment are configured. Those services must be tested separately with their real account-owned settings.
