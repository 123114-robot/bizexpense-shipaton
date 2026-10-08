import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi, AuthUser, DEMO_MODE } from '@/lib/api';
import { loadStoredSession, storeSession } from '@/lib/auth-storage';
import { configureSessionPersistence, getRefreshToken, onUnauthorized, replaceSessionTokens, setSessionTokens } from '@/lib/session-token';

configureSessionPersistence(storeSession);

type AuthValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(DEMO_MODE ? { id: 0, name: 'Demo User', email: 'demo@bizexpense.app', role: 'demo' } : null);
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Local sign-out must still succeed when the server is unavailable.
    } finally {
      await replaceSessionTokens(null, null);
      setUser(null);
    }
  }, []);

  useEffect(() => onUnauthorized(() => { void logout(); }), [logout]);

  useEffect(() => {
    if (DEMO_MODE) return;
    void (async () => {
      try {
        const session = await loadStoredSession();
        if (!session.access) return;
        setSessionTokens(session.access, session.refresh);
        setUser(await authApi.me());
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [logout]);

  const acceptAuth = useCallback(async (operation: Promise<{ access_token: string; refresh_token: string; user: AuthUser }>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operation;
      await replaceSessionTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user, loading, error,
    login: (email, password) => acceptAuth(authApi.login(email.trim(), password)),
    register: (name, email, password) => acceptAuth(authApi.register(name.trim(), email.trim(), password)),
    logout,
  }), [acceptAuth, error, loading, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be inside AuthProvider');
  return value;
}
