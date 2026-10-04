# Stage 5E — Demo Startup Reliability

- Waits for the first Expo Web bundle to complete instead of cancelling the request every two seconds.
- Prevents overlapping Metro bundle requests during cold startup.
- Extends the Playwright scenario timeout for slower Windows development machines.
- Keeps generated receipt inputs and recordings outside Git while preserving one-command reproduction.
