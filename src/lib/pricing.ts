// Presentation helpers for prices. Kept separate from content/queries (data)
// because this is display logic, reused by vehicle and route pages.

const grouper = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** Format a CNY amount as `¥` + thousands-grouped integer, e.g. 1300 → "¥1,300". */
export function formatCny(amount: number): string {
  return `¥${grouper.format(amount)}`;
}

/** A single vehicle-type price row from a route's `pricing` array. */
export interface PriceRow {
  vehicle_type: string;
  price_cny: number;
}

/**
 * Lowest `price_cny` across a route's pricing rows — the "from" price shown on
 * route cards. Returns `undefined` for an empty array so callers can omit the teaser.
 */
export function lowestPriceCny(pricing: readonly PriceRow[]): number | undefined {
  if (pricing.length === 0) return undefined;
  return Math.min(...pricing.map((row) => row.price_cny));
}
