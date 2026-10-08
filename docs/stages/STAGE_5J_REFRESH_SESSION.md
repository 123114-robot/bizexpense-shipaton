# Stage 5J — Mobile refresh session

## Mobile-only implementation

- Stores the access and refresh token pair in SecureStore on native platforms and existing browser storage on web.
- Rotates the refresh token through the mainline `POST /api/auth/refresh` endpoint after an authenticated request returns `401`.
- Retries the original request once with the replacement access token.
- Calls `POST /api/auth/logout` during sign-out and always clears the local session, including when the API is unavailable.

## Mainline dependency

BizExpense mainline remains responsible for issuing, validating, rotating and revoking tokens. The Mobile app does not implement authentication rules or trust locally stored identity data as authorization.

## Remaining dependency

Production deployment must provide the mainline API URL and a production-safe server configuration. Web storage remains prototype behavior; a future browser deployment should use the mainline's planned secure cookie design.
