# global-navigation Specification

## Purpose
TBD - created by archiving change site-foundation. Update Purpose after archive.
## Requirements
### Requirement: Global header
The system SHALL render a header on every page containing the site logo/name, primary navigation links, a language switch, and a prominent call-to-action for a free custom trip.

#### Scenario: Header present on every page
- **WHEN** any page is rendered
- **THEN** the header is present with the logo, primary navigation, language switch, and the "免费定制 / free custom trip" CTA

#### Scenario: CTA links to contact
- **WHEN** a visitor activates the header CTA
- **THEN** they are taken to the contact page in the current locale

#### Scenario: Localized navigation labels
- **WHEN** the header is rendered on a Chinese page
- **THEN** navigation labels appear in Chinese
- **AND** on an English page they appear in English

### Requirement: Global footer
The system SHALL render a footer on every page containing a contact summary (email and WeChat), quick links, and a language switch.

#### Scenario: Footer present on every page
- **WHEN** any page is rendered
- **THEN** the footer is present with a contact summary, quick links, and a language switch

#### Scenario: Contact channels shown
- **WHEN** the footer is rendered
- **THEN** it shows the business email and a WeChat reference
- **AND** it does not present a WhatsApp channel

### Requirement: Responsive mobile menu
The system SHALL collapse the primary navigation into a toggleable menu on small (mobile) viewports.

#### Scenario: Menu collapsed on mobile
- **WHEN** the header is viewed at a mobile viewport width
- **THEN** primary navigation is collapsed behind a menu toggle

#### Scenario: Menu opens and closes
- **WHEN** a visitor activates the mobile menu toggle
- **THEN** the navigation links become visible
- **AND** activating the toggle again hides them

### Requirement: Sticky mobile inquiry CTA
The system SHALL display a persistent inquiry call-to-action on mobile viewports that links to the contact page.

#### Scenario: Persistent CTA on mobile
- **WHEN** a visitor scrolls a page on a mobile viewport
- **THEN** a sticky inquiry CTA remains visible

#### Scenario: Sticky CTA navigates to contact
- **WHEN** a visitor activates the sticky mobile CTA
- **THEN** they are taken to the contact page in the current locale

