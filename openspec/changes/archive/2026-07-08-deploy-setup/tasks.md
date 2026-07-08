## 1. Build config

- [x] 1.1 Add `netlify.toml`: `[build] command = "npm run build"`, `publish = "dist"`, `[build.environment] NODE_VERSION = "20"`, and a 301 redirect from `www.turtlecharter.com` to `https://turtlecharter.com/:splat`

## 2. CI + deploy pipeline

- [x] 2.1 Add `.github/workflows/deploy.yml` triggered on `push` to `main` and `pull_request` targeting `main`
- [x] 2.2 `test` job: `actions/checkout`, `actions/setup-node` (node 20, `cache: npm`), `npm ci`, `npm test`, `npx playwright install --with-deps`, `npm run test:e2e`
- [x] 2.3 `deploy` job: `needs: test`, guarded by `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`; `npm ci`, `npm run build`, then `netlify deploy --prod --dir=dist` via the Netlify CLI using `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets

## 3. Docs

- [x] 3.1 Add `docs/deploy.md`: one-time maintainer setup — create the Netlify site, add `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` GitHub secrets, add `turtlecharter.com` as the custom domain and point DNS, and keep Netlify's automatic git builds disabled

## 4. Verification

- [x] 4.1 Validate `.github/workflows/deploy.yml` and `netlify.toml` parse (YAML/TOML syntax) and assert the workflow's structure (test + deploy jobs, `deploy needs test`, the `main`-push guard)
- [x] 4.2 Run `npm run build` and confirm a zero exit code producing `dist/`
- [x] 4.3 Run `npm run test` and `npm run test:e2e` locally and confirm the suite the pipeline will run is green
