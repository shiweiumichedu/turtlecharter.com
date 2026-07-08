import { describe, it, expect } from 'vitest';
import {
  localizedField,
  byOrder,
  featured,
  bySlug,
  resolveRef,
  destinationForRoute,
  attractionByName,
  resolvePlace,
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

describe('destinationForRoute', () => {
  const destinations = [
    { slug: 'kunming', region: '昆明' },
    { slug: 'dali', region: '大理' },
    { slug: 'lijiang', region: '丽江' },
  ];

  it('matches the first (primary) region a route lists', () => {
    const route = { regions: ['昆明', '大理', '丽江'] };
    expect(destinationForRoute(destinations, route)?.slug).toBe('kunming');
  });

  it('falls through to a later region when the first has no destination', () => {
    const route = { regions: ['香格里拉', '大理'] };
    expect(destinationForRoute(destinations, route)?.slug).toBe('dali');
  });

  it('returns undefined when no region matches', () => {
    expect(destinationForRoute(destinations, { regions: ['西双版纳'] })).toBeUndefined();
  });

  it('returns undefined when the route has no regions', () => {
    expect(destinationForRoute(destinations, {})).toBeUndefined();
  });
});

describe('attractionByName', () => {
  const attractions = [
    { slug: 'erhai', name_zh: '洱海', name_en: 'Erhai Lake' },
    { slug: 'yulong', name_zh: '玉龙雪山', name_en: 'Jade Dragon Snow Mountain' },
  ];

  it('matches a Chinese highlight label', () => {
    expect(attractionByName(attractions, '洱海')?.slug).toBe('erhai');
  });
  it('matches an English highlight label', () => {
    expect(attractionByName(attractions, 'Jade Dragon Snow Mountain')?.slug).toBe('yulong');
  });
  it('returns undefined for an unmatched label (falls back to text)', () => {
    expect(attractionByName(attractions, '双廊')).toBeUndefined();
  });
});

describe('resolvePlace', () => {
  const destinations = [{ slug: 'kunming', image: '/d/kunming.jpg' }];
  const attractions = [{ slug: 'pudacuo', image: '/a/pudacuo.jpg' }];

  it('resolves a destination slug', () => {
    expect(resolvePlace(destinations, attractions, 'kunming')?.image).toBe('/d/kunming.jpg');
  });
  it('falls through to attractions when not a destination', () => {
    expect(resolvePlace(destinations, attractions, 'pudacuo')?.image).toBe('/a/pudacuo.jpg');
  });
  it('returns undefined for an unknown slug', () => {
    expect(resolvePlace(destinations, attractions, 'nowhere')).toBeUndefined();
  });
  it('returns undefined for an absent slug (day with no place)', () => {
    expect(resolvePlace(destinations, attractions, undefined)).toBeUndefined();
  });
});
