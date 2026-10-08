import { describe, expect, it } from 'vitest';

import { buildExpenseQuery } from './expense-filters';

describe('expense filters', () => {
  it('omits empty filters', () => {
    expect(buildExpenseQuery({ search: '  ', ocr_confirmed: 'all', category_id: null, date_from: '', date_to: '' })).toBe('');
  });

  it('encodes search and confirmation status for the mainline API', () => {
    expect(buildExpenseQuery({ search: 'Harbour & Co', ocr_confirmed: 'confirmed', category_id: null, date_from: '', date_to: '' }))
      .toBe('?search=Harbour+%26+Co&ocr_confirmed=true');
    expect(buildExpenseQuery({ search: '', ocr_confirmed: 'draft', category_id: null, date_from: '', date_to: '' }))
      .toBe('?ocr_confirmed=false');
  });

  it('encodes category and date range filters', () => {
    expect(buildExpenseQuery({ search: '', ocr_confirmed: 'all', category_id: 4, date_from: '2026-09-01', date_to: '2026-09-30' }))
      .toBe('?category_id=4&date_from=2026-09-01&date_to=2026-09-30');
  });
});
