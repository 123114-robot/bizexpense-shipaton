export function csvExportFileName(now = new Date()): string {
  return `bizexpense-expenses-${now.toISOString().slice(0, 10)}.csv`;
}
