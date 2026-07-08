# turtlecharter.com

Bilingual (中文 default · English) marketing site for a **Yunnan private car-charter tour**
business (云南包车游) serving overseas visitors — one-stop, pure-play (纯玩) private car +
driver-guide service.

Built with **Astro** (static, i18n), git-based Markdown/YAML content, and a static host.
中文 is served at the root (`/`); English under `/en/`.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server (http://localhost:4321)
npm run build      # static build → dist/
npm run preview    # serve the built site
npm run test       # unit tests (Vitest) — i18n / pure logic
npm run test:e2e   # end-to-end tests (Playwright) — pages, routing, nav
```

> First e2e run needs the browser: `npx playwright install chromium`.

## Layout

```
src/
  i18n/        locale utils, UI-string dictionaries (zh.json/en.json), nav config
  layouts/     BaseLayout.astro  (html lang, meta, hreflang, header/footer)
  components/  Header, Footer, LangSwitch …
  pages/       zh at root + English mirror under en/
  styles/      global.css (design tokens, mobile-first baseline)
tests/
  unit/        Vitest
  e2e/         Playwright
```

## Development approach

Specs and plans live in `openspec/` (OpenSpec, `spec-driven` schema). The overall
architecture is in [`docs/design/architecture.md`](docs/design/architecture.md).
Implementation is **test-driven** (RED → GREEN → REFACTOR).
