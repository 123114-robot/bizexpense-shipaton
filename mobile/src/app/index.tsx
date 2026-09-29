import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api, DashboardSummary } from '@/lib/api';

export default function DashboardScreen() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    try { setSummary(await api.dashboard()); }
    catch (error) { Alert.alert('Backend unavailable', error instanceof Error ? error.message : 'Check EXPO_PUBLIC_API_URL.'); }
    finally { setRefreshing(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
    <Text style={styles.eyebrow}>BIZEXPENSE</Text><Text style={styles.title}>Money, sorted.</Text>
    <Text style={styles.subtitle}>Your existing BizExpense data, now mobile-first.</Text>
    <View style={styles.grid}><Metric label="This month" value={`$${summary?.expenses_this_month ?? '—'}`} /><Metric label="GST tracked" value={`$${summary?.gst_paid ?? '—'}`} /><Metric label="All expenses" value={`$${summary?.total_expenses ?? '—'}`} /><Metric label="Records" value={String(summary?.expense_count ?? '—')} /></View>
  </ScrollView></SafeAreaView>;
}

function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F5F7FB' }, content: { padding: 22, paddingBottom: 120, gap: 18 }, eyebrow: { color: '#1B6EF3', fontWeight: '900', letterSpacing: 2 }, title: { fontSize: 34, fontWeight: '900', color: '#10213B' }, subtitle: { color: '#5D687A', fontSize: 16 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '48%', minHeight: 95 }, metricLabel: { color: '#758096' }, metricValue: { fontSize: 23, fontWeight: '800', color: '#14213D', marginTop: 8 } });
