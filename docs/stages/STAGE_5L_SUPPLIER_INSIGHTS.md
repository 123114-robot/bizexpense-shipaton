# Stage 5L — Mobile supplier insights

## Mobile-only implementation

- Displays the mainline `average_expense` metric in the RevenueCat-gated Pro analytics area.
- Displays the five tenant-scoped `top_suppliers` with confirmed expense counts and totals.
- Keeps empty-state messaging when no confirmed supplier data exists.
- Updates labelled Demo Mode with deterministic supplier analytics.

## Mainline dependency

BizExpense mainline owns the calculations, tenant isolation and the rule that Dashboard statistics include only expenses where `ocr_confirmed = true`. Mobile only renders the returned summary and does not recalculate production analytics.

## Prototype boundary

RevenueCat controls the Mobile presentation. Formal Pro API authorization must still be enforced by the shared backend before these analytics are treated as a production entitlement.
