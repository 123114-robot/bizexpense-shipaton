import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi, AuthUser, DEMO_MODE } from '@/lib/api';
import { loadStoredToken, storeToken } from '@/lib/auth-storage';
import { onUnauthorized, setAccessToken } from '@/lib/session-token';

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
    setAccessToken(null);
    await storeToken(null);
    setUser(null);
  }, []);

  useEffect(() => onUnauthorized(() => { void logout(); }), [logout]);

  useEffect(() => {
    if (DEMO_MODE) return;
    void (async () => {
      try {
        const token = await loadStoredToken();
        if (!token) return;
        setAccessToken(token);
        setUser(await authApi.me());
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [logout]);

  const acceptAuth = useCallback(async (operation: Promise<{ access_token: string; user: AuthUser }>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operation;
      setAccessToken(response.access_token);
      await storeToken(response.access_token);
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
