import { describe, it, expect } from 'vitest';
import { formatCny, lowestPriceCny } from '../../src/lib/pricing';

describe('formatCny', () => {
  it('formats with ¥ and thousands separators', () => {
    expect(formatCny(1300)).toBe('¥1,300');
    expect(formatCny(7200)).toBe('¥7,200');
  });

  it('formats amounts below 1000 without a separator', () => {
    expect(formatCny(800)).toBe('¥800');
  });

  it('formats zero', () => {
    expect(formatCny(0)).toBe('¥0');
  });
});

describe('lowestPriceCny', () => {
  it('returns the minimum price_cny across vehicle types', () => {
    expect(
      lowestPriceCny([
        { vehicle_type: 'van', price_cny: 1300 },
        { vehicle_type: 'sedan', price_cny: 800 },
      ]),
    ).toBe(800);
  });

  it('returns the single price when there is one entry', () => {
    expect(lowestPriceCny([{ vehicle_type: 'sedan', price_cny: 4800 }])).toBe(4800);
  });

  it('returns undefined for an empty pricing array', () => {
    expect(lowestPriceCny([])).toBeUndefined();
  });
});
