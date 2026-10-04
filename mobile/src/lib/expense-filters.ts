export type ExpenseFilterState = {
  search: string;
  ocr_confirmed: 'all' | 'confirmed' | 'draft';
};

export function buildExpenseQuery(filters?: ExpenseFilterState): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  const search = filters.search.trim();
  if (search) params.set('search', search);
  if (filters.ocr_confirmed !== 'all') params.set('ocr_confirmed', String(filters.ocr_confirmed === 'confirmed'));
  const query = params.toString();
  return query ? `?${query}` : '';
}
