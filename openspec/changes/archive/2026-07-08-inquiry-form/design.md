## Context

The site is a pure static Astro build (`build.format: 'file'`, no SSR adapter, no server). There is no committed deploy config, so no host-specific form backend (Netlify Forms, serverless) can be assumed. The user chose a **`mailto:` compose** approach: no backend, no third-party service, no secrets. The existing contact pages are static bilingual pages holding placeholder text; the contact email (`hello@turtlecharter.com`) currently lives hardcoded in `Footer.astro`.

## Goals / Non-Goals

**Goals:**
- A usable, localized inquiry form on both contact pages that composes a pre-filled email.
- Keep the submission logic pure and unit-testable; keep the page JS-optional.
- One source of truth for the contact address, shared by the form and the footer.

**Non-Goals:**
- No server/serverless endpoint, no adapter change (stays static).
- No spam protection beyond required-field validation; no inquiry storage.
- No rich client framework — vanilla form + one small module script.

## Decisions

- **Submission logic is a pure helper, `buildInquiryMailto`, in `src/lib/inquiry.ts`.** Signature: `buildInquiryMailto({ to, subject, fields }): string` where `fields` is an ordered `{ label, value }[]`. It drops entries with an empty/whitespace `value`, joins the rest as `label: value` lines, and returns `mailto:${to}?subject=…&body=…` with `encodeURIComponent` applied to subject and body. All the branching (empty-field omission, encoding) lives here and is unit-tested independent of the DOM — mirroring `formatCny`/`stars`/`groupByCategory`.
- **The client script imports the same helper.** Astro bundles module `<script>` tags through Vite, so `InquiryForm.astro`'s enhancement script imports `buildInquiryMailto` — no logic duplicated between build-time tests and runtime. On submit it: reads each field's value and its localized label (from a `data-label` attribute on the field wrapper), validates, builds the mailto, records it on `form.dataset.lastMailto` (a small observability hook for e2e), then sets `window.location.href`.
- **Localized labels come from the server render, not re-translated in JS.** Each field carries a server-rendered `<label>` (good for a11y/SEO/no-JS) and a `data-label` used to build the email body, so the email lines match the visible labels in the visitor's locale without importing the i18n table into the script.
- **Progressive enhancement / no-JS fallback.** The `<form>` has a native `action="mailto:${to}"` plus `method="post" enctype="text/plain"`, so without JS a submit still opens the mail client with the raw fields. The script calls `preventDefault()` and takes over for a cleanly formatted, validated body. Validation (name required; at least one of email/WeChat) uses HTML `required` on name plus a JS check for the "at least one contact" rule, showing a message in an `aria-live` region.
- **Shared contact constants in `src/lib/contact.ts`** (`CONTACT_EMAIL`, `CONTACT_WECHAT`); `Footer.astro` and the form both import them, removing the hardcoded duplicate. No behavior change to the footer.
- **The form lives in `InquiryForm.astro`**, rendered by both `contact.astro` and `en/contact.astro`, so the two locales share one implementation (locale passed in / derived from the path), matching how `RouteCard`/`TestimonialCard` are shared.

## Risks / Trade-offs

- **`mailto:` UX depends on a configured mail client** → on a device with no mail app, submit does nothing useful. Mitigation: the contact email remains visible (footer + a plain mailto link near the form), so the address is always reachable; accepted per the chosen approach.
- **Very long bodies can hit `mailto:` URL length limits** in some clients. Mitigation: the message field is the only unbounded input; acceptable for an inquiry, and truncation is a client concern, not a correctness bug in the composer.
- **`data-lastMailto` is a test-observability hook in production markup.** It's inert (a data attribute) and harmless; kept because it lets e2e verify real end-to-end composition without fighting `mailto:` navigation.

## Migration Plan

Additive plus one small refactor (footer reads shared constants). Reverting removes the form/helpers and restores the placeholder contact text; the footer refactor is independent and behavior-preserving.
