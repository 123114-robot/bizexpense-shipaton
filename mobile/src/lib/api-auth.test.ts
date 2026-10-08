import { afterEach, describe, expect, it, vi } from 'vitest';

import { request } from './api';
import { onUnauthorized, setAccessToken, setSessionTokens } from './session-token';

describe('authenticated API requests', () => {
  afterEach(() => {
    setSessionTokens(null, null);
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

  it('rotates the session and retries once after an expired access token', async () => {
    setSessionTokens('expired-token', 'refresh-token-that-is-long-enough');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token-that-is-long-enough',
        token_type: 'bearer',
        user: { id: 1, name: 'Demo', email: 'demo@example.com', role: 'user' },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(request<{ ok: boolean }>('/expenses')).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toContain('/auth/refresh');
    expect(JSON.parse(fetchMock.mock.calls[1][1]?.body as string)).toEqual({
      refresh_token: 'refresh-token-that-is-long-enough',
    });
    const retryHeaders = new Headers(fetchMock.mock.calls[2][1]?.headers);
    expect(retryHeaders.get('Authorization')).toBe('Bearer new-access-token');
  });
});
