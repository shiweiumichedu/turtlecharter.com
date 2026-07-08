import { describe, it, expect } from 'vitest';
import {
  driverSchema,
  vehicleSchema,
  routeSchema,
  destinationSchema,
  attractionSchema,
  testimonialSchema,
  faqSchema,
} from '../../src/content/schemas';

describe('driverSchema', () => {
  it('accepts a valid entry', () => {
    expect(driverSchema.safeParse({ slug: 'lao-li', name_zh: '老李' }).success).toBe(true);
  });
  it('rejects a missing required Chinese name', () => {
    expect(driverSchema.safeParse({ slug: 'lao-li' }).success).toBe(false);
  });
  it('treats English as optional', () => {
    const r = driverSchema.safeParse({ slug: 'lao-li', name_zh: '老李' });
    expect(r.success).toBe(true);
  });

  it('captures optional bilingual bio fields', () => {
    const r = driverSchema.safeParse({
      slug: 'lao-li',
      name_zh: '老李',
      bio_zh: '中文简介',
      bio_en: 'English bio',
    });
    expect(r.success).toBe(true);
    expect(r.success && r.data.bio_en).toBe('English bio');
  });

  it('remains valid with no bio fields', () => {
    expect(driverSchema.safeParse({ slug: 'lao-li', name_zh: '老李' }).success).toBe(true);
  });
});

describe('vehicleSchema', () => {
  const base = { slug: 'hiace', name_zh: '海狮', seats: 9, day_rate_cny: 1300 };
  it('accepts a known vehicle type', () => {
    expect(vehicleSchema.safeParse({ ...base, type: 'van' }).success).toBe(true);
  });
  it('rejects an unknown vehicle type', () => {
    expect(vehicleSchema.safeParse({ ...base, type: 'boat' }).success).toBe(false);
  });
  it('rejects a negative day rate', () => {
    expect(vehicleSchema.safeParse({ ...base, type: 'van', day_rate_cny: -1 }).success).toBe(false);
  });
});

describe('routeSchema', () => {
  const base = { slug: 'r1', title_zh: '环线', days: 6, pricing: [{ vehicle_type: 'van', price_cny: 7200 }] };
  it('accepts package pricing', () => {
    expect(routeSchema.safeParse({ ...base, pricing_mode: 'package' }).success).toBe(true);
  });
  it('accepts per_day pricing', () => {
    expect(routeSchema.safeParse({ ...base, pricing_mode: 'per_day' }).success).toBe(true);
  });
  it('rejects an invalid pricing mode', () => {
    expect(routeSchema.safeParse({ ...base, pricing_mode: 'weekly' }).success).toBe(false);
  });
  it('defaults itinerary to an empty array', () => {
    const r = routeSchema.safeParse({ ...base, pricing_mode: 'package' });
    expect(r.success && r.data.itinerary).toEqual([]);
  });
  it('accepts structured itinerary days with an optional place ref', () => {
    const r = routeSchema.safeParse({
      ...base,
      pricing_mode: 'package',
      itinerary: [
        { day: 1, place: 'kunming', title_zh: '昆明抵达', title_en: 'Arrive Kunming' },
        { day: 2, title_zh: '返程' },
      ],
    });
    expect(r.success).toBe(true);
    expect(r.success && r.data.itinerary[0].place).toBe('kunming');
  });
  it('rejects an itinerary day missing its Chinese title', () => {
    const r = routeSchema.safeParse({
      ...base,
      pricing_mode: 'package',
      itinerary: [{ day: 1, place: 'kunming' }],
    });
    expect(r.success).toBe(false);
  });
});

describe('attractionSchema', () => {
  const base = { slug: 'erhai', name_zh: '洱海', image: '/images/attractions/erhai.jpg' };
  it('accepts a valid entry', () => {
    expect(attractionSchema.safeParse(base).success).toBe(true);
  });
  it('requires an image', () => {
    const { image, ...withoutImage } = base;
    expect(attractionSchema.safeParse(withoutImage).success).toBe(false);
  });
  it('treats region as optional', () => {
    expect(attractionSchema.safeParse({ ...base, region: '大理' }).success).toBe(true);
  });
});

describe('destinationSchema', () => {
  const base = { slug: 'dali', name_zh: '大理', region: '大理', image: '/images/destinations/dali.jpg' };
  it('accepts a valid entry', () => {
    expect(destinationSchema.safeParse(base).success).toBe(true);
  });
  it('requires a region', () => {
    const { region, ...withoutRegion } = base;
    expect(destinationSchema.safeParse(withoutRegion).success).toBe(false);
  });
  it('requires an image', () => {
    const { image, ...withoutImage } = base;
    expect(destinationSchema.safeParse(withoutImage).success).toBe(false);
  });
  it('keeps optional bilingual alt text', () => {
    const r = destinationSchema.safeParse({ ...base, alt_en: 'The Three Pagodas of Dali' });
    expect(r.success && r.data.alt_en).toBe('The Three Pagodas of Dali');
  });
});

describe('testimonialSchema', () => {
  it('accepts an entry with optional refs omitted', () => {
    expect(testimonialSchema.safeParse({ author_zh: 'Jane', quote_zh: '很好', rating: 5 }).success).toBe(true);
  });
  it('rejects a rating out of range', () => {
    expect(testimonialSchema.safeParse({ author_zh: 'Jane', quote_zh: '很好', rating: 9 }).success).toBe(false);
  });
});

describe('faqSchema', () => {
  it('accepts a known category', () => {
    expect(faqSchema.safeParse({ category: 'pricing', question_zh: '价格？' }).success).toBe(true);
  });
  it('rejects an unknown category', () => {
    expect(faqSchema.safeParse({ category: 'weather', question_zh: '价格？' }).success).toBe(false);
  });
});
