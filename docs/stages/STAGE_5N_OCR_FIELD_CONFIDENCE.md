# Stage 5N — OCR field confidence review

## Mobile-only implementation

- Accepts optional `field_confidence` values from the shared OCR response.
- Lists provider-derived fields below the mainline 70% threshold.
- Highlights editable low-confidence fields and shows their percentages.
- Makes the detected invoice number editable during OCR review.
- Keeps overall-confidence validation as a fallback when the field map is absent.
- Demo Mode returns clearly labelled deterministic field-confidence data.

## Mainline dependency

The response contract currently exists on `phase-19-ocr-field-confidence` and is not yet merged into BizExpense `main`. Mobile treats the property as optional for backwards compatibility. Confidence values come from the configured OCR provider; Mobile does not invent production confidence scores.

## Remaining validation

Provider confidence and OCR accuracy still require representative real-invoice validation in the shared BizExpense project.
