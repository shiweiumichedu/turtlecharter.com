> Implementation follows superpowers TDD: write the failing test (RED), minimum code to pass (GREEN), then refactor. Each group leads with its test.

## 1. Price formatter (Vitest-first)

- [x] 1.1 RED: unit tests for `formatCny` — `1300 → "¥1,300"`, `7200 → "¥7,200"`, `800 → "¥800"`, `0 → "¥0"`
- [x] 1.2 GREEN: implement `formatCny` in `src/lib/pricing.ts`

## 2. Driver bio schema + content

- [x] 2.1 RED: unit test — `driverSchema` accepts an entry with `bio_zh`/`bio_en`, and still accepts one without them
- [x] 2.2 GREEN: add optional `bio_zh`/`bio_en` to `driverSchema`; move `lao-li` bio from body into frontmatter
- [x] 2.3 Verify `npm run build` still validates content

## 3. Vehicles list page (e2e-first)

- [x] 3.1 RED: Playwright — `/vehicles` shows a card per vehicle with localized name, seats, and per-day rate rendered as `¥1,300`; `/en/vehicles` renders English names with `<html lang="en">`
- [x] 3.2 GREEN: implement `VehicleCard.astro` and `src/pages/vehicles/index.astro` + `src/pages/en/vehicles/index.astro` (getCollection → byOrder → cards; day rate via `formatCny`)

## 4. Drivers list page (e2e-first)

- [x] 4.1 RED: Playwright — `/drivers` shows a card per driver with localized name linking to `/drivers/{slug}`; `/en/drivers` links to `/en/drivers/{slug}` with English names
- [x] 4.2 GREEN: implement `DriverCard.astro` and `src/pages/drivers/index.astro` + `/en/` mirror

## 5. Driver detail page (e2e-first)

- [x] 5.1 RED: Playwright — `/drivers/lao-li` shows name, languages, years, regions, specialties, bio, and the resolved vehicle's localized name; `/en/drivers/lao-li` renders English with `<html lang="en">`
- [x] 5.2 GREEN: implement `src/pages/drivers/[slug].astro` + `/en/drivers/[slug].astro` (getStaticPaths over drivers; resolve vehicle via `resolveRef`)
- [x] 5.3 Verify graceful degradation: a driver with an unresolved vehicle ref renders without error (covered by resolveRef; assert page still builds)

## 6. Verification & wrap-up

- [x] 6.1 Run full suite: `npm run test`, `npm run build`, `npm run test:e2e` — all green (incl. site-foundation + content-model regression)
- [x] 6.2 `openspec validate drivers-and-vehicles --strict` passes
