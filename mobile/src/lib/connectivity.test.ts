import { describe, expect, it } from 'vitest';
import { isOffline } from './connectivity';

describe('mobile connectivity state', () => {
  it('treats a known disconnected or unreachable network as offline', () => {
    expect(isOffline({ isConnected: false })).toBe(true);
    expect(isOffline({ isConnected: true, isInternetReachable: false })).toBe(true);
  });

  it('does not block while the native network state is still unknown', () => {
    expect(isOffline({})).toBe(false);
    expect(isOffline({ isConnected: true, isInternetReachable: true })).toBe(false);
  });
});
