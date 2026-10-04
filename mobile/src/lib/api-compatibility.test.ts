import { describe, expect, it, vi } from 'vitest';

import { ApiError } from './api';
import { checkMainlineApi } from './api-compatibility';

describe('mainline API compatibility check', () => {
  it('accepts the authenticated BizExpense mainline health endpoint', async () => {
    await expect(checkMainlineApi(vi.fn().mockResolvedValue({ status: 'ok' }))).resolves.toEqual({ status: 'ready' });
  });

  it('identifies an older backend without the health endpoint', async () => {
    await expect(checkMainlineApi(vi.fn().mockRejectedValue(new ApiError(404, 'Not Found')))).resolves.toEqual({
      status: 'incompatible',
      message: 'This backend is older than the authenticated BizExpense mainline.',
    });
  });

  it('reports an unreachable API without pretending OCR is available', async () => {
    await expect(checkMainlineApi(vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))).resolves.toEqual({
      status: 'unreachable',
      message: 'BizExpense API is unreachable. Check EXPO_PUBLIC_API_URL and the backend service.',
    });
  });
});
