# deployment Specification

## Purpose
TBD - created by syncing change deploy-setup. Update Purpose after implementation.
## Requirements
### Requirement: CI runs the full test suite
The system SHALL provide a CI workflow that, on pushes to `main` and on pull requests targeting `main`, installs dependencies deterministically and runs both the unit test suite and the Playwright end-to-end suite.

#### Scenario: Tests run on a pull request
- **WHEN** a pull request targeting `main` is opened or updated
- **THEN** CI runs `npm ci`, the unit tests, and the e2e suite (with browsers installed)
- **AND** the pull request reflects the pass/fail status of that run

#### Scenario: Failing tests are visible
- **WHEN** a unit or e2e test fails in CI
- **THEN** the workflow run fails (non-zero) rather than reporting success

### Requirement: Deploy is gated on passing tests
The system SHALL deploy to production only after the test suite passes: the deploy job depends on the test job and runs only for pushes to `main`.

#### Scenario: Green main deploys
- **WHEN** a commit lands on `main` and the test job passes
- **THEN** the deploy job builds the site and publishes it to Netlify production

#### Scenario: Red main does not deploy
- **WHEN** the test job fails on a `main` push
- **THEN** the deploy job does not run and nothing is published

#### Scenario: Pull requests do not deploy to production
- **WHEN** CI runs for a pull request
- **THEN** the test job runs but the production deploy job does not

### Requirement: Production build configuration
The system SHALL version the production build configuration (build command, publish directory, and Node version) so the deploy is reproducible, producing the static `dist/` output that Astro generates.

#### Scenario: Build settings are declared in the repo
- **WHEN** the deploy job runs
- **THEN** it uses the versioned build command to produce `dist/`
- **AND** the Node major version used matches the one declared in the repo config

### Requirement: Canonical custom domain
The system SHALL serve the production site at the custom domain `turtlecharter.com`, matching the `site` value in `astro.config`, and SHALL redirect the `www` host to the apex domain.

#### Scenario: www redirects to the apex domain
- **WHEN** a visitor requests `https://www.turtlecharter.com/<path>`
- **THEN** they are redirected to `https://turtlecharter.com/<path>`

#### Scenario: Canonical URLs match the domain
- **WHEN** a page's canonical/hreflang URLs are generated from `astro.config`'s `site`
- **THEN** they use `https://turtlecharter.com`
