import { describe, it, expect } from 'vitest';
import {
  driverSchema,
  vehicleSchema,
  routeSchema,
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
