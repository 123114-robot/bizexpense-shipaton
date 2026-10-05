# Stage 5G — Mobile Expense Editing and Deletion

- Reuses the authenticated mainline `PUT /api/expenses/{id}` and `DELETE /api/expenses/{id}` endpoints.
- Prefills the existing Mobile expense form for corrections.
- Preserves document, invoice, OCR confidence, confirmation, and currency fields while editing.
- Requires an explicit destructive confirmation before deletion.
- Implements the same session-only behavior in standalone demo mode.
