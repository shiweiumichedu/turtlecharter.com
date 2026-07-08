## Context

`content-model` delivered collections and a pure query layer; `site-foundation` delivered i18n, BaseLayout, and nav. This change is the first to render content: bilingual driver and vehicle pages. It sets the pattern every later content page (routes, testimonials, FAQ) will copy — how a page loads a collection, resolves locale, and mirrors zh/en — so the approach here matters beyond these two entities.

Constraints:
- Bilingual per-locale rendering with Chinese fallback (no mixed-language output on English pages).
- Astro static output; keep the near-zero-JS posture.
- Business/display logic stays in pure, unit-testable helpers; `.astro` pages stay thin.

## Goals / Non-Goals

**Goals:**
- `/drivers` list + `/drivers/{slug}` detail + `/vehicles` list, each mirrored under `/en/`.
- `DriverCard` and `VehicleCard` components.
- A pure `formatCny` price formatter (unit-tested), used for per-day rates.
- Driver bio moves to `bio_zh`/`bio_en` frontmatter for clean per-locale rendering.
- e2e coverage: lists render, detail renders localized fields + resolved vehicle, English mirror localized.

**Non-Goals:**
- Route pages / route pricing tables (routes-and-pricing).
- Image optimization pipeline (photos are optional string paths for now; render when present, otherwise omit).
- Filtering/search/pagination (small content sets).

## Decisions

### D1 — Page-per-locale, shared components, thin pages
Keep the explicit `/en/` mirror from `site-foundation`. Each page calls `getCollection`, maps to `.data`, applies `byOrder`, and renders shared cards. The zh and en pages differ only in which locale they pass down (derived from the path via `currentLocale`). **Alternative:** a single `[lang]` dynamic route — deferred to avoid reworking the established routing now; the shared components already prevent duplication of markup.

### D2 — Detail pages via `getStaticPaths` over the collection
`/drivers/{slug}` and `/en/drivers/{slug}` each generate paths from the `drivers` collection. The slug is the collection entry id/`slug`. Both locales enumerate the same slugs. **Alternative:** one page emitting both locale paths — messier params; the mirror is clearer and consistent with the rest of the site.

### D3 — Locale rendering via `localizedField`, references via `resolveRef`
Cards and detail pages resolve every bilingual field through `localizedField(data, base, locale)` (Chinese fallback built in). The driver's vehicle is resolved with `resolveRef(vehicles, data.vehicle)`; an unresolved ref renders nothing (no crash). This reuses `content-model`'s tested helpers — pages add no new branching logic.

### D4 — Driver bio in frontmatter, not body
Rendering the markdown body would show both languages on every page. Instead add optional `bio_zh`/`bio_en` to the driver schema and render `localizedField(data,'bio',locale)`. Additive schema change (existing entries stay valid). **Alternative:** keep body + split by a marker — brittle; rejected.

### D5 — `formatCny` as a pure helper
`src/lib/pricing.ts` exports `formatCny(amount) => '¥' + grouped`. Implemented with `Intl.NumberFormat('en-US')` for stable thousands grouping and no decimals. Locale-independent glyph (`¥`) is fine for both zh and en. Kept separate from `queries.ts` because it is presentation, and it will be reused by `routes-and-pricing`. Unit-tested first (RED/GREEN).

## Risks / Trade-offs

- **Schema edit touches archived `content-model` code** → Mitigation: additive optional fields only; a spec delta (`content-schema` ADDED requirement) documents it; existing content and tests stay green.
- **Mirror duplication grows** as more content pages arrive → Mitigation: logic lives in components/helpers; if page-level duplication becomes real friction, revisit a `[lang]` route later (no spec change).
- **Photos optional/missing** → Mitigation: components conditionally render images; e2e does not depend on images existing.
- **e2e depends on sample content** (lao-li, hiace) → Mitigation: assertions target stable sample slugs/values; sample content is part of the repo.

## Migration Plan

Additive. Land on a branch; ensure `npm test` (formatCny + existing), `npm run build` (content + pages), and `npm run test:e2e` (new driver/vehicle specs + regression) are green; merge; `openspec archive`. The driver bio change is backward-compatible; move lao-li's body text into `bio_zh`/`bio_en` in the same change.

## Open Questions

- Should the drivers list show the driver's vehicle and a photo on the card, or keep cards minimal (name + languages + specialties)? Starting minimal; detail page carries the full picture.
- Vehicle "type" display label (sedan/suv/van/minibus) — show raw enum or a localized label? Starting with a small localized label map in UI strings; low risk, decided during implementation.
