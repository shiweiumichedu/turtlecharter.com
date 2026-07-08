import { describe, it, expect } from 'vitest';
import { stars } from '../../src/lib/rating';

describe('stars', () => {
  it('renders a full five-star rating', () => {
    expect(stars(5)).toEqual([true, true, true, true, true]);
  });

  it('renders a partial rating as filled then empty', () => {
    expect(stars(4)).toEqual([true, true, true, true, false]);
  });

  it('always returns exactly five entries', () => {
    expect(stars(1)).toHaveLength(5);
    expect(stars(3)).toHaveLength(5);
  });

  it('clamps out-of-range ratings into 0..5', () => {
    expect(stars(0)).toEqual([false, false, false, false, false]);
    expect(stars(7)).toEqual([true, true, true, true, true]);
  });
});
