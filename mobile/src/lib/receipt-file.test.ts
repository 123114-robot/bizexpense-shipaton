import { describe, expect, it } from 'vitest';

import { validateReceiptFile } from './receipt-file';

describe('receipt file validation', () => {
  it('accepts supported receipt files up to 10 MB', () => {
    expect(validateReceiptFile({ fileName: 'invoice.pdf', mimeType: 'application/pdf', fileSize: 10 * 1024 * 1024 })).toBeNull();
    expect(validateReceiptFile({ fileName: 'receipt.jpg', mimeType: 'image/jpeg', fileSize: 2000 })).toBeNull();
  });

  it('rejects unsupported types and oversized files before upload', () => {
    expect(validateReceiptFile({ fileName: 'invoice.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 2000 }))
      .toBe('Choose a PDF, JPEG, or PNG receipt.');
    expect(validateReceiptFile({ fileName: 'large.png', mimeType: 'image/png', fileSize: 10 * 1024 * 1024 + 1 }))
      .toBe('Receipt files must be 10 MB or smaller.');
  });
});
