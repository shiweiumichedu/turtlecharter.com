> Implementation follows superpowers TDD: write the failing test (RED), minimum code to pass (GREEN), then refactor. Each group below leads with its test.

## 1. Project scaffold & tooling

- [x] 1.1 Initialize `package.json` and install Astro; add `npm run dev`, `build`, `preview` scripts
- [x] 1.2 Create `astro.config.mjs` with i18n config: `defaultLocale: 'zh'`, `locales: ['zh','en']`, `prefixDefaultLocale: false`
- [x] 1.3 Add base project structure: `src/{layouts,components,i18n,pages}`, `public/`, `tests/`
- [x] 1.4 Choose and wire the styling baseline (Tailwind or scoped CSS — per design D6) with mobile-first design tokens and typography
- [x] 1.5 Add `.gitignore` (node_modules, dist, test artifacts) and a minimal `README` with dev/build/test commands

## 2. Test harness (set up first for TDD)

- [x] 2.1 Install and configure **Vitest**; add `npm run test`; commit one trivial passing sanity test
- [x] 2.2 Install and configure **@playwright/test**; add `npm run test:e2e` wired to the preview/build server
- [x] 2.3 Verify `astro build` exits non-zero on error (build-as-test guardrail from design D7)

## 3. Internationalization core (Vitest-first)

- [x] 3.1 RED: write unit tests for locale utilities — `localizedUrl(path, locale)` (`/routes`→`/en/routes`; `/en/routes`→`/routes`), `currentLocale(path)` (`/en/x`→`en`, `/x`→`zh`), and Chinese fallback for missing English values
- [x] 3.2 GREEN: implement `src/i18n/utils.ts` to pass 3.1
- [x] 3.3 RED: write unit tests for the UI-string lookup helper against `zh.json`/`en.json`
- [x] 3.4 GREEN: add `src/i18n/zh.json`, `src/i18n/en.json` (nav labels, CTA, footer) and the lookup helper; refactor utilities

## 4. Base layout & locale metadata

- [x] 4.1 RED: Playwright tests — `/` serves Chinese with `<html lang="zh">`; `/en/` serves English with `<html lang="en">`; both pages emit `hreflang` alternates for zh and en
- [x] 4.2 GREEN: implement `src/layouts/BaseLayout.astro` (head metadata: title, description, viewport; per-locale `lang`; `hreflang` alternates; header/footer slots)
- [x] 4.3 Add placeholder home pages `src/pages/index.astro` (zh) and `src/pages/en/index.astro` (en) using BaseLayout so the skeleton renders end to end

## 5. Global navigation — header & footer

- [x] 5.1 RED: Playwright tests — header present on every page with logo, primary nav, language switch, and the "免费定制/free custom trip" CTA linking to the (future) contact path; labels localized per locale
- [x] 5.2 GREEN: implement `Header.astro` driven by a small nav config (extensible for later Testimonials/FAQ entries)
- [x] 5.3 RED: Playwright test — footer present with email + WeChat contact summary, quick links, language switch, and NO WhatsApp channel
- [x] 5.4 GREEN: implement `Footer.astro`

## 6. Language switch

- [x] 6.1 RED: Playwright tests — switching locale on `/routes` (placeholder) lands on `/en/routes` and back on `/routes` (page preserved, not homepage)
- [x] 6.2 GREEN: implement `LangSwitch.astro` using the locale utility (prefer pure computed anchor links per design open question)

## 7. Responsive mobile menu & sticky CTA

- [x] 7.1 RED: Playwright tests at a mobile viewport — primary nav collapsed behind a toggle; activating the toggle shows links, activating again hides them
- [x] 7.2 GREEN: implement the collapsible mobile menu (minimal island JS per design D5)
- [x] 7.3 RED: Playwright test — a sticky inquiry CTA stays visible on scroll at mobile viewport and links to the contact path
- [x] 7.4 GREEN: implement the sticky mobile inquiry CTA

## 8. Verification & wrap-up

- [x] 8.1 Run full suite: `npm run build`, `npm run test`, `npm run test:e2e` — all green
- [x] 8.2 Manually verify mobile rendering (no horizontal overflow; legible single column) at a narrow viewport
- [x] 8.3 `openspec validate site-foundation` passes; update the architecture doc open items if any decisions were finalized (styling system)
