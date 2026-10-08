# Stage 5M — Mobile duplicate expense warning

## Mobile-only implementation

- Reads `duplicate_warning` and `duplicate_expense_id` from mainline Expense responses.
- Shows a non-blocking warning after manual creation, OCR confirmation or editing.
- Keeps the warning visible in expense details.
- Demo Mode mirrors the mainline supplier, invoice-number and total matching rule.

## Mainline dependency

BizExpense mainline owns tenant-scoped duplicate detection and returns the matching expense ID. Mobile does not block or remove the saved record and does not treat its local comparison as a production control.
