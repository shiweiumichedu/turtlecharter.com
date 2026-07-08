// Presentation helpers for prices. Kept separate from content/queries (data)
// because this is display logic, reused by vehicle and route pages.

const grouper = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** Format a CNY amount as `¥` + thousands-grouped integer, e.g. 1300 → "¥1,300". */
export function formatCny(amount: number): string {
  return `¥${grouper.format(amount)}`;
}
