## ADDED Requirements

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
