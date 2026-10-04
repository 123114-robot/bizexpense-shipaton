import { describe, expect, it } from 'vitest';

import { reviewOcrDraft } from './ocr-review';

describe('OCR review safeguards', () => {
  it('accepts a consistent receipt', () => {
    expect(reviewOcrDraft({
      supplier: 'Harbour Cafe', date: '2026-10-02', subtotal: '27.18', gst: '2.72', total: '29.90', confidence: 0.92, invoiceNumber: 'R-100',
    })).toEqual({ errors: [], warnings: [] });
  });

  it('blocks placeholder suppliers, invalid dates and inconsistent totals', () => {
    const result = reviewOcrDraft({
      supplier: 'Unknown supplier', date: '02/10/2026', subtotal: '27.18', gst: '2.72', total: '50.00', confidence: 0.92, invoiceNumber: null,
    });

    expect(result.errors).toEqual([
      'Replace the unknown supplier name.',
      'Enter the receipt date as YYYY-MM-DD.',
      'Total must equal subtotal plus GST.',
    ]);
    expect(result.warnings).toContain('Invoice number was not detected.');
  });

  it('warns without blocking when OCR confidence is low', () => {
    const result = reviewOcrDraft({
      supplier: 'Harbour Cafe', date: '2026-10-02', subtotal: '27.18', gst: '2.72', total: '29.90', confidence: 0.54, invoiceNumber: null,
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      'OCR confidence is low; verify every field.',
      'Invoice number was not detected.',
    ]);
  });
});
