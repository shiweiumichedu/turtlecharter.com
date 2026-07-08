> Implementation follows superpowers TDD: write the failing test (RED), minimum code to pass (GREEN), then refactor. Each group leads with its test.

## 1. Query layer — locale-aware field resolution

- [x] 1.1 RED: unit tests for `localizedField(data, base, locale)` — returns `${base}_en` on en when present, falls back to `${base}_zh` on en when English missing, returns `${base}_zh` on zh
- [x] 1.2 GREEN: implement `localizedField` in `src/content/queries.ts` (delegating to `localizedValue`)

## 2. Query layer — listing & lookup helpers

- [x] 2.1 RED: unit tests for `byOrder` (sorts ascending by `order`, stable for ties), `featured` (only `featured: true`), `bySlug` (returns match; returns undefined for no match)
- [x] 2.2 GREEN: implement `byOrder`, `featured`, `bySlug`
- [x] 2.3 RED: unit tests for `resolveRef(items, slug)` — resolves an existing slug to its entry; returns undefined for an unresolved slug
- [x] 2.4 GREEN: implement `resolveRef`; refactor query module

## 3. Content schemas (zod) + collection registration

- [x] 3.1 RED: unit tests importing the exported schemas — valid sample parses; missing required field rejected; English optional accepted; vehicle `type` enum enforced; `day_rate_cny` non-negative; route `pricing_mode` enum enforced
- [x] 3.2 GREEN: implement `src/content.config.ts` defining collections for `drivers`, `vehicles`, `routes`, `testimonials`, `faq` and exporting each zod schema (bilingual `_zh`/`_en` fields, pricing fields, reference slugs)
- [x] 3.3 Refactor: extract shared schema pieces (bilingual pair, order/featured, regions taxonomy) as reusable zod fragments

## 4. Sample content + build validation

- [x] 4.1 Add minimal bilingual sample entries: ≥1 vehicle, ≥1 driver, ≥1 route (with both a package and a per_day example), ≥1 testimonial, ≥2 FAQ entries — placeholders, clearly marked
- [x] 4.2 RED: a test/assertion that every reference in the sample content resolves (route→vehicle_type, testimonial→route/driver, driver→vehicle)
- [x] 4.3 GREEN: fix any dangling references in sample content
- [x] 4.4 Verify `astro build` succeeds with valid content; temporarily break one file to confirm the build fails on invalid content, then restore

## 5. Verification & wrap-up

- [x] 5.1 Run full suite: `npm run test` (schemas + queries) and `npm run build` (content validation) — all green; existing site-foundation tests still pass
- [x] 5.2 `openspec validate content-model --strict` passes
