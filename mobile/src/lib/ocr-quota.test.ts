import { describe, expect, it, vi } from 'vitest';
import { ApiError } from './api';
import { isQuotaExceeded, loadOcrQuota } from './ocr-quota';

describe('mobile OCR quota adapter', () => {
  it('normalizes usage returned by the shared backend', async () => {
    const state = await loadOcrQuota(async () => ({ used: 2, limit: 5, remaining: 3 }));
    expect(state).toEqual({ status: 'available', used: 2, limit: 5, remaining: 3 });
  });

  it('uses an explicit unavailable state while the shared API is missing', async () => {
    const state = await loadOcrQuota(vi.fn().mockRejectedValue(new ApiError(404, 'Not Found')));
    expect(state).toEqual({ status: 'unavailable' });
  });

  it('recognizes the shared backend quota response without trusting client entitlement state', () => {
    expect(isQuotaExceeded(new ApiError(429, 'Monthly OCR limit reached'))).toBe(true);
    expect(isQuotaExceeded(new ApiError(500, 'Server error'))).toBe(false);
  });
});
