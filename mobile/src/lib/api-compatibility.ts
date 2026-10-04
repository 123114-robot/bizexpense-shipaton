import { ApiError } from './api';

export type ApiCompatibility =
  | { status: 'ready' }
  | { status: 'incompatible' | 'unreachable'; message: string };

export async function checkMainlineApi(
  healthCheck: () => Promise<{ status: string }>,
): Promise<ApiCompatibility> {
  try {
    const health = await healthCheck();
    if (health.status === 'ok') return { status: 'ready' };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        status: 'incompatible',
        message: 'This backend is older than the authenticated BizExpense mainline.',
      };
    }
  }

  return {
    status: 'unreachable',
    message: 'BizExpense API is unreachable. Check EXPO_PUBLIC_API_URL and the backend service.',
  };
}
