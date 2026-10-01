# Stage 4D — Mobile Offline Experience

## Status

Local mobile implementation complete. Not pushed. Native device behavior still requires a development build check.

## Mobile-only implementation

- Uses Expo Network to observe device connectivity.
- Shows a persistent offline banner with a clear explanation.
- Disables camera and library upload actions while the device is known to be offline.
- Guards the receipt flow again when an upload action is invoked.
- Keeps already loaded dashboard and expense information visible.
- Treats the initial unknown network state as non-blocking to avoid false offline messages during startup.

## Temporarily mocked dependencies

None. Connectivity comes from the native Expo module. No offline upload queue is simulated.

## Waiting for main BizExpense

- No shared API change is required for basic offline detection.
- A future resumable upload or idempotency contract would be required before adding an offline receipt queue.

## Future sync from main

- Upload idempotency keys or resumable-upload contract, if introduced.
- Standard API error codes for connection and retry behavior.

## Deliberately out of scope

- Persisting new expenses offline.
- Queuing receipt files in device storage.
- Background upload and retry.
- Conflict resolution.

These require a stable shared API contract and separate privacy/storage review.

## Local validation

- Full mobile tests: 9/9 passed across 4 files.
- `npx tsc --noEmit`: passed.
- `npx eslint .`: passed.
