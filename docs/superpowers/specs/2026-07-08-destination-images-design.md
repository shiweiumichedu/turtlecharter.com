# Destination Images — Design

**Date:** 2026-07-08
**Branch:** `feat/destination-images`

## Goal

Add photographs for each Yunnan destination region and surface them across the
site. Today the site is text-only: `public/` has no images, and the existing
`cover` (routes), `photo` (drivers/vehicles), and `avatar` (testimonials) schema
fields are unused.

## Scope

Four destination regions, matching the strings used in route `regions` arrays:

| slug          | 中文     | English      |
| ------------- | -------- | ------------ |
| `kunming`     | 昆明     | Kunming      |
| `dali`        | 大理     | Dali         |
| `lijiang`     | 丽江     | Lijiang      |
| `shangri-la`  | 香格里拉 | Shangri-La   |

## Architecture

Follow the existing git-based content-collection pattern (routes/drivers/etc.).

1. **New `destinations` collection** — `src/content/destinations/<slug>.md`.
   Schema added to `src/content/schemas.ts` in the standalone-zod style (so it
   stays unit-testable), and registered in `src/content.config.ts`.
   Fields: `slug`, `name_zh`/`name_en`, `region` (matches route `regions`
   strings), `image`, `blurb_zh`/`blurb_en`, `credit` (photographer +
   source URL), `order`.

2. **Images** — downloaded to `public/images/destinations/<slug>.jpg`, referenced
   by string path (e.g. `/images/destinations/dali.jpg`), consistent with the
   existing `cover: z.string()` field. Sourced from Unsplash (commercial-use OK,
   no attribution legally required; we still record a `credit` as good practice).
   Each image verified to depict the correct place; sized ~1600px wide, compressed.
   Tradeoff: uses `public/` static paths, not `astro:assets` optimization — chosen
   to match the current string-path schema and keep schemas testable.

3. **New `DestinationCard.astro` component** — photo + localized name + blurb.
   Reused by the homepage section and the destinations page.

4. **Placement** (all three requested):
   - **Route card thumbnail + route detail hero** — `RouteCard.astro` shows a
     thumbnail; `routes/[slug].astro` shows a hero image. The cover is derived
     from the route's primary region (`regions[0]` → destination image) via a
     helper in `src/content/queries.ts`, so there is one source of truth per place.
   - **Homepage destinations section** — new grid on `index.astro` + `en/index.astro`.
   - **Dedicated pages** — `/destinations` and `/en/destinations`, card per region.

5. **i18n + nav** — add `nav.destinations` and section headings to `en.json`,
   `zh.json`, and `nav.ts`; add a header nav link.

6. **Accessibility & tests** — every image gets meaningful bilingual `alt` text.
   Add a vitest schema test for destinations and a Playwright test that the
   destinations page renders images with non-empty alt text.

## Non-goals

- Astro image optimization pipeline (`astro:assets`) — deferred to keep schema
  string-based and testable.
- Photos for drivers / vehicles / testimonials — out of scope for this change.
- A fifth "Erhai" destination — Dali is represented by an iconic Erhai Lake photo.
