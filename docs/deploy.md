# Deployment

The production site (`https://turtlecharter.com`) is deployed from **GitHub Actions**,
not from Netlify's git integration. CI runs the full test suite on every push to
`main` and every pull request; a push to `main` deploys to Netlify **only if the
tests pass**.

- Pipeline: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- Build/redirect config: [`netlify.toml`](../netlify.toml)

## How it works

1. **`test` job** (runs on pushes to `main` and on PRs): `npm ci`, `npm test`
   (unit), `npx playwright install --with-deps`, `npm run test:e2e`.
2. **`deploy` job** (`needs: test`, only on pushes to `main`): `npm ci`,
   `npm run build`, then `netlify deploy --prod --dir=dist`.

Because the deploy runs from CI, **Netlify's own automatic git builds must stay
disabled** — otherwise Netlify would publish `main` without the test gate and you'd
get double, ungated deploys.

## One-time maintainer setup

1. **Create the Netlify site**
   - In the Netlify dashboard, create a new site (you can start from "Deploy manually"
     / an empty site — do **not** connect it to the GitHub repo for automatic builds).
   - Copy the site's **API ID** (Site settings → General → Site information) — this is
     your `NETLIFY_SITE_ID`.

2. **Create a Netlify access token**
   - User settings → Applications → Personal access tokens → **New access token**.
   - Copy it — this is your `NETLIFY_AUTH_TOKEN`.

3. **Add the GitHub Actions secrets**
   - GitHub repo → Settings → Secrets and variables → Actions → **New repository secret**:
     - `NETLIFY_AUTH_TOKEN` — the token from step 2
     - `NETLIFY_SITE_ID` — the API ID from step 1

4. **Add the custom domain + DNS**
   - Netlify site → Domain management → add `turtlecharter.com` (and `www.turtlecharter.com`).
   - At your DNS registrar, point the domain at Netlify (Netlify DNS, or an `ALIAS`/`A`
     record for the apex and a `CNAME` for `www`, per Netlify's instructions).
   - `www` → apex redirect is handled by [`netlify.toml`](../netlify.toml); `astro.config`
     already sets `site: 'https://turtlecharter.com'` for canonical/hreflang URLs.

5. **Confirm**
   - Push to `main` (or re-run the latest workflow). The `test` job runs, and on success
     the `deploy` job publishes. Until DNS propagates, the site is reachable at the
     Netlify default URL for the site.

## Rollback

- Revert the offending commit and push to `main` — CI redeploys the previous good build.
- Or roll back to a prior deploy in the Netlify dashboard (Deploys → select → Publish).
- Disabling deploys entirely: remove/disable `.github/workflows/deploy.yml`.
