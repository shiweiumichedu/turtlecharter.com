## Why

The `testimonials` and `faq` collections exist and the primary navigation already links to `/testimonials` and `/faq` — but both pages 404. Testimonials are the strongest social proof for an overseas visitor weighing a charter, and the FAQ answers the pricing/booking questions that otherwise become inbound email. This change renders both collections as bilingual pages.

## What Changes

- Add a **testimonials page**: a `/testimonials` list, mirrored under `/en/`, rendering each testimonial's localized author, star rating, quote, and — when present — links to the route and driver it references (resolved via the query layer).
- Add an **FAQ page**: a `/faq` list, mirrored under `/en/`, grouping questions under category headings (pricing, booking, logistics, payment, general) with each group ordered by `order`, rendering the localized question and the markdown answer body.
- Add a reusable **`TestimonialCard`** component and a pure **star-rating** helper (rating → filled/empty star display), unit-tested.
- Add a pure **`groupByCategory`** query helper that buckets FAQ entries into an ordered list of category groups, unit-tested.
- Add a **featured-testimonials section** to both homepages, below the featured-routes section, using the existing `featured()` helper.
- Add the i18n strings this needs (FAQ category headings, testimonial "route"/"driver" labels, homepage "what guests say" heading).

Out of scope (later changes): the About page and the inquiry form.

## Capabilities

### New Capabilities
- `testimonial-pages`: A bilingual testimonials list page rendering each testimonial's author, star rating, quote, and resolved route/driver links via the query layer.
- `faq-pages`: A bilingual FAQ page grouping questions by category and rendering each question with its markdown answer.

### Modified Capabilities
- `homepage`: Adds a featured-testimonials section below the existing featured-routes section (additive; the featured-routes requirement is unchanged).

## Impact

- **New**: `src/pages/testimonials/index.astro`, `src/pages/faq/index.astro` (+ `/en/` mirrors), `src/components/TestimonialCard.astro`, a star-rating helper and a `groupByCategory` query helper, and unit + e2e tests.
- **Changed**: `src/pages/index.astro` and `src/pages/en/index.astro` (add featured-testimonials section); `src/i18n/en.json` and `src/i18n/zh.json` (FAQ/testimonial strings); `src/content/queries.ts` (add `groupByCategory`).
- **Depends on**: `content-model` (the `testimonials`/`faq` collections, `queries.ts`), `route-pages` and `driver-pages` (cross-link targets), and `site-foundation` (BaseLayout, i18n, nav).
