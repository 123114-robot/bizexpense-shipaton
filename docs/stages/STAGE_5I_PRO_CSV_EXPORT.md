# Stage 5I — RevenueCat-Gated Mobile CSV Export

- Adds a Pro-only CSV export action to the Mobile dashboard.
- Reuses the authenticated mainline `GET /api/expenses/export.csv` endpoint.
- Downloads through the authenticated Mobile API client rather than exposing the JWT in a URL.
- Uses a browser download on Web and Expo FileSystem plus Sharing on iOS/Android.
- Adds deterministic session CSV output to the explicitly labelled demo adapter.

Client entitlement controls presentation only. Server-side RevenueCat verification remains required before premium API authorization can be considered production secure.
