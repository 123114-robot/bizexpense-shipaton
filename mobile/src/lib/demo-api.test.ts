import { describe, expect, it } from 'vitest';
import { createDemoApi } from './demo-api';

describe('standalone mobile demo API', () => {
  it('supports dashboard, list, and manual expense creation in one session', async () => {
    const api = createDemoApi();
    const initialDashboard = await api.dashboard();
    expect((await api.expenses())).toHaveLength(2);
    expect(initialDashboard.average_expense).toBe('79.75');
    expect(initialDashboard.top_suppliers).toEqual([
      { supplier: 'Acme Office Supplies', total: '110.00', expense_count: 1 },
      { supplier: 'Cloud Tools', total: '49.50', expense_count: 1 },
    ]);
    await api.createExpense({ supplier_name: 'Demo Taxi', category_id: 2, document_id: null, invoice_number: null, invoice_date: '2026-09-30', due_date: null, subtotal: 20, gst_amount: 2, total_amount: 22, currency: 'AUD', description: 'Airport transfer', ocr_confidence: null, ocr_confirmed: true });
    expect((await api.expenses())).toHaveLength(3);
    expect((await api.dashboard()).expense_count).toBe(3);
  });

  it('simulates receipt OCR and updates the visible allowance', async () => {
    const api = createDemoApi();
    const document = await api.uploadReceipt();
    expect(document.id).toBeGreaterThan(0);
    expect((await api.extractReceipt()).supplier_name).toBe('Harbour Café');
    expect((await api.ocrUsage()).used).toBe(3);
  });

  it('updates and deletes an existing expense', async () => {
    const api = createDemoApi();
    const existing = (await api.expenses())[0];
    const updated = await api.updateExpense(existing.id, { ...existing, description: 'Updated printer supplies' });
    expect(updated.description).toBe('Updated printer supplies');
    expect((await api.expenses())[0].description).toBe('Updated printer supplies');

    await api.deleteExpense(existing.id);
    expect((await api.expenses()).some((expense) => expense.id === existing.id)).toBe(false);
    expect((await api.dashboard()).expense_count).toBe(1);
  });

  it('exports the current demo expenses as CSV', async () => {
    const api = createDemoApi();
    const csv = await api.exportExpenses();
    expect(csv).toContain('Date,Supplier,Category,Description,Total,Currency');
    expect(csv).toContain('Acme Office Supplies');
  });

  it('returns a non-blocking warning for matching supplier, invoice, and total', async () => {
    const api = createDemoApi();
    const existing = (await api.expenses())[0];
    const duplicate = await api.createExpense({ supplier_name: existing.supplier_name, category_id: existing.category_id, document_id: null, invoice_number: existing.invoice_number, invoice_date: existing.invoice_date, due_date: null, subtotal: existing.subtotal, gst_amount: existing.gst_amount, total_amount: existing.total_amount, currency: existing.currency, description: 'Duplicate demo receipt', ocr_confidence: 0.9, ocr_confirmed: true });

    expect(duplicate.duplicate_warning).toBe(true);
    expect(duplicate.duplicate_expense_id).toBe(existing.id);
    expect((await api.expenses())).toHaveLength(3);
  });
});
