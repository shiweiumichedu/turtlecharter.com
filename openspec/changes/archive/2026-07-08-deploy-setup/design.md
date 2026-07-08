## Context

The repo is on GitHub (`shiweiumichedu/turtlecharter.com`), uses npm (`package-lock.json`) and Node 20, and builds to static output (`astro build` → `dist/`). `astro.config` already sets `site: 'https://turtlecharter.com'`. The Playwright config is already CI-aware (`reuseExistingServer: !process.env.CI`) and starts the site with `npm run build && npm run preview`. There is no CI or deploy config yet. The maintainer chose Netlify as the host, a full unit+e2e gate before deploy, and the `turtlecharter.com` custom domain.

## Goals / Non-Goals

**Goals:**
- One pipeline where a production deploy is impossible unless the full test suite passes.
- Reproducible, versioned build settings.
- Serve at the canonical apex domain with `www` redirecting to it.

**Non-Goals:**
- No per-PR preview environments, sitemap/robots, or analytics (later changes).
- No source-behavior changes; this is infrastructure only.

## Decisions

- **Deploy from GitHub Actions, not Netlify's git auto-build.** The maintainer's requirement is "deploy only if tests pass" as a single `test → deploy` pipeline. Netlify's native git integration would deploy independently of the GH Actions result, so the gate wouldn't be authoritative. Therefore CI owns the pipeline: a `test` job runs unit + e2e; a `deploy` job `needs: test`, is guarded by `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`, builds, and publishes with the Netlify CLI (`netlify deploy --prod --dir=dist`). Netlify's automatic builds are left disabled. **Alternative considered:** Netlify git builds + a required PR status check — rejected because it gates *merge*, not the deploy step itself, and splits config across two systems.
- **Secrets, not committed config, hold the Netlify identity.** `NETLIFY_AUTH_TOKEN` (a personal access token) and `NETLIFY_SITE_ID` are GitHub Actions repository secrets. `netlify.toml` holds only non-secret build settings. This keeps credentials out of the repo; the maintainer sets the secrets once (documented in `docs/deploy.md`).
- **`netlify.toml` versions build + redirect config.** `[build] command = "npm run build"`, `publish = "dist"`, and `[build.environment] NODE_VERSION = "20"` so the CLI/Netlify build is reproducible; a `www` → apex 301 redirect makes `turtlecharter.com` canonical. Even though we deploy via CLI, keeping these in-repo documents intent and lets `netlify deploy` pick up the redirect rules.
- **e2e in CI installs browsers with `npx playwright install --with-deps`.** The suite builds and previews the site itself (existing Playwright `webServer`), so no extra server orchestration is needed. `npm ci` (not `install`) gives deterministic installs from the lockfile.
- **Node version pinned to 20** in both the workflow (`actions/setup-node` with `node-version: 20`, `cache: npm`) and `netlify.toml`, matching the local toolchain.

## Risks / Trade-offs

- **CI can't be fully exercised from this repo checkout** → the workflow's real behavior (secrets, Netlify deploy) is only observable once pushed and the maintainer has added secrets. Mitigation: validate YAML/TOML syntax and keep `npm run build` green locally; document the manual setup precisely so the first push succeeds.
- **Custom domain depends on DNS the maintainer controls** → the site won't resolve at `turtlecharter.com` until DNS points at Netlify and the domain is added to the site. Mitigation: `docs/deploy.md` lists the exact steps; until then the Netlify default URL serves the same build.
- **Deploy-from-CI means the maintainer must not also enable Netlify git builds** (double deploys / an ungated path). Mitigation: called out explicitly in the proposal and docs.

## Migration Plan

Additive: new workflow, `netlify.toml`, and docs; no source changes. The pipeline activates on the first push to `main` after the maintainer adds the two secrets. Rollback = delete the workflow (deploys stop) or revert the change; the site keeps serving the last successful deploy.
