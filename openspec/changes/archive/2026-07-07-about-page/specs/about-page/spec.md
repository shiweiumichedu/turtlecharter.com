## ADDED Requirements

### Requirement: About page
The system SHALL render an About page at `/about` (and `/en/about`) presenting three sections — a mission/story intro, a "why choose us" list of value props, and a "how it works" process — using the shared base layout, with content localized per locale (English under `/en/`, Chinese at the root).

#### Scenario: About page renders with its sections
- **WHEN** a visitor opens `/about`
- **THEN** the page shows a mission/story intro, a "why choose us" value-props list, and a "how it works" step list
- **AND** it is wrapped in the shared header and footer

#### Scenario: How-it-works links to Contact
- **WHEN** a visitor views the "how it works" section
- **THEN** it links to the Contact page (locale-aware: `/contact` on the root, `/en/contact` under `/en/`)

#### Scenario: Localized About content
- **WHEN** the About page is viewed under `/en/`
- **THEN** the document `lang` is `en` and its content renders in English
- **AND** the Chinese page at `/about` renders the same sections in Chinese
