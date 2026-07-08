# internationalization Specification

## Purpose
TBD - created by archiving change site-foundation. Update Purpose after archive.
## Requirements
### Requirement: Chinese-default locale routing
The system SHALL serve Chinese (`zh`) as the default locale at the site root without a locale prefix, and English (`en`) under the `/en/` path prefix.

#### Scenario: Chinese served at root
- **WHEN** a visitor requests the home path `/`
- **THEN** the Chinese version of the page is served
- **AND** the URL has no locale prefix

#### Scenario: English served under /en/
- **WHEN** a visitor requests `/en/`
- **THEN** the English version of the page is served

#### Scenario: Parallel paths per locale
- **WHEN** a page exists at Chinese path `/{path}`
- **THEN** its English equivalent is available at `/en/{path}`

### Requirement: Locale-aware URL utilities
The system SHALL provide utilities that, given a path and a target locale, return the correct localized URL, and that determine the current locale from a path.

#### Scenario: Build localized URL
- **WHEN** the utility is asked for the `en` URL of Chinese path `/routes`
- **THEN** it returns `/en/routes`

#### Scenario: Build default-locale URL
- **WHEN** the utility is asked for the `zh` URL of English path `/en/routes`
- **THEN** it returns `/routes` (no prefix for the default locale)

#### Scenario: Detect current locale
- **WHEN** the utility is given the path `/en/drivers`
- **THEN** it reports the current locale as `en`
- **AND** given `/drivers` it reports `zh`

### Requirement: Language switch preserves page
The system SHALL provide a language switch that navigates to the current page's equivalent in the other locale, not to the homepage.

#### Scenario: Switch to English on a subpage
- **WHEN** a visitor on `/routes` activates the language switch to English
- **THEN** they are taken to `/en/routes`

#### Scenario: Switch back to Chinese on a subpage
- **WHEN** a visitor on `/en/routes` activates the language switch to Chinese
- **THEN** they are taken to `/routes`

### Requirement: Locale metadata in HTML
The system SHALL set the document language attribute per locale and emit `hreflang` alternate links connecting the Chinese and English versions of each page.

#### Scenario: Correct lang attribute
- **WHEN** an English page is rendered
- **THEN** the `<html>` element has `lang="en"`
- **AND** a Chinese page has `lang="zh"`

#### Scenario: hreflang alternates present
- **WHEN** a page is rendered
- **THEN** the head includes `hreflang` alternate links pointing to both the `zh` and `en` versions of that page

### Requirement: Chinese fallback for missing English content
The system SHALL fall back to the Chinese value when an English field is absent, rather than rendering blank.

#### Scenario: Missing English field
- **WHEN** a content item lacks an English value for a field being displayed on an English page
- **THEN** the Chinese value is displayed as a fallback rather than empty output

