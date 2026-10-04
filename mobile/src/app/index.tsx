import * as ImagePicker from 'expo-image-picker';
import { useNetworkState } from 'expo-network';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExpenseForm } from '@/components/expense-form';
import { ProAnalytics } from '@/components/pro-analytics';
import { api, DashboardSummary, DEMO_MODE, OCRResult } from '@/lib/api';
import { isOffline } from '@/lib/connectivity';
import { isQuotaExceeded, loadOcrQuota, OCRQuotaState } from '@/lib/ocr-quota';
import { supportIdLabel } from '@/lib/subscription-identity';
import { useAuth } from '@/providers/auth-provider';
import { useSubscription } from '@/providers/subscription-provider';

export default function DashboardScreen() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [refreshing, setRefreshing] = useState(false);
  const [receipt, setReceipt] = useState<{ documentId: number; ocr: OCRResult }>();
  const [processing, setProcessing] = useState(false);
  const [quota, setQuota] = useState<OCRQuotaState>({ status: 'loading' });
  const networkState = useNetworkState();
  const offline = isOffline(networkState);
  const uploadBlocked = offline && !DEMO_MODE;
  const subscription = useSubscription();
  const auth = useAuth();
  const load = useCallback(async () => {
    try {
      const [dashboard, ocrQuota] = await Promise.all([api.dashboard(), loadOcrQuota(api.ocrUsage)]);
      setSummary(dashboard);
      setQuota(ocrQuota);
    } catch (e) { Alert.alert('Backend unavailable', e instanceof Error ? e.message : 'Check EXPO_PUBLIC_API_URL.'); }
    finally { setRefreshing(false); }
  }, []);
  useEffect(() => {
    // Initial remote data synchronization is intentionally started on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleAsset(asset: ImagePicker.ImagePickerAsset) {
    try { setProcessing(true); const document = await api.uploadReceipt(asset); setReceipt({ documentId: document.id, ocr: await api.extractReceipt(document.id) }); }
    catch (error) {
      if (isQuotaExceeded(error)) {
        Alert.alert('Monthly OCR limit reached', 'Upgrade to Pro or enter this expense manually.', [
          { text: 'Not now', style: 'cancel' },
          { text: 'View Pro', onPress: subscription.showPaywall },
        ]);
        setQuota(await loadOcrQuota(api.ocrUsage));
      } else {
        Alert.alert('Receipt processing failed', error instanceof Error ? error.message : 'Unknown error');
      }
    }
    finally { setProcessing(false); }
  }
  async function choose(source: 'camera' | 'library') {
    if (uploadBlocked) {
      Alert.alert('You are offline', 'Connect to the internet before uploading a receipt.');
      return;
    }
    if (source === 'camera') { const permission = await ImagePicker.requestCameraPermissionsAsync(); if (!permission.granted) { Alert.alert('Camera permission required'); return; } }
    const result = source === 'camera' ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) await handleAsset(result.assets[0]);
  }

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
    {DEMO_MODE && <View style={styles.demoBanner}><Text style={styles.demoTitle}>Interactive demo mode</Text><Text style={styles.demoCopy}>Using in-memory sample data. Changes reset when the app restarts.</Text></View>}
    {offline && <View style={styles.offlineBanner}><Text style={styles.offlineTitle}>Offline mode</Text><Text style={styles.offlineCopy}>Saved data remains visible. Receipt uploads and refreshes need an internet connection.</Text></View>}
    <View style={styles.heading}><View><Text style={styles.eyebrow}>BIZEXPENSE</Text><Text style={styles.title}>Money, sorted.</Text></View><View style={[styles.badge, subscription.isPro && styles.proBadge]}><Text style={styles.badgeText}>{subscription.isPro ? 'PRO' : 'FREE'}</Text></View></View><Text style={styles.subtitle}>Capture receipts, verify OCR, and keep GST totals accurate.</Text>
    {!DEMO_MODE && <View style={styles.accountRow}><Text style={styles.accountText}>{auth.user?.email}</Text><Pressable onPress={() => void auth.logout()}><Text style={styles.signOut}>Sign out</Text></Pressable></View>}
    <View style={styles.grid}><Metric label="This month" value={`$${summary?.expenses_this_month ?? '—'}`} /><Metric label="GST tracked" value={`$${summary?.gst_paid ?? '—'}`} /><Metric label="All expenses" value={`$${summary?.total_expenses ?? '—'}`} /><Metric label="Records" value={String(summary?.expense_count ?? '—')} /></View>
    <Text style={styles.section}>Add a receipt</Text><View style={styles.row}><Action title="Take photo" disabled={uploadBlocked} onPress={() => choose('camera')} /><Action title="Choose image" disabled={uploadBlocked} onPress={() => choose('library')} /></View>
    {processing && <View style={styles.processing}><ActivityIndicator /><Text>Uploading and extracting receipt…</Text></View>}
    <QuotaCard quota={quota} proDetected={subscription.isPro} onUpgrade={subscription.showPaywall} />
    {subscription.isPro && summary && <ProAnalytics summary={summary} />}
    <View style={styles.proCard}><Text style={styles.proTitle}>Advanced reports · Pro</Text><Text style={styles.proCopy}>{subscription.isPro ? 'Your Pro entitlement is active. Advanced reporting is unlocked.' : 'Upgrade through RevenueCat to unlock analytics and export features.'}</Text>{!subscription.isPro && <Action title="View Pro paywall" onPress={subscription.showPaywall} />}<Pressable onPress={subscription.restore}><Text style={styles.restore}>Restore purchases</Text></Pressable><View style={styles.identity}><Text style={styles.identityLabel}>Subscription identity · {subscription.identityMode}</Text><Text selectable style={styles.supportId}>{supportIdLabel(subscription.appUserId)}</Text></View>{subscription.message && <Text style={styles.message}>{subscription.message}</Text>}</View>
  </ScrollView><Modal visible={Boolean(receipt)} animationType="slide" onRequestClose={() => setReceipt(undefined)}>{receipt && <ExpenseForm documentId={receipt.documentId} ocr={receipt.ocr} onCancel={() => setReceipt(undefined)} onSaved={() => { setReceipt(undefined); load(); Alert.alert('Expense confirmed'); }} />}</Modal></SafeAreaView>;
}
function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>; }
function Action({ title, onPress, disabled = false }: { title: string; onPress: () => void | Promise<void>; disabled?: boolean }) { return <Pressable disabled={disabled} style={[styles.action, disabled && styles.actionDisabled]} onPress={onPress}><Text style={styles.actionText}>{title}</Text></Pressable>; }
function QuotaCard({ quota, proDetected, onUpgrade }: { quota: OCRQuotaState; proDetected: boolean; onUpgrade: () => Promise<void> }) {
  if (quota.status === 'loading') return <View style={styles.quotaCard}><ActivityIndicator /><Text>Checking OCR allowance…</Text></View>;
  if (quota.status === 'unavailable') return <View style={styles.quotaCard}><Text style={styles.quotaTitle}>OCR allowance unavailable</Text><Text style={styles.quotaCopy}>Waiting for the shared BizExpense quota API. OCR remains controlled by the backend response.</Text>{proDetected && <Text style={styles.quotaNote}>Pro subscription detected on this device; server access is not assumed.</Text>}</View>;
  const unlimited = quota.limit === null;
  return <View style={styles.quotaCard}><Text style={styles.quotaTitle}>{unlimited ? 'OCR · Unlimited' : `Free OCR · ${quota.remaining} remaining`}</Text><Text style={styles.quotaCopy}>{unlimited ? `${quota.used} scans used this month. Unlimited access was confirmed by the backend.` : `${quota.used} of ${quota.limit} monthly scans used.`}</Text>{!unlimited && <Pressable onPress={onUpgrade}><Text style={styles.upgradeLink}>Upgrade to Pro</Text></Pressable>}</View>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F5F7FB' }, content: { padding: 22, paddingBottom: 120, gap: 18 }, demoBanner: { backgroundColor: '#E8F2FF', borderColor: '#80B5FF', borderWidth: 1, borderRadius: 14, padding: 14, gap: 3 }, demoTitle: { color: '#164A8A', fontWeight: '900' }, demoCopy: { color: '#245B9B' }, offlineBanner: { backgroundColor: '#FFF0D6', borderColor: '#F0B44D', borderWidth: 1, borderRadius: 14, padding: 14, gap: 3 }, offlineTitle: { color: '#713F12', fontWeight: '900' }, offlineCopy: { color: '#854D0E', lineHeight: 19 }, heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: '#1B6EF3', fontWeight: '900', letterSpacing: 2 }, title: { fontSize: 34, fontWeight: '900', color: '#10213B' }, subtitle: { color: '#5D687A', fontSize: 16, lineHeight: 23 }, accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E8EEF8', padding: 12, borderRadius: 12 }, accountText: { color: '#43516A' }, signOut: { color: '#1B6EF3', fontWeight: '800' }, badge: { backgroundColor: '#DDE5F0', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 }, proBadge: { backgroundColor: '#FFD166' }, badgeText: { fontWeight: '900', color: '#17233B' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '48%', minHeight: 95 }, metricLabel: { color: '#758096' }, metricValue: { fontSize: 23, fontWeight: '800', color: '#14213D', marginTop: 8 }, section: { fontSize: 20, fontWeight: '800', color: '#14213D' }, row: { flexDirection: 'row', gap: 10 }, action: { backgroundColor: '#1B6EF3', padding: 14, borderRadius: 12, flex: 1, alignItems: 'center' }, actionDisabled: { backgroundColor: '#98A2B3' }, actionText: { color: '#FFF', fontWeight: '800' }, processing: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12 }, quotaCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 17, gap: 7 }, quotaTitle: { color: '#17233B', fontSize: 17, fontWeight: '800' }, quotaCopy: { color: '#667085', lineHeight: 20 }, quotaNote: { color: '#B26A00', fontWeight: '700' }, upgradeLink: { color: '#1B6EF3', fontWeight: '800' }, proCard: { backgroundColor: '#16233B', borderRadius: 18, padding: 20, gap: 12 }, proTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' }, proCopy: { color: '#CAD2E1', lineHeight: 21 }, restore: { color: '#9DC0FF', textAlign: 'center', fontWeight: '700', padding: 5 }, identity: { borderTopWidth: 1, borderTopColor: '#34425B', paddingTop: 12, gap: 4 }, identityLabel: { color: '#CAD2E1', fontWeight: '700' }, supportId: { color: '#9DC0FF', fontSize: 12 }, message: { color: '#FFD166', textAlign: 'center' } });
