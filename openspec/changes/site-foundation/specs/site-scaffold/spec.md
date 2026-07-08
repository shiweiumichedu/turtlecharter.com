## ADDED Requirements

### Requirement: Static site build
The system SHALL be an Astro project that builds to static output via a documented build command, producing HTML that renders without requiring client-side JavaScript for core content.

#### Scenario: Production build succeeds
- **WHEN** a developer runs the build command (`npm run build`)
- **THEN** Astro produces a static `dist/` directory containing rendered HTML for every page
- **AND** the build completes with a zero exit code and no errors

#### Scenario: Local development server runs
- **WHEN** a developer runs the dev command (`npm run dev`)
- **THEN** the site is served locally and reflects source changes on reload

### Requirement: Base layout
The system SHALL provide a shared base layout that wraps every page with the document shell (head metadata, header, footer) so pages do not duplicate structural markup.

#### Scenario: Page uses the base layout
- **WHEN** any page is rendered
- **THEN** the output includes the shared header and footer from the base layout
- **AND** the page-specific content is rendered in the layout's content slot

#### Scenario: Document metadata is present
- **WHEN** a page is rendered
- **THEN** the HTML `<head>` contains a `<title>`, a meta description, and a responsive viewport meta tag

### Requirement: Styling baseline
The system SHALL establish a mobile-first responsive styling baseline (design tokens, typography, and base element styles) shared across all pages.

#### Scenario: Mobile-first rendering
- **WHEN** a page is viewed at a narrow (mobile) viewport width
- **THEN** content is legible and laid out in a single readable column without horizontal overflow

#### Scenario: Consistent base styles
- **WHEN** any two pages are rendered
- **THEN** they share the same typography and design tokens from the styling baseline

### Requirement: Automated test harness
The system SHALL include an automated test harness supporting unit tests (Vitest) and browser-level page tests (Playwright), runnable via documented commands, to enable test-driven development.

#### Scenario: Unit tests run
- **WHEN** a developer runs the unit test command (`npm run test`)
- **THEN** Vitest executes the unit test suite and reports pass/fail results

#### Scenario: End-to-end tests run
- **WHEN** a developer runs the end-to-end test command (`npm run test:e2e`)
- **THEN** Playwright loads built pages in a browser and reports pass/fail results

#### Scenario: Content build failure is caught
- **WHEN** the project builds
- **THEN** a build that fails validation or errors causes the build command to exit non-zero, so CI/tests can detect it
