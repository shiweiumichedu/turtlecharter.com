## 1. Pure helpers

- [x] 1.1 Write a unit test for `stars(rating)` in `src/lib/rating.ts`: rating 5 → five `true`; rating 4 → four `true` + one `false`; always length 5
- [x] 1.2 Implement `stars` in `src/lib/rating.ts` to pass the test
- [x] 1.3 Write a unit test for `groupByCategory(entries)` in `src/content/queries.ts`: returns groups in fixed `FAQ_CATEGORY_ORDER`, sorts each group by `order`, drops empty categories, and covers every `faqSchema` category enum value
- [x] 1.4 Implement `groupByCategory` (and `FAQ_CATEGORY_ORDER`) in `src/content/queries.ts` to pass the test

## 2. i18n strings

- [x] 2.1 Add keys to `src/i18n/zh.json` and `src/i18n/en.json`: `faq.category.pricing`, `faq.category.booking`, `faq.category.logistics`, `faq.category.payment`, `faq.category.general`, `testimonials.route`, `testimonials.driver`, `testimonials.featured` (homepage heading)

## 3. Components

- [x] 3.1 Add `src/components/TestimonialCard.astro` (props: testimonial data, resolved route/driver `{href,label}|null`, locale) rendering localized author, star rating via `stars()`, quote, and route/driver links when present

## 4. Pages

- [x] 4.1 Add `src/pages/testimonials/index.astro`: list testimonials via `byOrder`, resolve each `route`/`driver` ref against its collection, render a `TestimonialCard` per entry
- [x] 4.2 Add `src/pages/faq/index.astro`: `groupByCategory` over the faq collection; render each non-empty category heading and its questions with the rendered markdown answer body
- [x] 4.3 Add the `/en/` mirrors: `src/pages/en/testimonials/index.astro` and `src/pages/en/faq/index.astro`

## 5. Homepage

- [x] 5.1 Update `src/pages/index.astro` to add a featured-testimonials section below the featured-routes section using `featured()` over the testimonials collection and `TestimonialCard`
- [x] 5.2 Mirror the featured-testimonials section on the English homepage (`src/pages/en/index.astro`)

## 6. Tests & verification

- [x] 6.1 Add Playwright e2e tests: `/testimonials` lists cards with author/quote/rating and route+driver links; `/faq` shows category headings with questions and answers grouped correctly; `/en/` mirrors render in English; the homepage shows only featured testimonials
- [x] 6.2 Run `npm run test` and `npm run test:e2e` and confirm the full suite passes
- [x] 6.3 Run `npm run build` and confirm a zero exit code with `/testimonials`, `/faq`, and their `/en/` mirrors generated
