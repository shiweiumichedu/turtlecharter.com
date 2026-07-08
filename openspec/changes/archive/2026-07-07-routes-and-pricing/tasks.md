## 1. Pricing helper

- [x] 1.1 Write a unit test for `lowestPriceCny(pricing)` in `src/lib/pricing.ts`: returns the minimum `price_cny` for a non-empty array, and `undefined` for an empty array
- [x] 1.2 Implement `lowestPriceCny` in `src/lib/pricing.ts` to pass the test

## 2. i18n strings

- [x] 2.1 Add route/pricing keys to `src/i18n/zh.json` and `src/i18n/en.json`: `routes.days`, `routes.highlights`, `routes.itinerary`, `routes.featured` (homepage heading), `pricing.from`, `pricing.mode.package`, `pricing.mode.per_day` (also added `routes.day` for English singular)

## 3. Components

- [x] 3.1 Add `src/components/RouteCard.astro` (props: route data + locale) rendering localized title, day count, regions/highlights, and a "from ¥X" teaser via `formatCny(lowestPriceCny(...))`, omitting the teaser when pricing is empty; links to `/routes/{slug}` (locale-aware)
- [x] 3.2 Add `src/components/PricingTable.astro` (props: pricing array, `pricing_mode`, localized price note + locale) rendering one row per vehicle type with `formatCny`, the mode label from i18n, and the note when present

## 4. Route pages

- [x] 4.1 Add `src/pages/routes/index.astro`: list all routes via `byOrder`, rendering a `RouteCard` per route
- [x] 4.2 Add `src/pages/routes/[slug].astro`: `getStaticPaths()` over the `routes` collection; render localized title, days, regions, highlights, the rendered itinerary body, and `PricingTable`
- [x] 4.3 Add the `/en/` mirrors: `src/pages/en/routes/index.astro` and `src/pages/en/routes/[slug].astro`

## 5. Homepage

- [x] 5.1 Update `src/pages/index.astro` to add a featured-routes section below the hero using `featured()` over the routes collection and `RouteCard`
- [x] 5.2 Mirror the featured-routes section on the English homepage (`src/pages/en/index.astro`)

## 6. Tests & verification

- [x] 6.1 Add Playwright e2e tests: `/routes` lists route cards with a "from" price; `/routes/{slug}` shows the itinerary and a pricing table with per-vehicle-type formatted prices and the correct mode label; `/en/` mirrors render in English; the homepage shows only featured routes
- [x] 6.2 Run `npm run test` and `npm run test:e2e` and confirm the full suite passes
- [x] 6.3 Run `npm run build` and confirm a zero exit code with detail pages generated for every route under `/routes/` and `/en/routes/`
