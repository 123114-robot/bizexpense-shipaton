import type { Category, DashboardSummary, Expense, ExpenseInput, OCRResult, OCRUsageResponse } from './api';
import type { ExpenseFilterState } from './expense-filters';

const categories: Category[] = [
  { id: 1, name: 'Office Supplies' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Software' },
  { id: 4, name: 'Meals' },
];

const initialExpenses: Expense[] = [
  { id: 1, supplier_name: 'Acme Office Supplies', category_id: 1, category_name: 'Office Supplies', document_id: 1, invoice_number: 'INV-204', invoice_date: '2026-09-28', due_date: null, subtotal: 100, gst_amount: 10, total_amount: 110, currency: 'AUD', description: 'Printer supplies', ocr_confidence: 0.92, ocr_confirmed: true },
  { id: 2, supplier_name: 'Cloud Tools', category_id: 3, category_name: 'Software', document_id: null, invoice_number: 'SUB-0926', invoice_date: '2026-09-24', due_date: null, subtotal: 45, gst_amount: 4.5, total_amount: 49.5, currency: 'AUD', description: 'Monthly software subscription', ocr_confidence: null, ocr_confirmed: true },
];

export function createDemoApi() {
  let expenses = initialExpenses.map((expense) => ({ ...expense }));
  let nextExpenseId = 3;
  let nextDocumentId = 10;
  let ocrUsed = 2;
  const ocrLimit = 5;

  return {
    async dashboard(): Promise<DashboardSummary> {
      const confirmed = expenses.filter((expense) => expense.ocr_confirmed);
      const total = confirmed.reduce((sum, expense) => sum + Number(expense.total_amount), 0);
      const gst = confirmed.reduce((sum, expense) => sum + Number(expense.gst_amount), 0);
      const categoryBreakdown = categories.map((category) => {
        const rows = confirmed.filter((expense) => expense.category_id === category.id);
        return { category: category.name, total: rows.reduce((sum, expense) => sum + Number(expense.total_amount), 0).toFixed(2), expense_count: rows.length };
      }).filter((item) => item.expense_count > 0);
      const supplierTotals = new Map<string, { total: number; expense_count: number }>();
      confirmed.forEach((expense) => {
        const current = supplierTotals.get(expense.supplier_name) ?? { total: 0, expense_count: 0 };
        supplierTotals.set(expense.supplier_name, { total: current.total + Number(expense.total_amount), expense_count: current.expense_count + 1 });
      });
      const topSuppliers = [...supplierTotals.entries()]
        .map(([supplier, value]) => ({ supplier, total: value.total.toFixed(2), expense_count: value.expense_count }))
        .sort((a, b) => Number(b.total) - Number(a.total))
        .slice(0, 5);
      return {
        total_expenses: total.toFixed(2), expenses_this_month: total.toFixed(2), gst_paid: gst.toFixed(2), expense_count: confirmed.length,
        average_expense: confirmed.length ? (total / confirmed.length).toFixed(2) : '0.00',
        top_suppliers: topSuppliers,
        category_breakdown: categoryBreakdown,
        monthly_trend: [
          { month: '2026-05', total: '0.00' }, { month: '2026-06', total: '34.00' }, { month: '2026-07', total: '72.50' },
          { month: '2026-08', total: '46.20' }, { month: '2026-09', total: total.toFixed(2) }, { month: '2026-10', total: total.toFixed(2) },
        ],
      };
    },
    async expenses(filters?: ExpenseFilterState): Promise<Expense[]> {
      const search = filters?.search.trim().toLowerCase();
      return expenses.filter((expense) => {
        const matchesSearch = !search || `${expense.supplier_name} ${expense.description}`.toLowerCase().includes(search);
        const matchesStatus = !filters || filters.ocr_confirmed === 'all' || expense.ocr_confirmed === (filters.ocr_confirmed === 'confirmed');
        const matchesCategory = !filters?.category_id || expense.category_id === filters.category_id;
        const matchesStart = !filters?.date_from || expense.invoice_date >= filters.date_from;
        const matchesEnd = !filters?.date_to || expense.invoice_date <= filters.date_to;
        return matchesSearch && matchesStatus && matchesCategory && matchesStart && matchesEnd;
      }).map((expense) => ({ ...expense }));
    },
    async categories(): Promise<Category[]> { return categories.map((category) => ({ ...category })); },
    async createExpense(payload: ExpenseInput): Promise<Expense> {
      const category = categories.find((item) => item.id === payload.category_id) ?? categories[0];
      const expense: Expense = { ...payload, id: nextExpenseId++, category_name: category.name };
      expenses = [expense, ...expenses];
      return { ...expense };
    },
    async updateExpense(id: number, payload: ExpenseInput): Promise<Expense> {
      const index = expenses.findIndex((expense) => expense.id === id);
      if (index < 0) throw Object.assign(new Error('Expense not found'), { status: 404 });
      const category = categories.find((item) => item.id === payload.category_id) ?? categories[0];
      const updated: Expense = { ...payload, id, category_name: category.name };
      expenses[index] = updated;
      return { ...updated };
    },
    async deleteExpense(id: number): Promise<void> {
      expenses = expenses.filter((expense) => expense.id !== id);
    },
    async exportExpenses(): Promise<string> {
      const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
      const rows = expenses.map((expense) => [expense.invoice_date, expense.supplier_name, expense.category_name, expense.description, expense.total_amount, expense.currency].map(escape).join(','));
      return ['Date,Supplier,Category,Description,Total,Currency', ...rows].join('\n');
    },
    async uploadReceipt(): Promise<{ id: number }> { return { id: nextDocumentId++ }; },
    async extractReceipt(): Promise<OCRResult> {
      if (ocrUsed >= ocrLimit) throw Object.assign(new Error('Monthly OCR limit reached'), { status: 429 });
      ocrUsed += 1;
      return { supplier_name: 'Harbour Café', abn: '12 345 678 901', invoice_number: 'DEMO-302', invoice_date: new Date().toISOString().slice(0, 10), due_date: null, subtotal: 27.18, gst: 2.72, total: 29.9, currency: 'AUD', confidence: 0.94, confirmed: false };
    },
    async ocrUsage(): Promise<OCRUsageResponse> { return { used: ocrUsed, limit: ocrLimit, remaining: Math.max(0, ocrLimit - ocrUsed) }; },
  };
}
