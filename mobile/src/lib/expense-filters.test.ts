import { describe, expect, it } from 'vitest';

import { buildExpenseQuery } from './expense-filters';

describe('expense filters', () => {
  it('omits empty filters', () => {
    expect(buildExpenseQuery({ search: '  ', ocr_confirmed: 'all' })).toBe('');
  });

  it('encodes search and confirmation status for the mainline API', () => {
    expect(buildExpenseQuery({ search: 'Harbour & Co', ocr_confirmed: 'confirmed' }))
      .toBe('?search=Harbour+%26+Co&ocr_confirmed=true');
    expect(buildExpenseQuery({ search: '', ocr_confirmed: 'draft' }))
      .toBe('?ocr_confirmed=false');
  });
});
