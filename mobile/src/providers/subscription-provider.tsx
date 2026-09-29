import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

import { hasProEntitlement, PRO_ENTITLEMENT, revenueCatKeyForPlatform } from '@/lib/entitlements';

type Value = { configured: boolean; isPro: boolean; loading: boolean; message: string | null; showPaywall: () => Promise<void>; restore: () => Promise<void> };
const Context = createContext<Value | null>(null);
const apiKey = revenueCatKeyForPlatform(Platform.OS, {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
  web: process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY,
});

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const [info, setInfo] = useState<CustomerInfo>();
  const [loading, setLoading] = useState(Boolean(apiKey));
  const [message, setMessage] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (!apiKey) return;
    try { setInfo(await Purchases.getCustomerInfo()); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load subscription.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey });
    const listener = (customerInfo: CustomerInfo) => setInfo(customerInfo);
    Purchases.addCustomerInfoUpdateListener(listener);
    // Synchronize the cached entitlement immediately after SDK setup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
  }, [refresh]);

  const showPaywall = useCallback(async () => {
    if (!apiKey) { setMessage('RevenueCat is not configured. Add the platform API key to .env.'); return; }
    try {
      await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: PRO_ENTITLEMENT, displayCloseButton: true });
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not open paywall.'); }
  }, [refresh]);

  const restore = useCallback(async () => {
    if (!apiKey) { setMessage('RevenueCat is not configured, so purchases cannot be restored.'); return; }
    try { setLoading(true); setInfo(await Purchases.restorePurchases()); setMessage('Purchases restored.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not restore purchases.'); }
    finally { setLoading(false); }
  }, []);

  const value = useMemo(() => ({ configured: Boolean(apiKey), isPro: hasProEntitlement(info?.entitlements.active), loading, message, showPaywall, restore }), [info, loading, message, restore, showPaywall]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSubscription() {
  const value = useContext(Context);
  if (!value) throw new Error('useSubscription must be inside SubscriptionProvider');
  return value;
}
