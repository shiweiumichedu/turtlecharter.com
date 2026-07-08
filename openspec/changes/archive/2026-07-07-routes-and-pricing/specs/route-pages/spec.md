## ADDED Requirements

### Requirement: Routes list page
The system SHALL render a routes list page at `/routes` (and `/en/routes`) showing every route ordered by `order`, each as a card with its localized title, day count, regions, highlights, and a "from" price teaser, linking to the route detail page.

#### Scenario: Lists routes with details
- **WHEN** a visitor opens `/routes`
- **THEN** a card is shown for each route in ascending `order`
- **AND** each card shows the localized title, day count, and a "from ¥X" price
- **AND** each card links to that route's detail page

#### Scenario: From price is the lowest vehicle-type price
- **WHEN** a route has vehicle-type prices of `¥800` and `¥1,300`
- **THEN** its card shows a "from" price of `¥800`

#### Scenario: Localized route content
- **WHEN** the routes list is viewed under `/en/`
- **THEN** route titles and highlights render in English with Chinese fallback
- **AND** each card links to the `/en/`-prefixed detail page

### Requirement: Route detail page
The system SHALL render a route detail page at `/routes/{slug}` (and `/en/routes/{slug}`) for every route, showing its localized title, day count, regions, highlights, rendered itinerary body, and its pricing.

#### Scenario: Route detail renders
- **WHEN** a visitor opens `/routes/dali-day-charter`
- **THEN** the page shows the route's localized title, day count, regions, and highlights
- **AND** the route's itinerary body is rendered

#### Scenario: A page exists for every route
- **WHEN** the site is built
- **THEN** a detail page is generated for each entry in the `routes` collection under both `/routes/{slug}` and `/en/routes/{slug}`

#### Scenario: Unknown route slug
- **WHEN** a visitor requests a slug with no matching route
- **THEN** the site returns its standard 404 (no page is generated)

### Requirement: Route pricing table
The system SHALL show a pricing table on each route detail page listing the formatted price for each vehicle type in the route's `pricing`, labelled according to the route's `pricing_mode` (package total vs. per-day), followed by the localized price note when present.

#### Scenario: Per-day pricing labelling
- **WHEN** a route has `pricing_mode: per_day`
- **THEN** the pricing table is labelled as a per-day price

#### Scenario: Package pricing labelling
- **WHEN** a route has `pricing_mode: package`
- **THEN** the pricing table is labelled as a package (whole-trip) price

#### Scenario: Prices are formatted and per vehicle type
- **WHEN** a route prices `sedan` at 4800 and `van` at 7200
- **THEN** the table shows one row per vehicle type
- **AND** the amounts display as `¥4,800` and `¥7,200`

#### Scenario: Localized price note
- **WHEN** the route detail is viewed under `/en/` and an English price note exists
- **THEN** the English price note is shown, falling back to Chinese when absent
