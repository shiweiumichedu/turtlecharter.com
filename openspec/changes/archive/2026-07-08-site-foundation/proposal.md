## Why

turtlecharter.com currently has no codebase — only an empty repository. Before any content page (drivers, routes, contact) can be built, the site needs a foundation: a build system, bilingual routing with 中文 as the default language, a shared page shell, and a test harness so all later work can be developed test-first (TDD). This change delivers that foundation so subsequent changes plug into a working, verifiable skeleton.

## What Changes

- Scaffold an **Astro** static site (project config, dependencies, `npm` scripts, `astro build` producing static output).
- Establish **internationalization**: `zh` as the default locale served at the site root (`/`), `en` served under `/en/`, with locale-aware URL helpers and a language switch that preserves the current page.
- Add a **base layout** (`BaseLayout.astro`) providing per-locale `<html lang>`, document metadata, and `hreflang` alternate links.
- Add **global navigation**: a responsive header (logo, primary nav, language switch, prominent "免费定制 / free custom trip" CTA), a footer (contact summary, quick links, language switch), a collapsible mobile menu, and a sticky mobile inquiry CTA.
- Establish a **styling baseline**: mobile-first responsive CSS foundation, typography, and design tokens.
- Establish a **test harness** (Vitest for unit tests of i18n/utility logic; Playwright for page-render and language-switch smoke tests) enabling RED→GREEN→REFACTOR development for this and all future changes.
- Add placeholder home pages for both locales so the skeleton builds and renders end to end.

Out of scope (later changes): content collections/schemas, driver/vehicle/route/testimonial/FAQ pages, the inquiry form backend, SEO sitemap/OG, and deployment/hosting configuration.

## Capabilities

### New Capabilities
- `site-scaffold`: Astro project setup, build pipeline, base page layout, styling baseline, and the automated test harness (Vitest + Playwright) used for TDD.
- `internationalization`: Locale model with `zh` as default at the root and `en` under `/en/`, locale-aware path/URL utilities, per-locale `<html lang>` and `hreflang`, and Chinese fallback for missing English values.
- `global-navigation`: Responsive header and footer, primary navigation, language switcher UI, collapsible mobile menu, and a persistent mobile inquiry CTA.

### Modified Capabilities
<!-- None — this is the first change; no existing specs. -->

## Impact

- **New codebase** created from scratch: `package.json`, `astro.config.mjs`, `src/layouts/`, `src/components/`, `src/i18n/`, `src/pages/` (zh root + `en/`), `tests/`, and `public/`.
- **New dependencies**: `astro`, a styling approach (Tailwind or scoped CSS — decided at implementation), `vitest`, `@playwright/test`.
- **New tooling/scripts**: `npm run dev`, `npm run build`, `npm run test` (unit), `npm run test:e2e`.
- No existing systems affected (greenfield). Establishes conventions (i18n, layout, testing) that every later change depends on.
