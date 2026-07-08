import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  driverSchema,
  vehicleSchema,
  routeSchema,
  testimonialSchema,
  faqSchema,
} from './content/schemas';

const drivers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drivers' }),
  schema: driverSchema,
});

const vehicles = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/vehicles' }),
  schema: vehicleSchema,
});

const routes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/routes' }),
  schema: routeSchema,
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: testimonialSchema,
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: faqSchema,
});

export const collections = { drivers, vehicles, routes, testimonials, faq };
