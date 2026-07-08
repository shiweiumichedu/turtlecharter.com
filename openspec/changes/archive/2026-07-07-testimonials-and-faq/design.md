## Context

The `testimonials` and `faq` collections, their schemas, the query helpers (`byOrder`, `featured`, `resolveRef`, `localizedField`), and the `/testimonials` + `/faq` nav entries all already exist. What's missing is the rendering layer. This change follows the pattern established by `drivers-and-vehicles` and `routes-and-pricing`: list pages under `/` and `/en/`, reusable card components, presentation/selection logic isolated in pure helpers, and Playwright coverage of the built pages.

Two data shapes differ from prior changes: testimonials carry `route`/`driver` reference slugs (already resolvable with `resolveRef` against the route/driver collections), and FAQ answers live in the markdown body (rendered with `render()`, like the route itinerary).

## Goals / Non-Goals

**Goals:**
- Render `/testimonials` and `/faq` (+ `/en/` mirrors) from the existing collections.
- Show star ratings and resolved route/driver cross-links on testimonials.
- Group the FAQ by category in a fixed, predictable order.
- Surface featured testimonials on the homepage, reusing the testimonial card.
- Keep display/selection logic in pure, unit-testable helpers.

**Non-Goals:**
- No schema or content-data changes — every rendered field already exists.
- No FAQ search/filter/accordion interactivity (static grouped list only).
- No About page or inquiry form.

## Decisions

- **`groupByCategory` lives in `src/content/queries.ts`.** It takes FAQ `.data` objects and returns an ordered array of `{ category, items }` groups, with a module-level `FAQ_CATEGORY_ORDER = ['pricing','booking','logistics','payment','general']` driving group order and `byOrder` sorting within each group. Empty categories are dropped. This keeps the page a thin `.map` and gives the ordering rule a direct unit test. Alternative — grouping inline in the page — was rejected because the fixed-order + drop-empty logic is exactly the kind of thing that silently regresses without a test.
- **Star rating is a pure helper returning fill state, not markup.** Add `stars(rating)` to a small `src/lib/rating.ts` returning a 5-element boolean array (`true` = filled), so the component maps it to `★`/`☆` glyphs and the logic is unit-tested independent of Astro. Mirrors how `formatCny`/`lowestPriceCny` are pure helpers in `src/lib/pricing.ts`. Glyphs (not images) keep the page JS-free and dependency-free, consistent with the static-site constraint.
- **`TestimonialCard.astro` is shared by the list page and the homepage section**, same as `RouteCard` — one component guarantees the two surfaces stay identical (a homepage scenario asserts the reuse).
- **Cross-links resolve at the page, not in the card.** The page loads the route/driver collections once and passes resolved `{ href, label }` (or `null`) into the card, so the card stays a pure presentation component and collection access stays at the page boundary, matching `drivers/[slug].astro`'s `resolveRef` usage.
- **FAQ answers rendered via `render()`**, like the route itinerary body. The answer bodies are mixed-language markdown; the body is not locale-switched (same accepted trade-off as the route itinerary), while the localized `question_*` frontmatter carries the per-locale question.
- **Category headings and testimonial labels come from i18n**, keyed `faq.category.<category>`, `testimonials.route`, `testimonials.driver`, and a homepage `testimonials.featured` heading, resolved with `t()`.

## Risks / Trade-offs

- **Unresolved `route`/`driver` ref** (typo or deleted target) → `resolveRef` returns `undefined`; the card must omit that link rather than render a dead `/routes/undefined`. Mitigation: page passes `null` for unresolved refs and the card guards on it; a spec scenario covers the missing-reference case.
- **A new/unknown FAQ category** not in `FAQ_CATEGORY_ORDER` → its group would be dropped silently. Mitigation: `category` is a fixed enum in the schema, so an unknown value can't validate; if the enum grows, `FAQ_CATEGORY_ORDER` must grow with it (noted here; a unit test asserts every enum value is covered).
- **Mixed-language answer/quote bodies** are not locale-switched. Accepted, consistent with the route itinerary; localized frontmatter carries per-locale question/quote text.

## Migration Plan

Purely additive: new pages/components/helpers/strings, plus a featured-testimonials section appended below the existing featured-routes section on both homepages. No data migration; reverting removes the new files and the homepage section.
