# Stage 5D — RevenueCat-Gated Mobile Analytics

## Mobile-only implementation

- Reuses the authenticated mainline Dashboard category and six-month trend response.
- Displays category totals and a compact mobile trend chart only when the RevenueCat `pro` entitlement is active.
- Keeps Free users behind the existing RevenueCat paywall action.
- Adds equivalent analytics data to the explicitly labelled standalone demo adapter.

## Boundaries

The Mobile client does not grant server access based on local entitlement state. Main BizExpense still needs server-side RevenueCat verification before unlimited OCR or any sensitive Pro API can be enforced securely.

RevenueCat products, offering, paywall configuration, SDK keys, signed native builds, purchase testing, and restore testing remain account/device work and cannot be completed from repository code alone.
