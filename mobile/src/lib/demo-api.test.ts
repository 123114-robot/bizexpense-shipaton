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
});
