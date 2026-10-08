import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, Category, Expense, ExpenseInput, OCRResult } from '@/lib/api';
import { reviewOcrDraft } from '@/lib/ocr-review';

type Props = { documentId?: number; ocr?: OCRResult; expense?: Expense; onSaved: (saved: Expense) => void; onCancel: () => void };

export function ExpenseForm({ documentId, ocr, expense, onSaved, onCancel }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(expense?.category_id ?? 1);
  const [supplier, setSupplier] = useState(expense?.supplier_name ?? ocr?.supplier_name ?? '');
  const [date, setDate] = useState(expense?.invoice_date ?? ocr?.invoice_date ?? new Date().toISOString().slice(0, 10));
  const [subtotal, setSubtotal] = useState(String(expense?.subtotal ?? ocr?.subtotal ?? ''));
  const [gst, setGst] = useState(String(expense?.gst_amount ?? ocr?.gst ?? ''));
  const [total, setTotal] = useState(String(expense?.total_amount ?? ocr?.total ?? ''));
  const [description, setDescription] = useState(expense?.description ?? (ocr ? 'Receipt expense' : 'Business expense'));
  const [saving, setSaving] = useState(false);
  const review = ocr ? reviewOcrDraft({ supplier, date, subtotal, gst, total, confidence: ocr.confidence, invoiceNumber: ocr.invoice_number }) : null;
  useEffect(() => { api.categories().then((rows) => { setCategories(rows); if (!expense && rows[0]) setCategoryId(rows[0].id); }).catch((e) => Alert.alert('Categories unavailable', e.message)); }, [expense]);

  async function save() {
    const payload: ExpenseInput = { supplier_name: supplier.trim(), category_id: categoryId, document_id: documentId ?? expense?.document_id ?? null, invoice_number: expense?.invoice_number ?? ocr?.invoice_number ?? null, invoice_date: date, due_date: expense?.due_date ?? ocr?.due_date ?? null, subtotal: Number(subtotal), gst_amount: Number(gst), total_amount: Number(total), currency: expense?.currency ?? ocr?.currency ?? 'AUD', description: description.trim(), ocr_confidence: expense?.ocr_confidence ?? ocr?.confidence ?? null, ocr_confirmed: expense?.ocr_confirmed ?? true };
    if (!payload.supplier_name || !payload.description || [payload.subtotal, payload.gst_amount, payload.total_amount].some(Number.isNaN)) { Alert.alert('Check the form', 'Supplier, description and valid amounts are required.'); return; }
    if (review?.errors.length) { Alert.alert('Review OCR fields', review.errors.join('\n')); return; }
    try { setSaving(true); const saved = expense ? await api.updateExpense(expense.id, payload) : await api.createExpense(payload); onSaved(saved); }
    catch (error) { Alert.alert('Could not save', error instanceof Error ? error.message : 'Unknown error'); }
    finally { setSaving(false); }
  }

  return <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{expense ? 'Edit expense' : ocr ? 'Review OCR result' : 'New expense'}</Text>
    {ocr && <Text style={styles.note}>Review every field before confirming. OCR confidence: {Math.round(ocr.confidence * 100)}%</Text>}
    {review?.warnings.map((warning) => <Text key={warning} style={styles.warning}>⚠ {warning}</Text>)}
    {review?.errors.map((error) => <Text key={error} style={styles.error}>• {error}</Text>)}
    <Field label="Supplier" value={supplier} onChangeText={setSupplier} />
    <Field label="Invoice date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
    <Field label="Subtotal" value={subtotal} onChangeText={setSubtotal} keyboardType="decimal-pad" />
    <Field label="GST" value={gst} onChangeText={setGst} keyboardType="decimal-pad" />
    <Field label="Total" value={total} onChangeText={setTotal} keyboardType="decimal-pad" />
    <Field label="Description" value={description} onChangeText={setDescription} />
    <Text style={styles.label}>Category</Text>
    <View style={styles.chips}>{categories.map((c) => <Pressable key={c.id} onPress={() => setCategoryId(c.id)} style={[styles.chip, categoryId === c.id && styles.chipActive]}><Text style={categoryId === c.id ? styles.activeText : undefined}>{c.name}</Text></Pressable>)}</View>
    <Pressable disabled={saving} onPress={save} style={styles.primary}><Text style={styles.primaryText}>{saving ? 'Saving…' : expense ? 'Update expense' : ocr ? 'Confirm expense' : 'Save expense'}</Text></Pressable>
    <Pressable onPress={onCancel} style={styles.cancel}><Text>Cancel</Text></Pressable>
  </ScrollView>;
}

function Field({ label, ...props }: React.ComponentProps<typeof TextInput> & { label: string }) { return <View><Text style={styles.label}>{label}</Text><TextInput {...props} style={styles.input} /></View>; }
const styles = StyleSheet.create({ content: { padding: 24, gap: 12, backgroundColor: '#F6F7F9' }, title: { fontSize: 28, fontWeight: '800', color: '#14213D' }, note: { color: '#5C677D' }, warning: { color: '#9A6700', lineHeight: 20 }, error: { color: '#B42318', lineHeight: 20 }, label: { fontWeight: '600', color: '#25324B', marginBottom: 5 }, input: { backgroundColor: '#FFF', borderColor: '#D8DEE9', borderWidth: 1, borderRadius: 12, padding: 13, fontSize: 16 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { borderWidth: 1, borderColor: '#C8D0DC', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }, chipActive: { backgroundColor: '#1B6EF3', borderColor: '#1B6EF3' }, activeText: { color: '#FFF', fontWeight: '700' }, primary: { backgroundColor: '#1B6EF3', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8 }, primaryText: { color: '#FFF', fontWeight: '800', fontSize: 16 }, cancel: { alignItems: 'center', padding: 12 } });
