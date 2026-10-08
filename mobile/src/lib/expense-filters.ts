export type ExpenseFilterState = {
  search: string;
  ocr_confirmed: 'all' | 'confirmed' | 'draft';
  category_id: number | null;
  date_from: string;
  date_to: string;
};

export function buildExpenseQuery(filters?: ExpenseFilterState): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  const search = filters.search.trim();
  if (search) params.set('search', search);
  if (filters.ocr_confirmed !== 'all') params.set('ocr_confirmed', String(filters.ocr_confirmed === 'confirmed'));
  if (filters.category_id !== null) params.set('category_id', String(filters.category_id));
  if (filters.date_from) params.set('date_from', filters.date_from);
  if (filters.date_to) params.set('date_to', filters.date_to);
  const query = params.toString();
  return query ? `?${query}` : '';
}
