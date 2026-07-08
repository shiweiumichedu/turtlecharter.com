## Context

The `routes` collection, its `routeSchema` (title, days, regions, highlights, `pricing_mode`, `pricing[]`, `price_note`, `order`, `featured`), the query helpers (`byOrder`, `featured`, `bySlug`, `localizedField`), and `formatCny` all already exist and are unit-tested. The `/routes` nav entry and both `nav.routes` i18n strings exist too. What is missing is purely the rendering layer.

This change follows the exact pattern established by `drivers-and-vehicles`: per-collection list + detail pages under both `/` and `/en/`, reusable card components, presentation logic isolated in `src/lib` and `src/content/queries.ts` so it stays unit-testable, and Playwright coverage for the built pages.

## Goals / Non-Goals

**Goals:**
- Render `/routes`, `/routes/{slug}`, and their `/en/` mirrors from the existing collection.
- Present pricing clearly: a per-vehicle-type table on the detail page and a "from" teaser on cards.
- Surface featured routes on the homepage using the existing `featured()` helper.
- Keep all display/selection logic in pure, unit-testable helpers.

**Non-Goals:**
- No changes to `routeSchema` or route content data — everything rendered already exists.
- No standalone `/pricing` page (pricing is shown in-context).
- No booking/inquiry flow, testimonials, FAQ, or About page.

## Decisions

- **Pricing table as its own `PricingTable.astro` component.** The route detail renders a vehicle-type→price table plus a mode label and note. Extracting it keeps the detail page thin and lets a future quote/compare view reuse it. Alternative — inline table markup in `[slug].astro` — was rejected because the mode-label + note logic is non-trivial and worth isolating.
- **"From" price computed by a pure helper in `pricing.ts`.** Add `lowestPriceCny(pricing)` returning the minimum `price_cny` (or `undefined` for empty pricing), formatted at the call site with `formatCny`. This mirrors how `formatCny` is already a tested pure helper, so the "from" logic gets a direct unit test independent of Astro.
- **Pricing-mode label comes from i18n, keyed by `pricing_mode`.** Strings `pricing.mode.package` / `pricing.mode.per_day` (and a `pricing.from` label) live in `en.json`/`zh.json`, resolved with the existing `t()`. Avoids hardcoded bilingual strings in components.
- **`RouteCard.astro` is shared by the routes list and the homepage featured section.** One card component, given a route + locale, guarantees the two surfaces stay visually identical (a homepage scenario asserts this reuse).
- **Detail pages use `getStaticPaths()` over the collection**, identical to `drivers/[slug].astro`, so a page exists for every route and unknown slugs fall through to the standard 404.
- **Itinerary body rendered via Astro's content `render()`.** Routes are markdown (`.md`) with a `## 行程 Itinerary` body; the detail page renders the compiled body like other markdown collections.

## Risks / Trade-offs

- **Empty `pricing[]` array** → `lowestPriceCny` returns `undefined`; the card must omit the "from" teaser rather than render `¥NaN`. Mitigation: helper returns `undefined` and the card guards on it; a unit test covers the empty case.
- **`vehicle_type` in route pricing is a free string, not a ref to `vehicles.slug`** → a typo would show an unlabelled/odd row. Mitigation: out of scope to validate here; the table renders the raw `vehicle_type` label as authored, consistent with the current schema. Noted for a possible future schema tightening.
- **Mixed-language markdown body** (the itinerary body contains both zh and en lines) → the body is not locale-switched, unlike frontmatter fields. Mitigation: accepted for this change (same trade-off the driver bio addressed later); the localized frontmatter fields carry the per-locale content.

## Migration Plan

Purely additive. New pages/components/strings and one new pure helper; the only edit to existing rendered output is the homepage gaining a section below the hero. No data migration, no rollback concerns — reverting the change removes the new files and the homepage section.
