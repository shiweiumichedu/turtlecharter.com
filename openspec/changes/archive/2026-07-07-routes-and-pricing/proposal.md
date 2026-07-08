## Why

The `routes` collection and its pricing fields already exist, and the primary navigation already links to `/routes` — but that page 404s. Routes are what an overseas visitor actually shops for; without them, the site advertises itineraries it cannot show and buries the pricing that drives an inquiry. This change turns the `routes` collection into browsable, bilingual pages with clear per-route pricing.

## What Changes

- Add **route pages**: a `/routes` list and `/routes/{slug}` detail, mirrored under `/en/`, rendering each route's localized title, day count, regions, highlights, itinerary body, and pricing.
- Show a **pricing table** on each route detail page listing the price per vehicle type, labelled by pricing mode (package total vs. per-day), with the localized price note.
- Show a **"from ¥X" teaser** on each route card (the lowest vehicle-type price), formatted with the existing `formatCny` helper.
- Add a reusable **`RouteCard`** component and a **`PricingTable`** component.
- Add a **featured-routes section** to the homepage, listing routes marked `featured` via the existing `featured()` query helper.
- Add the route-specific i18n strings (day/days label, highlights, itinerary, "from", pricing-mode labels, featured-routes heading).

Out of scope (later changes): testimonials and FAQ pages, the About page, and the inquiry form.

## Capabilities

### New Capabilities
- `route-pages`: A bilingual routes list and route detail page rendering route content (title, days, regions, highlights, itinerary) with a per-vehicle-type pricing table and a "from" price teaser via the query and pricing layers.
- `homepage`: A homepage that surfaces featured routes below the hero.

### Modified Capabilities
<!-- None. `routeSchema` already carries every field this change renders, `formatCny`
     is reused unchanged, and the `/routes` nav entry already exists. -->

## Impact

- **New**: `src/pages/routes/index.astro`, `src/pages/routes/[slug].astro` (+ `/en/` mirrors), `src/components/RouteCard.astro`, `src/components/PricingTable.astro`, and unit + e2e tests.
- **Changed**: `src/pages/index.astro` (add featured-routes section); `src/lib/pricing.ts` (add a "lowest price" helper for the card teaser); `src/i18n/en.json` and `src/i18n/zh.json` (route strings).
- **Depends on**: `content-model` (the `routes` collection, `queries.ts`), `vehicle-pages` (`formatCny`), and `site-foundation` (BaseLayout, i18n, nav).
- **Enables**: testimonials to link back to real route pages in a later change.
