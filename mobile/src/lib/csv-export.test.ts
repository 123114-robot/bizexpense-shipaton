import { describe, expect, it } from 'vitest';

import { csvExportFileName } from './csv-export-name';

describe('CSV export filename', () => {
  it('uses a stable date-based filename', () => {
    expect(csvExportFileName(new Date('2026-10-05T08:30:00Z'))).toBe('bizexpense-expenses-2026-10-05.csv');
  });
});
