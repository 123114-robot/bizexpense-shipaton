export const PRO_ENTITLEMENT = 'pro';

export function hasProEntitlement(active: Record<string, unknown> | undefined): boolean {
  return Boolean(active?.[PRO_ENTITLEMENT]);
}

export function revenueCatKeyForPlatform(
  platform: string,
  keys: { ios?: string; android?: string; web?: string },
): string | undefined {
  if (platform === 'ios') return keys.ios;
  if (platform === 'android') return keys.android;
  return keys.web;
}
