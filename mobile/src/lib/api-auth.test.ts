import { afterEach, describe, expect, it, vi } from 'vitest';

import { request } from './api';
import { onUnauthorized, setAccessToken } from './session-token';

describe('authenticated API requests', () => {
  afterEach(() => {
    setAccessToken(null);
    vi.unstubAllGlobals();
  });

  it('adds the current bearer token', async () => {
    setAccessToken('test-token');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await request('/auth/me');

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('clears the token and announces unauthorized responses', async () => {
    setAccessToken('expired-token');
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ detail: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    )));

    await expect(request('/expenses')).rejects.toMatchObject({ status: 401 });

    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });
});
