import { ApiError, OCRUsageResponse } from './api';

export type OCRQuotaState =
  | { status: 'loading' }
  | { status: 'available'; used: number; limit: number | null; remaining: number | null }
  | { status: 'unavailable' };

export async function loadOcrQuota(loader: () => Promise<OCRUsageResponse>): Promise<OCRQuotaState> {
  try {
    const usage = await loader();
    return { status: 'available', ...usage };
  } catch {
    return { status: 'unavailable' };
  }
}

export function isQuotaExceeded(error: unknown): boolean {
  return (error instanceof ApiError || (typeof error === 'object' && error !== null && 'status' in error)) && (error as { status: number }).status === 429;
}
