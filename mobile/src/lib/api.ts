const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

export type DashboardSummary = { total_expenses: string; expenses_this_month: string; gst_paid: string; expense_count: number };
export type Category = { id: number; name: string };
export type Expense = { id: number; supplier_name: string; category_id: number; category_name: string; document_id: number | null; invoice_number: string | null; invoice_date: string; due_date: string | null; subtotal: number; gst_amount: number; total_amount: number; currency: string; description: string; ocr_confidence: number | null; ocr_confirmed: boolean };
export type ExpenseInput = Omit<Expense, 'id' | 'category_name'>;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  dashboard: () => request<DashboardSummary>('/dashboard/summary'),
  expenses: () => request<Expense[]>('/expenses'),
  categories: () => request<Category[]>('/categories'),
  createExpense: (payload: ExpenseInput) => request<Expense>('/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
};
