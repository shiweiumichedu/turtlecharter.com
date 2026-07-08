// Zod schemas for the content collections.
// Defined with the standalone `zod` package (not `astro:content`) so they can be
// unit-tested directly; content.config.ts registers these same schemas with Astro.
import { z } from 'zod';

/** A bilingual text field: `${base}_zh` required, `${base}_en` optional. */
function bilingual(base: string, { required = true }: { required?: boolean } = {}) {
  return {
    [`${base}_zh`]: required ? z.string().min(1) : z.string().optional(),
    [`${base}_en`]: z.string().optional(),
  } as const;
}

/** Fields shared by list-style collections. */
const listable = {
  order: z.number().default(0),
  featured: z.boolean().default(false),
};

export const driverSchema = z.object({
  slug: z.string().min(1),
  ...bilingual('name'),
  photo: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  years_experience: z.number().int().nonnegative().optional(),
  regions: z.array(z.string()).default([]),
  vehicle: z.string().optional(), // ref: vehicles.slug
  specialties_zh: z.array(z.string()).default([]),
  specialties_en: z.array(z.string()).default([]),
  ...bilingual('bio', { required: false }),
  ...listable,
});

export const vehicleSchema = z.object({
  slug: z.string().min(1),
  ...bilingual('name'),
  type: z.enum(['sedan', 'suv', 'van', 'minibus']),
  seats: z.number().int().positive(),
  luggage: z.number().int().nonnegative().optional(),
  photo: z.string().optional(),
  features_zh: z.array(z.string()).default([]),
  features_en: z.array(z.string()).default([]),
  day_rate_cny: z.number().nonnegative(),
  ...bilingual('day_rate_note', { required: false }),
  order: z.number().default(0),
});

export const routeSchema = z.object({
  slug: z.string().min(1),
  ...bilingual('title'),
  days: z.number().int().positive(),
  cover: z.string().optional(),
  regions: z.array(z.string()).default([]),
  highlights_zh: z.array(z.string()).default([]),
  highlights_en: z.array(z.string()).default([]),
  pricing_mode: z.enum(['package', 'per_day']),
  pricing: z
    .array(z.object({ vehicle_type: z.string(), price_cny: z.number().nonnegative() }))
    .default([]),
  ...bilingual('price_note', { required: false }),
  // Optional structured day-by-day plan; `place` refs a destination or attraction slug
  // so each day can show that place's photo. Routes without it keep a prose itinerary.
  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive(),
        place: z.string().optional(),
        ...bilingual('title'),
      }),
    )
    .default([]),
  ...listable,
});

export const attractionSchema = z.object({
  slug: z.string().min(1),
  ...bilingual('name'),
  region: z.string().optional(),
  image: z.string().min(1),
  ...bilingual('alt', { required: false }), // image alt text; falls back to name
  ...bilingual('blurb', { required: false }),
  credit: z.string().optional(),
  ...listable,
});

export const destinationSchema = z.object({
  slug: z.string().min(1),
  ...bilingual('name'),
  region: z.string().min(1), // must match the strings used in route `regions`
  image: z.string().min(1),
  ...bilingual('alt', { required: false }), // image alt text; falls back to name
  ...bilingual('blurb', { required: false }),
  credit: z.string().optional(),
  ...listable,
});

export const testimonialSchema = z.object({
  ...bilingual('author'),
  avatar: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  route: z.string().optional(), // ref: routes.slug
  driver: z.string().optional(), // ref: drivers.slug
  date: z.coerce.date().optional(),
  ...bilingual('quote'),
  ...listable,
});

export const faqSchema = z.object({
  category: z.enum(['pricing', 'booking', 'logistics', 'payment', 'general']),
  order: z.number().default(0),
  ...bilingual('question'),
});
