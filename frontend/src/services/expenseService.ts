import { api } from './api'
import type { Category, Dashboard, Expense, ExpenseInput } from '../types/expense'

export interface ExportFilters {
  start_date?: string
  end_date?: string
  category_id?: number
}

export const expenseService = {
  list: (search = '') => api<Expense[]>(`/expenses?search=${encodeURIComponent(search)}`),
  get: (id: string) => api<Expense>(`/expenses/${id}`),
  create: (data: ExpenseInput) => api<Expense>('/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  update: (id: string, data: ExpenseInput) => api<Expense>(`/expenses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  remove: (id: string) => api<void>(`/expenses/${id}`, { method: 'DELETE' }),
  categories: () => api<Category[]>('/categories'),
  dashboard: () => api<Dashboard>('/dashboard/summary'),

  exportCsv: async (filters: ExportFilters = {}): Promise<void> => {
    const params = new URLSearchParams()
    if (filters.start_date) params.set('start_date', filters.start_date)
    if (filters.end_date) params.set('end_date', filters.end_date)
    if (filters.category_id != null) params.set('category_id', String(filters.category_id))
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await fetch(`/api/expenses/export${query}`)
    if (!response.ok) throw new Error('Export failed')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'bizexpense_export.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  },
}
