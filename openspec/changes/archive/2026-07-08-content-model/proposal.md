## Why

The `site-foundation` change delivered a working bilingual shell but no structured content. Every remaining feature (drivers, vehicles, routes, testimonials, FAQ) needs a single, validated, version-controlled content model so pages render from data instead of hard-coded markup — and so a driver or route can be added by dropping in one file. This change defines that model and the typed query layer the content pages will build on.

## What Changes

- Define **Astro content collections** with **zod schemas** for the five content types: `drivers`, `vehicles`, `routes`, `testimonials`, `faq`. Each schema is **bilingual** (Chinese required, English optional) so one file drives both locales.
- Encode the **pricing model** in the schema: a per-day rate on `vehicles` (`day_rate_cny`) and, on `routes`, a `pricing_mode` (`package` | `per_day`) with per-vehicle-type prices.
- Add **cross-references**: routes → vehicle types (pricing), testimonials → route/driver, drivers → vehicle.
- Provide a **typed content-query layer** (pure, testable helpers): list-and-sort by `order`, filter `featured`, find by `slug`, resolve references, and locale-aware field resolution (reusing the Chinese-fallback rule from `internationalization`).
- **Validate content at build time**: an invalid content file (missing required field, bad enum) fails `astro build`.
- Add a small set of **sample content entries** (bilingual) per collection so the model is exercised end to end and later page changes have data to render.

Out of scope (later changes): the pages/components that render this content (drivers/vehicles/routes/testimonials/faq pages), price **formatting/labels** in the UI, and the inquiry form.

## Capabilities

### New Capabilities
- `content-schema`: Astro content collections and zod schemas for `drivers`, `vehicles`, `routes`, `testimonials`, `faq`, including bilingual fields, the pricing model, cross-references, and build-time validation.
- `content-queries`: A typed, pure query layer over the collections — sort by order, filter featured, find by slug, resolve references, and locale-aware field/value resolution.

### Modified Capabilities
<!-- None. Reuses internationalization's localizedValue rule but does not change its requirements. -->

## Impact

- **New**: `src/content.config.ts` (collection + schema definitions), `src/content/{drivers,vehicles,routes,testimonials,faq}/` sample entries, `src/content/queries.ts` (query helpers), and unit tests under `tests/unit/`.
- **Depends on**: `site-foundation` (`src/i18n/utils.ts` locale/`localizedValue` helpers, `Locale` type).
- **Dependency**: no new npm packages — zod ships with Astro.
- **Enables**: `drivers-and-vehicles`, `routes-and-pricing`, `testimonials-and-faq`, and `home-and-about` all consume this model.
