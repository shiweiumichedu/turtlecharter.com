## Context

turtlecharter.com is a greenfield bilingual (中文 default, English second) marketing site for a Yunnan private car-charter business targeting overseas visitors. The overall architecture is defined in `docs/design/architecture.md` (approved). This change builds only the **foundation**: the Astro project, i18n routing, shared layout/navigation, styling baseline, and a test harness that enables test-driven development for every later change.

Constraints:
- Must render fast on mobile/WAP over slow/roaming networks → minimize client JS.
- Chinese is the default/preferred language and is served at the root (no `/zh/` prefix).
- Content types (drivers, routes, etc.) are **not** in this change; the foundation must not hard-code them, but must leave clean seams for them.
- Implementation is **test-first** (superpowers TDD): each requirement scenario maps to a test written before the code.

## Goals / Non-Goals

**Goals:**
- A buildable Astro site (`dev`, `build`) producing static HTML.
- i18n: `zh` at root, `en` under `/en/`, with locale utilities and a page-preserving language switch.
- A shared `BaseLayout` with correct `<html lang>`, metadata, and `hreflang`.
- Global header/footer, responsive mobile menu, sticky mobile inquiry CTA.
- Mobile-first styling baseline (tokens, typography).
- A working test harness: Vitest (unit) + Playwright (page/e2e), runnable via npm scripts.
- Placeholder home pages (zh + en) so the skeleton renders end to end.

**Non-Goals:**
- Content collections/schemas and any content pages (drivers/vehicles/routes/testimonials/faq).
- Inquiry form submission backend (only the CTA links that point at the future contact page).
- SEO sitemap/OG, analytics, deployment/hosting config.
- Final visual design/branding polish.

## Decisions

### D1 — Astro as the framework
Static-first, ships ~zero JS by default, first-class i18n and content collections. **Alternatives:** Next.js (heavier JS, app-oriented — overkill for a brochure site); plain HTML (unmaintainable across two locales × many pages). Chosen for speed on mobile and low maintenance. See architecture doc §2.

### D2 — i18n via Astro routing, `zh` default un-prefixed
Configure `i18n: { defaultLocale: 'zh', locales: ['zh','en'], routing: { prefixDefaultLocale: false } }`. Chinese lives at `/`, English at `/en/`. English pages are authored as a mirror under `src/pages/en/`. **Alternative:** a single `[lang]` dynamic segment for both — rejected for this stage because the un-prefixed default is a hard requirement and the explicit `en/` mirror keeps routing obvious. A shared locale-utils module centralizes path↔locale logic so we can revisit later without touching pages.

### D3 — Bilingual UI strings in JSON dictionaries
Navigation labels, buttons, and chrome text live in `src/i18n/zh.json` and `en.json`, looked up by key via a typed helper. Keeps components locale-agnostic and makes adding a third language additive. Content-item bilingualism (per-field frontmatter) is deferred to the content-model change.

### D4 — Language switch computes the sibling URL
The switch derives the target URL from the current path via the locale utility (D2), so it lands on the same page in the other locale (e.g. `/routes` ⇄ `/en/routes`), never the homepage. This is the highest-value i18n correctness detail and is covered by unit tests on the utility plus a Playwright check.

### D5 — Minimal, island-only client JS
Only the mobile menu toggle (and later the language switch if it needs JS) are interactive; everything else is static HTML/CSS. The sticky mobile CTA and responsive collapse are CSS-driven where possible. Keeps the mobile performance budget (LCP < 2.5s on 4G).

### D6 — Styling baseline: decide Tailwind vs scoped CSS at kickoff
Both satisfy the mobile-first requirement. **Tailwind:** fast iteration, small purged output. **Scoped Astro CSS:** zero deps, colocated. Default to Tailwind unless we want zero styling dependencies; the requirement (mobile-first tokens/typography) is framework-agnostic so the choice does not affect specs. Recorded as an open question.

### D7 — Test harness: Vitest + Playwright, TDD-first
- **Vitest** for pure logic: locale utilities (path↔locale, sibling URL, fallback), any formatting helpers. These are the natural first RED tests.
- **Playwright** for rendered behavior: page loads in both locales, `<html lang>`/`hreflang` correctness, language switch navigation, mobile menu open/close, sticky CTA visible on mobile viewport.
- **Build-as-test:** `astro build` must exit non-zero on failure so CI treats a broken build as a failing test.
npm scripts: `dev`, `build`, `preview`, `test` (Vitest), `test:e2e` (Playwright). **Alternative:** a single runner — rejected; unit vs browser concerns differ and Vitest gives the fastest RED loop.

### D8 — Seams for future changes
- `BaseLayout` exposes slots/props for per-page metadata so content pages set their own title/description.
- Header nav is data-driven from a small nav config so later changes (Testimonials, FAQ) add an entry without editing markup.
- Locale utilities are the single source of truth for URL construction, ready for content routes.

## Risks / Trade-offs

- **English mirror duplication** (authoring pages twice under `en/`) → Mitigation: shared layout/components mean only page-level wiring differs; if duplication grows painful in later changes, revisit a `[lang]` dynamic route behind the same locale utilities (no spec change needed).
- **Tailwind vs scoped CSS deferred** → Mitigation: specs are style-implementation-agnostic; decide at kickoff without reopening specs.
- **Playwright adds CI weight/flakiness** → Mitigation: keep e2e to a few high-value smoke tests; put fine-grained logic in fast Vitest unit tests.
- **i18n misconfig (default locale accidentally prefixed)** → Mitigation: an explicit Playwright test asserts `/` serves Chinese and `/en/` serves English; unit tests assert the default-locale URL has no prefix.
- **Over-building the foundation** → Mitigation: strict non-goals; placeholder home pages only, no content types.

## Migration Plan

Greenfield — no data or existing system to migrate. Rollout: land the scaffold on a branch, ensure `build` + `test` + `test:e2e` are green, merge. Rollback is trivial (revert the branch) since nothing depends on it yet. Deployment/hosting is a later change (`seo-and-deploy`).

## Open Questions

- ~~Styling system: Tailwind vs scoped Astro CSS~~ **RESOLVED:** scoped CSS + a global design-tokens stylesheet (`src/styles/global.css`), no Tailwind — zero extra build deps, best for the minimal-footprint/near-zero-JS goal. Tailwind can be layered in later if desired.
- ~~Does the language switch need JS?~~ **RESOLVED:** pure computed anchor links (no JS), one per page via the locale utility. The mobile menu uses a pure-CSS checkbox toggle, so the foundation ships effectively zero client JS.
- Exact set of primary nav items to show in the top bar vs behind the mobile menu/footer (secondary items: Testimonials, FAQ, About) — cosmetic, resolve during implementation.
