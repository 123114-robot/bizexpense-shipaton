type OcrDraft = {
  supplier: string;
  date: string;
  subtotal: string;
  gst: string;
  total: string;
  confidence: number;
  invoiceNumber: string | null;
};

export function reviewOcrDraft(draft: OcrDraft): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const supplier = draft.supplier.trim().toLowerCase();
  const amounts = [draft.subtotal, draft.gst, draft.total].map(Number);

  if (!supplier || supplier === 'unknown supplier') errors.push('Replace the unknown supplier name.');
  if (!isIsoDate(draft.date)) errors.push('Enter the receipt date as YYYY-MM-DD.');
  if (amounts.some((amount) => !Number.isFinite(amount) || amount < 0) || amounts[2] <= 0) {
    errors.push('Enter valid non-negative receipt amounts.');
  } else if (Math.abs(amounts[0] + amounts[1] - amounts[2]) > 0.02) {
    errors.push('Total must equal subtotal plus GST.');
  }
  if (draft.confidence < 0.75) warnings.push('OCR confidence is low; verify every field.');
  if (!draft.invoiceNumber) warnings.push('Invoice number was not detected.');

  return { errors, warnings };
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
