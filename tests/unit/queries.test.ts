import { describe, it, expect } from 'vitest';
import {
  localizedField,
  byOrder,
  featured,
  bySlug,
  resolveRef,
  groupByCategory,
  FAQ_CATEGORY_ORDER,
} from '../../src/content/queries';
import { faqSchema } from '../../src/content/schemas';

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

describe('groupByCategory (FAQ)', () => {
  const entries = [
    { category: 'booking', order: 2, question_zh: 'b2' },
    { category: 'pricing', order: 2, question_zh: 'p2' },
    { category: 'pricing', order: 1, question_zh: 'p1' },
    { category: 'booking', order: 1, question_zh: 'b1' },
  ];

  it('returns groups in the fixed category order', () => {
    const groups = groupByCategory(entries);
    expect(groups.map((g) => g.category)).toEqual(['pricing', 'booking']);
  });

  it('sorts entries within each group by order', () => {
    const groups = groupByCategory(entries);
    const pricing = groups.find((g) => g.category === 'pricing');
    expect(pricing?.items.map((i) => i.question_zh)).toEqual(['p1', 'p2']);
  });

  it('drops categories with no entries', () => {
    const groups = groupByCategory([{ category: 'general', order: 1 }]);
    expect(groups.map((g) => g.category)).toEqual(['general']);
  });

  it('covers every faqSchema category enum value', () => {
    const enumValues = faqSchema.shape.category.options;
    for (const value of enumValues) {
      expect(FAQ_CATEGORY_ORDER).toContain(value);
    }
  });
});
