# Stage 5P — Mobile demo regression

## Completed

- Updated the Playwright walkthrough for the editable invoice-number field introduced in Stage 5N.
- Verifies the labelled deterministic OCR result and the 64% invoice-number confidence warning.
- Verifies the OCR draft does not change Dashboard KPIs before confirmation.
- Verifies confirmation saves the expense and updates Dashboard totals, GST and record count.
- Keeps the generated recording and Playwright artifacts outside version control.
- Extends the Expo cold-start readiness window to three minutes before declaring startup failure.

## Prototype boundary

This automated recording runs with `EXPO_PUBLIC_DEMO_MODE=true`. It validates the Mobile interaction and confirmed-expense transition, not live Tesseract/Vision accuracy, backend persistence or RevenueCat billing.
