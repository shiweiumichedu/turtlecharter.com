## Why

The content model exists but renders nowhere. Drivers and vehicles are the primary trust signals for an overseas visitor choosing a charter service — they need real pages. This change turns the `drivers` and `vehicles` collections into browsable, bilingual pages, and is the first change that renders content through the query layer end to end.

## What Changes

- Add **driver pages**: a `/drivers` list and `/drivers/{slug}` detail, mirrored under `/en/`, rendering each driver's localized name, languages, years of experience, regions, specialties, a bio, and the resolved vehicle they drive.
- Add a **vehicles page**: a `/vehicles` list, mirrored under `/en/`, showing each vehicle's localized name, type, seats, luggage, features, and **formatted per-day charter rate** with its note.
- Add reusable **`DriverCard`** and **`VehicleCard`** components.
- Add a pure **`formatCny`** helper for displaying prices (¥ with thousands separators), unit-tested.
- Add an optional **bio** (`bio_zh` / `bio_en`) field to the driver schema so the detail bio renders per-locale (replacing the mixed-language markdown body); update the sample driver accordingly.
- Wire these pages into existing navigation (nav entries already exist from `site-foundation`).

Out of scope (later changes): routes list/detail and route pricing tables (`routes-and-pricing`), testimonials/FAQ pages, the homepage, and the inquiry form.

## Capabilities

### New Capabilities
- `driver-pages`: Bilingual drivers list and driver detail pages rendering driver content (name, languages, experience, regions, specialties, bio, resolved vehicle) via the query layer.
- `vehicle-pages`: A bilingual vehicles list page rendering each vehicle with its formatted per-day charter rate.

### Modified Capabilities
- `content-schema`: The `drivers` schema gains optional `bio_zh` / `bio_en` fields (additive; existing entries remain valid).

## Impact

- **New**: `src/pages/drivers/index.astro`, `src/pages/drivers/[slug].astro`, `src/pages/vehicles/index.astro` (+ `/en/` mirrors), `src/components/DriverCard.astro`, `src/components/VehicleCard.astro`, `src/lib/pricing.ts` (`formatCny`), and unit + e2e tests.
- **Changed**: `src/content/schemas.ts` (add optional driver bio fields); `src/content/drivers/lao-li.md` (move bio into frontmatter).
- **Depends on**: `content-model` (collections, `queries.ts`) and `site-foundation` (BaseLayout, i18n, nav).
- **Enables**: driver references from testimonials/routes to link to real pages later.
