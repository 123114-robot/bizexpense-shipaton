export function trendBarHeight(value: number, maximum: number): number {
  return Math.max(maximum > 0 ? (value / maximum) * 120 : 0, 2);
}
