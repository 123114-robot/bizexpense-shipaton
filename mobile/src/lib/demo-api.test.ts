import { describe, expect, it } from 'vitest';
import { createDemoApi } from './demo-api';

describe('standalone mobile demo API', () => {
  it('supports dashboard, list, and manual expense creation in one session', async () => {
    const api = createDemoApi();
    expect((await api.expenses())).toHaveLength(2);
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
});
