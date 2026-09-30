# Project Tasks

## Completed in this MVP

- [x] Phase 0: planning package, architecture, data model, API and test strategy
- [x] Phase 1: Vite/React/TypeScript/Tailwind and FastAPI/SQLAlchemy foundations
- [x] Phase 2: validated expense CRUD, supplier reuse, seeded user/categories and search
- [x] Phase 3: validated local document upload and stored metadata
- [x] Phase 4A: OCR provider abstraction and deterministic Mock provider
- [x] Phase 4B: Tesseract PNG/JPEG prototype and basic invoice field parser
- [ ] Phase 4C: validation against a representative real-invoice dataset
- [ ] Phase 4D: parser hardening for varied layouts and OCR errors
- [x] Phase 5 (mock workflow): editable review and explicit confirmation
- [x] Database-backed dashboard summary
- [x] Backend unit/integration tests and frontend critical-flow tests

## Intentionally deferred

- [ ] Alembic migrations and production deployment configuration
- [ ] PDF OCR, field-level confidence and cloud OCR provider
- [ ] Authentication, roles and tenant isolation
- [ ] Duplicate warning using supplier + invoice number + total
- [ ] Advanced filters, CSV/accounting export and analytics
- [ ] Object storage, malware scanning and document retention policy
- [ ] Accessibility and browser E2E hardening

## Shipaton mobile stages

- [x] Stage 1 code: mobile dashboard, expense list/detail, manual expense entry, existing FastAPI reuse
- [x] Stage 2 code: receipt camera/library selection, upload, OCR review/edit, explicit confirmation
- [x] Stage 3 code: RevenueCat SDK configuration, `pro` entitlement gate, paywall, restore purchases, missing-key fallback
- [ ] Configure RevenueCat products, offering, paywall, and public platform API keys
- [ ] Implement server-backed monthly Free OCR quota (current OCR flow is not quota-limited)
- [ ] Implement the actual Pro analytics/export/report features behind the entitlement gate
- [ ] Validate purchase and restore flows in iOS/Android development builds
- [ ] Run device-level end-to-end demo and prepare submission video
- [x] Stage 4A local repository setup: EAS build profiles, app identity, configuration check, and handoff record
- [ ] Stage 4A account verification: link EAS project, confirm platform identifiers, configure RevenueCat dashboard, and complete a development build
- [x] Stage 4B local MVP identity: expose RevenueCat anonymous identity and support ID with documented migration boundaries
- [ ] Stage 4B production identity: add backend authentication, custom App User IDs, account recovery, and cross-device verification
- [x] Stage 4C mobile quota UX: adapter, unavailable/loading/usage states, 429 handling, and upgrade prompt
- [ ] Stage 4C shared dependency: authenticated server quota API and server-verified Pro access from main BizExpense
- [x] Stage 4D mobile offline UX: connectivity banner, guarded receipt actions, and focused tests
- [ ] Future offline queue: wait for upload idempotency/resume contract from main BizExpense
