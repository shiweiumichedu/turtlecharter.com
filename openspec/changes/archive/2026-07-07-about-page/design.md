## Context

The About page is the last main-nav destination that 404s. Unlike routes/drivers/etc., there is no `about` content collection, and the content is a single static bilingual page. The existing `contact.astro` / `en/contact.astro` pair is the established pattern for a static bilingual page: two locale-specific pages, each wrapping hardcoded per-locale content in `BaseLayout` with an explicit `title`/`description`.

## Goals / Non-Goals

**Goals:**
- Render `/about` and `/en/about` with mission, why-choose-us, and how-it-works sections.
- Match the existing static-page conventions (BaseLayout, per-locale content, hreflang via BaseLayout).

**Non-Goals:**
- No content collection, schema, or query changes.
- No trust-stats section (no data) and no inquiry form (later change).

## Decisions

- **Author content inline per locale, mirroring `contact.astro`.** Each locale page hardcodes its own copy; there is no shared i18n string table for body prose (consistent with how `contact.astro` already works). Alternative — a markdown `about` collection — was considered and rejected by the user as overkill for one page.
- **Reuse existing markup/CSS classes.** The why-choose-us list uses the existing `.tags`/list styling patterns where sensible; the how-it-works steps use a simple ordered list. A small `.about` section wrapper is added only if needed for spacing, following the token-based baseline in `global.css`.
- **Contact link is locale-aware** via `localizedUrl('/contact', locale)`, matching how BaseLayout builds its own contact href.

## Risks / Trade-offs

- **Content duplication across the two locale pages** → the zh and en pages can drift. Mitigation: accepted and identical to the current `contact.astro` trade-off; the pages are short and the e2e test asserts both render their sections.

## Migration Plan

Purely additive: two new pages plus a test. Reverting removes the pages; the `/about` nav link returns to 404.
