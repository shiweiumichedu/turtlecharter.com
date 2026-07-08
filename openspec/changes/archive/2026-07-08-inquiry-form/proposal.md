## Why

The contact page has promised "a full inquiry form will be added in a later change" since launch, and the nav's primary CTA ("免费定制 / Free custom trip") points there. Right now a visitor ready to book has only a bare email address to copy. A structured inquiry form lowers the friction of that first message and makes sure it arrives with the details we need to quote (dates, party size, interests).

## What Changes

- Add an **inquiry form** on the contact page (`/contact` and `/en/contact`), replacing the placeholder text, collecting:
  - **name + contact** (name required; at least one of email or WeChat/phone required),
  - **trip details** (travel dates, party size, preferred route or interests),
  - a **free-text message**,
  - a short **consent note** near the submit button.
- On submit, the form **composes a pre-filled email** (`mailto:`) to our contact address and opens the visitor's mail client — no backend, no third-party service, consistent with the static build.
- **Progressive enhancement**: the form works without JavaScript via a native `mailto:` form action; a small module script upgrades it to a nicely formatted, validated submission.
- Add a pure, unit-tested **`buildInquiryMailto`** helper that composes the `mailto:` URL (subject + labelled body, omitting empty fields, correctly encoded).
- Extract the contact **email/WeChat constants** into a shared module so the form and the footer share one source of truth.
- Add the form's i18n strings (field labels, placeholders, submit, consent note, validation message, email subject).

Out of scope: a server/serverless submission endpoint, spam protection beyond basic required-field validation, and storing inquiries.

## Capabilities

### New Capabilities
- `inquiry-form`: A bilingual contact inquiry form that validates required fields and composes a pre-filled `mailto:` email, degrading gracefully without JavaScript.

### Modified Capabilities
<!-- None at the spec level. The footer's email is refactored to a shared constant
     (implementation detail, no behavior change); the `/contact` nav entry already exists. -->

## Impact

- **New**: `src/components/InquiryForm.astro`, `src/lib/inquiry.ts` (`buildInquiryMailto`), `src/lib/contact.ts` (shared `CONTACT_EMAIL` / `CONTACT_WECHAT`), and unit + e2e tests.
- **Changed**: `src/pages/contact.astro` and `src/pages/en/contact.astro` (render the form); `src/components/Footer.astro` (use the shared contact constants); `src/i18n/en.json` and `src/i18n/zh.json` (form strings); `src/styles/global.css` (form styles).
- **Depends on**: `site-foundation` (BaseLayout, i18n) and `global-navigation` (the `/contact` entry and CTA).
