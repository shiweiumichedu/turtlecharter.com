# homepage Specification

## Purpose
TBD - created by syncing change routes-and-pricing. Update Purpose after implementation.
## Requirements
### Requirement: Featured routes on the homepage
The system SHALL show a featured-routes section on the homepage (`/` and `/en/`) listing the routes marked `featured`, each rendered with the same route card used on the routes list and linking to its detail page.

#### Scenario: Featured routes are listed
- **WHEN** a visitor opens the homepage
- **THEN** a featured-routes section is shown below the hero
- **AND** it contains a card for each route with `featured: true`
- **AND** each card links to that route's detail page

#### Scenario: Only featured routes appear
- **WHEN** the `routes` collection contains both featured and non-featured routes
- **THEN** only the routes with `featured: true` appear in the homepage section

#### Scenario: Localized featured section
- **WHEN** the homepage is viewed under `/en/`
- **THEN** the section heading and route cards render in English with Chinese fallback
- **AND** the cards link to the `/en/`-prefixed detail pages

### Requirement: Featured testimonials on the homepage
The system SHALL show a featured-testimonials section on the homepage (`/` and `/en/`), below the featured-routes section, listing the testimonials marked `featured`, each rendered with the same testimonial card used on the testimonials list.

#### Scenario: Featured testimonials are listed
- **WHEN** a visitor opens the homepage
- **THEN** a featured-testimonials section is shown below the featured-routes section
- **AND** it contains a card for each testimonial with `featured: true`

#### Scenario: Only featured testimonials appear
- **WHEN** the `testimonials` collection contains both featured and non-featured entries
- **THEN** only the testimonials with `featured: true` appear in the homepage section

#### Scenario: Localized featured section
- **WHEN** the homepage is viewed under `/en/`
- **THEN** the section heading and testimonial cards render in English with Chinese fallback
