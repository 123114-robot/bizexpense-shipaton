import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExpenseForm } from '@/components/expense-form';
import { api, DashboardSummary, OCRResult } from '@/lib/api';

export default function DashboardScreen() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [refreshing, setRefreshing] = useState(false);
  const [receipt, setReceipt] = useState<{ documentId: number; ocr: OCRResult }>();
  const [processing, setProcessing] = useState(false);
  const load = useCallback(async () => { try { setSummary(await api.dashboard()); } catch (e) { Alert.alert('Backend unavailable', e instanceof Error ? e.message : 'Check EXPO_PUBLIC_API_URL.'); } finally { setRefreshing(false); } }, []);
  useEffect(() => { load(); }, [load]);

  async function handleAsset(asset: ImagePicker.ImagePickerAsset) {
    try { setProcessing(true); const document = await api.uploadReceipt(asset); setReceipt({ documentId: document.id, ocr: await api.extractReceipt(document.id) }); }
    catch (error) { Alert.alert('Receipt processing failed', error instanceof Error ? error.message : 'Unknown error'); }
    finally { setProcessing(false); }
  }
  async function choose(source: 'camera' | 'library') {
    if (source === 'camera') { const permission = await ImagePicker.requestCameraPermissionsAsync(); if (!permission.granted) { Alert.alert('Camera permission required'); return; } }
    const result = source === 'camera' ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) await handleAsset(result.assets[0]);
  }

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
    <Text style={styles.eyebrow}>BIZEXPENSE</Text><Text style={styles.title}>Money, sorted.</Text><Text style={styles.subtitle}>Capture receipts, verify OCR, and keep GST totals accurate.</Text>
    <View style={styles.grid}><Metric label="This month" value={`$${summary?.expenses_this_month ?? '—'}`} /><Metric label="GST tracked" value={`$${summary?.gst_paid ?? '—'}`} /><Metric label="All expenses" value={`$${summary?.total_expenses ?? '—'}`} /><Metric label="Records" value={String(summary?.expense_count ?? '—')} /></View>
    <Text style={styles.section}>Add a receipt</Text><View style={styles.row}><Action title="Take photo" onPress={() => choose('camera')} /><Action title="Choose image" onPress={() => choose('library')} /></View>
    {processing && <View style={styles.processing}><ActivityIndicator /><Text>Uploading and extracting receipt…</Text></View>}
  </ScrollView><Modal visible={Boolean(receipt)} animationType="slide" onRequestClose={() => setReceipt(undefined)}>{receipt && <ExpenseForm documentId={receipt.documentId} ocr={receipt.ocr} onCancel={() => setReceipt(undefined)} onSaved={() => { setReceipt(undefined); load(); Alert.alert('Expense confirmed'); }} />}</Modal></SafeAreaView>;
}
function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>; }
function Action({ title, onPress }: { title: string; onPress: () => void | Promise<void> }) { return <Pressable style={styles.action} onPress={onPress}><Text style={styles.actionText}>{title}</Text></Pressable>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F5F7FB' }, content: { padding: 22, paddingBottom: 120, gap: 18 }, eyebrow: { color: '#1B6EF3', fontWeight: '900', letterSpacing: 2 }, title: { fontSize: 34, fontWeight: '900', color: '#10213B' }, subtitle: { color: '#5D687A', fontSize: 16, lineHeight: 23 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '48%', minHeight: 95 }, metricLabel: { color: '#758096' }, metricValue: { fontSize: 23, fontWeight: '800', color: '#14213D', marginTop: 8 }, section: { fontSize: 20, fontWeight: '800', color: '#14213D' }, row: { flexDirection: 'row', gap: 10 }, action: { backgroundColor: '#1B6EF3', padding: 14, borderRadius: 12, flex: 1, alignItems: 'center' }, actionText: { color: '#FFF', fontWeight: '800' }, processing: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12 } });
