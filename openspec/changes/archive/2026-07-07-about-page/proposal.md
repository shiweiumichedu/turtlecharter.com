## Why

The primary navigation links to `/about`, but the page 404s. The About page is where an overseas visitor forms trust before inquiring — it should state who we are, why to choose us, and how booking works. It's the last standing 404 in the main nav after routes, vehicles, drivers, testimonials, and FAQ shipped.

## What Changes

- Add an **About page** at `/about`, mirrored under `/en/`, with three sections:
  - a **mission/story intro** (the pure-play, no-shopping philosophy),
  - a **"why choose us"** list of value props (dedicated vehicle, local driver-guide, flexible routes, zero shopping stops, transparent pricing),
  - a **"how it works"** short step list (inquire → free custom plan → confirm → travel) linking to the Contact page.
- Content is authored **inline per locale** in `about.astro` / `en/about.astro`, matching the existing `contact.astro` pattern (no new collection or schema).

Out of scope: a trust-stats section (no stats data exists yet), and the inquiry form (a later change).

## Capabilities

### New Capabilities
- `about-page`: A bilingual About page presenting the mission/story, why-choose-us value props, and a how-it-works process that links to Contact.

### Modified Capabilities
<!-- None. The `/about` nav entry already exists; no schema, i18n-data, or query changes. -->

## Impact

- **New**: `src/pages/about.astro`, `src/pages/en/about.astro`, and an e2e test.
- **Depends on**: `site-foundation` (BaseLayout, i18n, nav) and `global-navigation` (the `/about` nav entry).
