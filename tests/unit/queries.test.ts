import { describe, it, expect } from 'vitest';
import { localizedField, byOrder, featured, bySlug, resolveRef } from '../../src/content/queries';

describe('localizedField', () => {
  const data = { name_zh: '老李', name_en: 'Lao Li', bio_zh: '经验丰富' };

  it('returns the English value on en when present', () => {
    expect(localizedField(data, 'name', 'en')).toBe('Lao Li');
  });

  it('falls back to Chinese on en when English is missing', () => {
    expect(localizedField(data, 'bio', 'en')).toBe('经验丰富');
  });

  it('returns Chinese on zh regardless of English', () => {
    expect(localizedField(data, 'name', 'zh')).toBe('老李');
  });
});

describe('byOrder', () => {
  it('sorts ascending by order', () => {
    const items = [{ order: 3 }, { order: 1 }, { order: 2 }];
    expect(byOrder(items).map((i) => i.order)).toEqual([1, 2, 3]);
  });

  it('is stable for equal order', () => {
    const a = { order: 1, slug: 'a' };
    const b = { order: 1, slug: 'b' };
    expect(byOrder([a, b])).toEqual([a, b]);
  });

  it('does not mutate the input array', () => {
    const items = [{ order: 2 }, { order: 1 }];
    byOrder(items);
    expect(items.map((i) => i.order)).toEqual([2, 1]);
  });
});

describe('featured', () => {
  it('returns only featured entries', () => {
    const items = [
      { slug: 'a', featured: true },
      { slug: 'b', featured: false },
      { slug: 'c' },
    ];
    expect(featured(items).map((i) => i.slug)).toEqual(['a']);
  });
});

describe('bySlug', () => {
  const items = [{ slug: 'a' }, { slug: 'b' }];
  it('returns the matching entry', () => {
    expect(bySlug(items, 'b')).toEqual({ slug: 'b' });
  });
  it('returns undefined when no entry matches', () => {
    expect(bySlug(items, 'z')).toBeUndefined();
  });
});

describe('resolveRef', () => {
  const vehicles = [{ slug: 'hiace' }, { slug: 'sedan' }];
  it('resolves an existing reference', () => {
    expect(resolveRef(vehicles, 'hiace')).toEqual({ slug: 'hiace' });
  });
  it('returns undefined for an unresolved reference', () => {
    expect(resolveRef(vehicles, 'bus')).toBeUndefined();
  });
  it('returns undefined for an absent (undefined) reference', () => {
    expect(resolveRef(vehicles, undefined)).toBeUndefined();
  });
});
