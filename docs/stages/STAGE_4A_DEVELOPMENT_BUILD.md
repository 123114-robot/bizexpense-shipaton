# Stage 4A — RevenueCat Development Build Readiness

## Status

Local implementation complete. Not pushed. Cloud builds and RevenueCat account configuration are not verified.

## Goal

Prepare repeatable Expo development, preview, and production build profiles so the team can test RevenueCat native modules without treating Expo Go as purchase-flow verification.

## Included

- EAS `development`, `ios-simulator`, `preview`, and `production` profiles.
- App display name, slug, and URL scheme updated for BizExpense Mobile.
- A local configuration check that validates structural build settings and reports missing account-owned values.
- Setup commands and an explicit boundary between repository work and account/dashboard work.

## Files

- `mobile/eas.json`
- `mobile/app.json`
- `mobile/scripts/check-config.mjs`
- `mobile/package.json`
- `mobile/README.md`

## Validation performed locally

- `npm run config:check` — passed structural checks; correctly warned that API and RevenueCat environment values are not configured.
- `npx expo config --type public --json` — passed; resolved SDK 57 configuration for iOS, Android, and web.
- `npx tsc --noEmit` — passed.
- `npm test` — passed, 2/2 tests.
- `npx eslint .` — passed.

## Account-owned work still required

1. Log in to the correct Expo account and run `npx eas-cli@latest init` from `mobile/`.
2. Select final unique identifiers for `ios.bundleIdentifier` and `android.package`. Do not invent or publish them without confirming team/store ownership.
3. In RevenueCat, connect the Test Store or platform stores, create products, attach them to `pro`, create the current offering, and configure the paywall.
4. Store `EXPO_PUBLIC_API_URL` and RevenueCat public SDK keys in the matching EAS environments.
5. Run an iOS simulator or Android development build and validate purchase, cancellation, entitlement refresh, and restore.

## Suggested commands after account setup

```powershell
cd mobile
npx eas-cli@latest init
npx eas-cli@latest env:list --environment development
npx eas-cli@latest build --platform android --profile development
npx eas-cli@latest build --platform ios --profile ios-simulator
```

## Acceptance criteria before calling Stage 4A fully verified

- The EAS project is linked to the intended team account.
- Final platform identifiers match the store and RevenueCat apps.
- Development builds install and open on at least one supported platform.
- The RevenueCat paywall loads from the configured offering.
- Purchase and restore update the `pro` entitlement in the app.
- Evidence and failures are added to this file.
