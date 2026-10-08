import { createDemoApi } from './demo-api';
import { announceUnauthorized, getAccessToken, getRefreshToken, replaceSessionTokens } from './session-token';
import { buildExpenseQuery, ExpenseFilterState } from './expense-filters';
import { receiptMimeType, ReceiptAsset } from './receipt-file';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export type DashboardSummary = {
  total_expenses: string;
  expenses_this_month: string;
  gst_paid: string;
  expense_count: number;
  average_expense: string;
  top_suppliers: { supplier: string; total: string; expense_count: number }[];
  category_breakdown: { category: string; total: string; expense_count: number }[];
  monthly_trend: { month: string; total: string }[];
};
export type Category = { id: number; name: string };
export type Expense = { id: number; supplier_name: string; category_id: number; category_name: string; document_id: number | null; invoice_number: string | null; invoice_date: string; due_date: string | null; subtotal: number; gst_amount: number; total_amount: number; currency: string; description: string; ocr_confidence: number | null; ocr_confirmed: boolean; duplicate_warning: boolean; duplicate_expense_id: number | null };
export type ExpenseInput = Omit<Expense, 'id' | 'category_name' | 'duplicate_warning' | 'duplicate_expense_id'>;
export type OCRResult = { supplier_name: string; abn: string | null; invoice_number: string | null; invoice_date: string; due_date: string | null; subtotal: number; gst: number; total: number; currency: string; confidence: number; confirmed: boolean };
export type OCRUsageResponse = { used: number; limit: number | null; remaining: number | null };

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await requestResponse(path, init);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshSession(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError(401, 'Your session has expired.');
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).then(async (response) => {
      if (!response.ok) throw new ApiError(response.status, 'Your session has expired.');
      const session = await response.json() as AuthResponse;
      await replaceSessionTokens(session.access_token, session.refresh_token);
      return session;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function requestResponse(path: string, init?: RequestInit, allowRefresh = true): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { detail?: string };
    if (response.status === 401 && allowRefresh && getRefreshToken()) {
      try {
        await refreshSession();
        return requestResponse(path, init, false);
      } catch {
        await replaceSessionTokens(null, null);
        announceUnauthorized();
      }
    } else if (response.status === 401) {
      await replaceSessionTokens(null, null);
      announceUnauthorized();
    }
    throw new ApiError(response.status, body.detail || `Request failed (${response.status})`);
  }
  return response;
}

const remoteApi = {
  dashboard: () => request<DashboardSummary>('/dashboard/summary'),
  expenses: (filters?: ExpenseFilterState) => request<Expense[]>(`/expenses${buildExpenseQuery(filters)}`),
  categories: () => request<Category[]>('/categories'),
  createExpense: (payload: ExpenseInput) => request<Expense>('/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  updateExpense: (id: number, payload: ExpenseInput) => request<Expense>(`/expenses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  deleteExpense: (id: number) => request<void>(`/expenses/${id}`, { method: 'DELETE' }),
  exportExpenses: async () => (await requestResponse('/expenses/export.csv')).text(),
  uploadReceipt: (asset: ReceiptAsset) => {
    const body = new FormData();
    if (asset.file) body.append('file', asset.file, asset.fileName ?? asset.file.name);
    else body.append('file', { uri: asset.uri, name: asset.fileName ?? 'receipt.jpg', type: receiptMimeType(asset) ?? 'image/jpeg' } as never);
    return request<{ id: number }>('/documents/upload', { method: 'POST', body });
  },
  extractReceipt: (id: number) => request<OCRResult>(`/documents/${id}/extract`, { method: 'POST' }),
  ocrUsage: () => request<OCRUsageResponse>('/documents/ocr-usage'),
};

export const api = DEMO_MODE ? createDemoApi() : remoteApi;

export type AuthUser = { id: number; name: string; email: string; role: string };
export type AuthResponse = { access_token: string; refresh_token: string; token_type: string; user: AuthUser };
export const authApi = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<AuthResponse>('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) }),
  logout: (refreshToken: string) => request<void>('/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refreshToken }) }),
  me: () => request<AuthUser>('/auth/me'),
};

export const systemApi = {
  health: () => request<{ status: string }>('/health'),
};
