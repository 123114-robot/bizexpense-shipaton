# Stage 5K — PDF and receipt file upload

## Mobile-only implementation

- Keeps camera and photo-library capture.
- Adds the Expo document picker for PDF, JPEG and PNG receipts.
- Rejects unsupported formats and files larger than 10 MB before upload.
- Preserves the selected filename and MIME type for the authenticated mainline upload endpoint.
- Keeps offline, upload, OCR and review errors visible to the user.

## Mainline dependency

The Mobile app uses the existing `POST /api/documents/upload` and `POST /api/documents/{id}/extract` endpoints. BizExpense mainline remains responsible for content-signature validation, tenant authorization, storage and OCR processing. Mainline Phase 18 processes at most the first five PDF pages when local Tesseract OCR is enabled.

## Prototype boundary

Demo mode still returns labelled deterministic sample OCR. Real PDF OCR requires a configured mainline OCR provider and representative invoice validation.
