## Context

`site-foundation` established Astro + i18n + a `localizedValue` fallback rule. This change adds the **content model** — the schemas and query layer that all content pages will consume. It must fit Astro 5's Content Layer API, stay bilingual with Chinese fallback, and keep business logic in pure, unit-testable functions (the pages are thin). No content pages are built here; this is the data spine.

Constraints:
- Chinese required, English optional, per field (single file drives both locales).
- Pricing must support both a per-day rate (on vehicles) and per-route package/day pricing (on routes).
- Invalid content must fail the build.
- Query logic must be testable without spinning up the Astro runtime.

## Goals / Non-Goals

**Goals:**
- Zod schemas for `drivers`, `vehicles`, `routes`, `testimonials`, `faq` in `src/content.config.ts`, with schemas exported for unit testing.
- Bilingual field convention with a locale-aware resolver.
- Pricing fields encoded in the schema (vehicle `day_rate_cny`; route `pricing_mode` + per-vehicle-type prices).
- Cross-reference fields (route↔vehicle-type, testimonial→route/driver, driver→vehicle) as slugs.
- A pure query layer: order, featured, by-slug, reference resolution, locale value resolution.
- Sample bilingual entries per collection; build validates them.
- Unit tests for schemas and query helpers (TDD).

**Non-Goals:**
- Rendering pages/components (later changes).
- UI price formatting/labels (routes-and-pricing).
- Image processing/optimization specifics (handled when pages render images).

## Decisions

### D1 — Astro 5 Content Layer, schemas exported
Define collections with `defineCollection({ loader: glob({ pattern, base }), schema })` in `src/content.config.ts`. **Export the raw zod schemas** (e.g. `driverSchema`) alongside the collection registration so Vitest can `schema.safeParse(sample)` without the Astro runtime. Astro still enforces the same schemas at build. **Alternative:** keep schemas private — rejected; we lose cheap, fast schema unit tests.

### D2 — Bilingual fields via `_zh` / `_en` suffix convention
Frontmatter uses paired fields: `name_zh` (required) + `name_en` (optional), etc. — matching the approved architecture doc and friendly to content editors. A resolver `localizedField(data, base, locale)` reads `${base}_zh` / `${base}_en` and applies the Chinese-fallback rule (delegating to the existing `localizedValue`). **Alternative:** nested `{ zh, en }` objects — cleaner types but more verbose frontmatter and a bigger departure from the architecture doc; rejected for authoring ergonomics.

### D3 — References as plain slug strings, resolved explicitly
Store references as `z.string()` slugs (e.g. route pricing `vehicle_type`, testimonial `route`/`driver`). Resolution is an explicit pure helper `resolveRef(collection, slug)`. **Alternative:** Astro's `reference()` helper — gives build-time integrity but returns runtime-resolved objects that are harder to unit-test in isolation and couples resolution to the Astro loader. We favor explicit, testable resolution; a missing reference resolves to `undefined` (pages decide how to degrade). Referential integrity is guarded by tests over the sample data rather than the loader.

### D4 — Pure query layer over plain arrays
`src/content/queries.ts` exports functions that take arrays of entry `.data` objects (or `{ id, data }` items) and return derived results: `byOrder`, `featured`, `bySlug`, `resolveRef`, `localizedField`. Pages call `getCollection()` then feed `.data` in. This keeps every branch unit-testable with plain fixtures and no Astro import. **Alternative:** helpers that call `getCollection` internally — rejected; that drags the runtime into unit tests.

### D5 — Pricing shape
- `vehicles.day_rate_cny`: `z.number().nonnegative()`.
- `routes.pricing_mode`: `z.enum(['package','per_day'])`.
- `routes.pricing`: `z.array(z.object({ vehicle_type: z.string(), price_cny: z.number().nonnegative() }))`.
UI labels ("总价/package" vs "每日/per day") are derived later from `pricing_mode`; this change only stores and validates.

## Risks / Trade-offs

- **Slug references lack loader-level integrity** (D3) → Mitigation: a unit test asserts every reference in the sample content resolves; pages treat an unresolved ref as "omit", never crash.
- **`_zh`/`_en` suffix sprawl** across many fields → Mitigation: the `localizedField` resolver centralizes access; schemas keep the pairs adjacent and documented.
- **Sample content drifting from real content** → Mitigation: samples are clearly minimal and marked as placeholders; real content is a separate content phase (architecture §12).
- **Astro 5 content config API drift** → Mitigation: pin behavior with a build test (valid content builds; invalid content fails) so upgrades surface breakage.

## Migration Plan

Additive, greenfield content. Land on the branch, ensure `npm test` (schema + query units) and `npm run build` (content validation) are green, then merge. Rollback = revert; no data migration. Depends on `site-foundation` being present.

## Open Questions

- Do routes need a `days` vs per-day-rate consistency check (e.g. package total vs days×rate)? Deferred — routes-and-pricing may add a display-time cross-check; not a schema concern now.
- Should FAQ `category` be a fixed enum or free string? Starting as a small enum (`pricing`, `booking`, `logistics`, `payment`, `general`); revisit if content needs more.
