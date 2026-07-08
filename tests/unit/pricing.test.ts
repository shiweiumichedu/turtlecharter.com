import { describe, it, expect } from 'vitest';
import { formatCny } from '../../src/lib/pricing';

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
