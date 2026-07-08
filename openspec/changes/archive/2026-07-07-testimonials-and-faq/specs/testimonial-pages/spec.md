## ADDED Requirements

### Requirement: Testimonials list page
The system SHALL render a testimonials list page at `/testimonials` (and `/en/testimonials`) showing every testimonial ordered by `order`, each with its localized author, star rating, and quote.

#### Scenario: Lists testimonials with details
- **WHEN** a visitor opens `/testimonials`
- **THEN** a card is shown for each testimonial in ascending `order`
- **AND** each card shows the localized author, the quote, and a star rating

#### Scenario: Localized testimonial content
- **WHEN** the testimonials list is viewed under `/en/`
- **THEN** author names and quotes render in English with Chinese fallback

### Requirement: Star rating display
The system SHALL provide a star-rating helper that renders an integer rating from 1 to 5 as that many filled stars out of five, used on each testimonial card.

#### Scenario: Renders a five-star rating
- **WHEN** the helper is given a rating of 5
- **THEN** it produces five filled stars

#### Scenario: Renders a partial rating
- **WHEN** the helper is given a rating of 4
- **THEN** it produces four filled stars and one empty star

### Requirement: Testimonial cross-links
The system SHALL, when a testimonial references a route and/or a driver that exists, link to that route detail page and/or driver detail page from the testimonial card; references that are absent or unresolved SHALL be omitted rather than shown as broken links.

#### Scenario: Resolved route and driver are linked
- **WHEN** a testimonial references route `kunming-dali-lijiang-shangri-la` and driver `lao-li`
- **THEN** its card links to the route detail page and the driver detail page (locale-aware)

#### Scenario: Missing reference is omitted
- **WHEN** a testimonial has no driver reference
- **THEN** no driver link is shown on its card
