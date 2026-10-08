export type ReceiptAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  file?: File;
};

const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export function receiptMimeType(asset: Pick<ReceiptAsset, 'fileName' | 'mimeType'>): string | null {
  if (asset.mimeType && SUPPORTED_MIME_TYPES.has(asset.mimeType)) return asset.mimeType;
  const name = asset.fileName?.toLowerCase() ?? '';
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  return null;
}

export function validateReceiptFile(asset: Omit<ReceiptAsset, 'uri'>): string | null {
  if (asset.fileSize != null && asset.fileSize > MAX_RECEIPT_BYTES) {
    return 'Receipt files must be 10 MB or smaller.';
  }
  if (!receiptMimeType(asset)) return 'Choose a PDF, JPEG, or PNG receipt.';
  return null;
}
