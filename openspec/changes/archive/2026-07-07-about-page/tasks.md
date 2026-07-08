## 1. Pages

- [x] 1.1 Add `src/pages/about.astro` (Chinese): mission/story intro, "why choose us" value-props list, and a "how it works" step list linking to `/contact`, wrapped in `BaseLayout` with a `title`/`description`
- [x] 1.2 Add `src/pages/en/about.astro` (English): the same three sections in English, linking to `/en/contact`

## 2. Styles

- [x] 2.1 Add any small About-specific styles to `src/styles/global.css` on the existing design-token baseline (only if needed for spacing/lists)

## 3. Tests & verification

- [x] 3.1 Add a Playwright e2e test: `/about` shows the three sections and a link to `/contact`; `/en/about` renders in English (`lang=en`) with a link to `/en/contact`
- [x] 3.2 Run `npm run test` and `npm run test:e2e` and confirm the full suite passes
- [x] 3.3 Run `npm run build` and confirm a zero exit code with `/about` and `/en/about` generated
