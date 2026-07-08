## Why

The site is feature-complete but has no way to reach production: there is no CI, no build/deploy pipeline, and no host configuration. Every change so far has been verified only locally. This change wires up automated testing and deployment so that merging to `main` publishes the site to `turtlecharter.com`, and so a regression can never silently ship.

## What Changes

- Add a **GitHub Actions pipeline** that, on pushes to `main` and on pull requests, runs the **unit tests and the Playwright e2e suite** (installing browsers), and **deploys to Netlify only if the tests pass** (deploy job runs on `main` pushes and `needs` the test job).
- Add **`netlify.toml`** versioning the build settings (build command, publish dir, Node version) and a **`www` → apex redirect** so the canonical host is `turtlecharter.com`.
- Deploy **from CI via the Netlify CLI** using repository secrets; Netlify's own git auto-build is left off so the test gate is authoritative.
- Wire the **custom domain** `turtlecharter.com` (already set as `site` in `astro.config`), documenting the DNS + Netlify-side steps the maintainer performs.
- Add a **`docs/deploy.md`** describing the one-time manual setup (create the Netlify site, add `NETLIFY_AUTH_TOKEN` / `NETLIFY_SITE_ID` GitHub secrets, point DNS).

Out of scope: sitemap/robots.txt and other SEO assets, preview-deploy environments per PR, and analytics — each a later change.

## Capabilities

### New Capabilities
- `deployment`: Continuous integration that gates on the full test suite, and a production deploy of the static build to Netlify at the custom domain on merge to `main`.

### Modified Capabilities
<!-- None. `astro.config` already sets `site: https://turtlecharter.com`; no source behavior changes. -->

## Impact

- **New**: `.github/workflows/deploy.yml`, `netlify.toml`, `docs/deploy.md`.
- **Manual (maintainer, documented in docs/deploy.md)**: create the Netlify site; add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as GitHub Actions secrets; add `turtlecharter.com` as the site's custom domain and point DNS at Netlify; leave Netlify's automatic git builds disabled.
- **Depends on**: `site-scaffold` (the `npm run build` / `test` / `test:e2e` commands and the Playwright config, which is already CI-aware via `reuseExistingServer: !process.env.CI`).
