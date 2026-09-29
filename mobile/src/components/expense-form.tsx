import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, Category, ExpenseInput } from '@/lib/api';

type Props = { onSaved: () => void; onCancel: () => void };

export function ExpenseForm({ onSaved, onCancel }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(1);
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [subtotal, setSubtotal] = useState('');
  const [gst, setGst] = useState('');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('Business expense');
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.categories().then((rows) => { setCategories(rows); if (rows[0]) setCategoryId(rows[0].id); }).catch((e) => Alert.alert('Categories unavailable', e.message)); }, []);

  async function save() {
    const payload: ExpenseInput = { supplier_name: supplier.trim(), category_id: categoryId, document_id: null, invoice_number: null, invoice_date: date, due_date: null, subtotal: Number(subtotal), gst_amount: Number(gst), total_amount: Number(total), currency: 'AUD', description: description.trim(), ocr_confidence: null, ocr_confirmed: false };
    if (!payload.supplier_name || !payload.description || [payload.subtotal, payload.gst_amount, payload.total_amount].some(Number.isNaN)) { Alert.alert('Check the form', 'Supplier, description and valid amounts are required.'); return; }
    try { setSaving(true); await api.createExpense(payload); onSaved(); }
    catch (error) { Alert.alert('Could not save', error instanceof Error ? error.message : 'Unknown error'); }
    finally { setSaving(false); }
  }

  return <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>New expense</Text>
    <Field label="Supplier" value={supplier} onChangeText={setSupplier} />
    <Field label="Invoice date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
    <Field label="Subtotal" value={subtotal} onChangeText={setSubtotal} keyboardType="decimal-pad" />
    <Field label="GST" value={gst} onChangeText={setGst} keyboardType="decimal-pad" />
    <Field label="Total" value={total} onChangeText={setTotal} keyboardType="decimal-pad" />
    <Field label="Description" value={description} onChangeText={setDescription} />
    <Text style={styles.label}>Category</Text>
    <View style={styles.chips}>{categories.map((c) => <Pressable key={c.id} onPress={() => setCategoryId(c.id)} style={[styles.chip, categoryId === c.id && styles.chipActive]}><Text style={categoryId === c.id ? styles.activeText : undefined}>{c.name}</Text></Pressable>)}</View>
    <Pressable disabled={saving} onPress={save} style={styles.primary}><Text style={styles.primaryText}>{saving ? 'Saving…' : 'Save expense'}</Text></Pressable>
    <Pressable onPress={onCancel} style={styles.cancel}><Text>Cancel</Text></Pressable>
  </ScrollView>;
}

function Field({ label, ...props }: React.ComponentProps<typeof TextInput> & { label: string }) { return <View><Text style={styles.label}>{label}</Text><TextInput {...props} style={styles.input} /></View>; }
const styles = StyleSheet.create({ content: { padding: 24, gap: 12, backgroundColor: '#F6F7F9' }, title: { fontSize: 28, fontWeight: '800', color: '#14213D' }, label: { fontWeight: '600', color: '#25324B', marginBottom: 5 }, input: { backgroundColor: '#FFF', borderColor: '#D8DEE9', borderWidth: 1, borderRadius: 12, padding: 13, fontSize: 16 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { borderWidth: 1, borderColor: '#C8D0DC', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }, chipActive: { backgroundColor: '#1B6EF3', borderColor: '#1B6EF3' }, activeText: { color: '#FFF', fontWeight: '700' }, primary: { backgroundColor: '#1B6EF3', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8 }, primaryText: { color: '#FFF', fontWeight: '800', fontSize: 16 }, cancel: { alignItems: 'center', padding: 12 } });
