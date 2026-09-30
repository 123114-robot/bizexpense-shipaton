export type SubscriptionIdentityMode = 'anonymous' | 'identified' | 'unavailable';

export function subscriptionIdentityMode(configured: boolean, anonymous?: boolean): SubscriptionIdentityMode {
  if (!configured) return 'unavailable';
  return anonymous === false ? 'identified' : 'anonymous';
}

export function supportIdLabel(appUserId: string | null): string {
  return appUserId ?? 'Available after RevenueCat configuration';
}
