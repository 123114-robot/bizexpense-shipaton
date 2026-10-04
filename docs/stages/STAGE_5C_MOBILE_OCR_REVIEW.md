# Stage 5C — Mobile OCR Review Safeguards

## Mobile-only implementation

- Flags low OCR confidence and missing invoice numbers for manual review.
- Blocks confirmation when the supplier is still a placeholder.
- Validates an actual ISO receipt date rather than accepting malformed text.
- Rejects negative/invalid amounts and totals that do not equal subtotal plus GST.
- Keeps every extracted field editable before confirmation.

## Shared mainline dependency

The main BizExpense backend still owns image extraction and parser accuracy. This stage does not duplicate or replace Tesseract, document persistence, authentication, or OCR APIs.

Production-grade OCR still requires representative receipt validation and parser hardening in main BizExpense. The Mobile app now fails safely when extraction returns obviously unusable accounting values.
