import { describe, expect, it } from 'vitest';
import { subscriptionIdentityMode, supportIdLabel } from './subscription-identity';

describe('subscription identity', () => {
  it('distinguishes unconfigured, anonymous, and identified customers', () => {
    expect(subscriptionIdentityMode(false)).toBe('unavailable');
    expect(subscriptionIdentityMode(true, true)).toBe('anonymous');
    expect(subscriptionIdentityMode(true, false)).toBe('identified');
  });

  it('provides a safe support label before RevenueCat is configured', () => {
    expect(supportIdLabel(null)).toBe('Available after RevenueCat configuration');
    expect(supportIdLabel('$RCAnonymousID:test')).toBe('$RCAnonymousID:test');
  });
});
