import { describe, expect, it } from 'vitest';
import { hasProEntitlement, revenueCatKeyForPlatform } from './entitlements';

describe('RevenueCat entitlement gating', () => {
  it('unlocks Pro only when the pro entitlement is active', () => {
    expect(hasProEntitlement(undefined)).toBe(false);
    expect(hasProEntitlement({ other: {} })).toBe(false);
    expect(hasProEntitlement({ pro: {} })).toBe(true);
  });

  it('selects only the current platform key', () => {
    const keys = { ios: 'ios-key', android: 'android-key', web: 'web-key' };
    expect(revenueCatKeyForPlatform('ios', keys)).toBe('ios-key');
    expect(revenueCatKeyForPlatform('android', keys)).toBe('android-key');
    expect(revenueCatKeyForPlatform('web', keys)).toBe('web-key');
  });
});
