## 1. Shared contact constants

- [x] 1.1 Add `src/lib/contact.ts` exporting `CONTACT_EMAIL` and `CONTACT_WECHAT` (values currently hardcoded in `Footer.astro`)
- [x] 1.2 Update `src/components/Footer.astro` to import and use those constants (no behavior change)

## 2. Mailto helper (pure)

- [x] 2.1 Write unit tests for `buildInquiryMailto({ to, subject, fields })` in `src/lib/inquiry.ts`: builds `mailto:` with encoded subject/body; renders each field as a `label: value` line; omits fields whose value is empty/whitespace; percent-encodes spaces, newlines, and non-ASCII
- [x] 2.2 Implement `buildInquiryMailto` to pass the tests

## 3. i18n strings

- [x] 3.1 Add form keys to `src/i18n/zh.json` and `src/i18n/en.json`: `inquiry.name`, `inquiry.email`, `inquiry.wechat`, `inquiry.dates`, `inquiry.party`, `inquiry.interests`, `inquiry.message`, `inquiry.submit`, `inquiry.consent`, `inquiry.error` (required-fields message), `inquiry.subject` (email subject)

## 4. Form component

- [x] 4.1 Add `src/components/InquiryForm.astro`: localized fields (name required; email + WeChat/phone; dates; party size; interests; message), a consent note, a native `action="mailto:…"` no-JS fallback, and each field wrapper carrying a `data-label`
- [x] 4.2 Add the enhancement module `<script>`: import `buildInquiryMailto`, validate (name + at least one contact) with an `aria-live` error, build the mailto from field values + `data-label`s, record it on `form.dataset.lastMailto`, then navigate

## 5. Wire into contact pages

- [x] 5.1 Update `src/pages/contact.astro` to render `InquiryForm` (replace the placeholder paragraph)
- [x] 5.2 Update `src/pages/en/contact.astro` likewise

## 6. Styles

- [x] 6.1 Add form styles to `src/styles/global.css` on the existing design-token baseline (labels, inputs, textarea, submit, consent/error text)

## 7. Tests & verification

- [x] 7.1 Add Playwright e2e tests: form fields + consent render (zh) and render in English under `/en/`; the `action` attribute is the `mailto:` fallback; submitting empty shows the validation message and composes no mail; a valid submission sets `form.dataset.lastMailto` with the contact address and the expected labelled body
- [x] 7.2 Run `npm run test` and `npm run test:e2e` and confirm the full suite passes
- [x] 7.3 Run `npm run build` and confirm a zero exit code with `/contact` and `/en/contact` generated
