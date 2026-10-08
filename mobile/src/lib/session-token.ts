let accessToken: string | null = null;
let refreshToken: string | null = null;
let persistSession: (accessToken: string | null, refreshToken: string | null) => Promise<void> = async () => {};
const unauthorizedListeners = new Set<() => void>();

export function getAccessToken() { return accessToken; }
export function setAccessToken(token: string | null) { accessToken = token; }
export function getRefreshToken() { return refreshToken; }
export function setSessionTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;
}
export function configureSessionPersistence(
  persist: (access: string | null, refresh: string | null) => Promise<void>,
) {
  persistSession = persist;
}
export async function replaceSessionTokens(access: string | null, refresh: string | null) {
  setSessionTokens(access, refresh);
  await persistSession(access, refresh);
}
export function onUnauthorized(listener: () => void) {
  unauthorizedListeners.add(listener);
  return () => { unauthorizedListeners.delete(listener); };
}
export function announceUnauthorized() {
  unauthorizedListeners.forEach((listener) => listener());
}
