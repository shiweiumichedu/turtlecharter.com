## ADDED Requirements

### Requirement: Vehicles list page
The system SHALL render a vehicles list page at `/vehicles` (and `/en/vehicles`) showing every vehicle ordered by `order`, each with its localized name, type, seats, luggage, features, and per-day charter rate with its note.

#### Scenario: Lists vehicles with details
- **WHEN** a visitor opens `/vehicles`
- **THEN** a card is shown for each vehicle in ascending `order`
- **AND** each card shows the localized name, seat count, and per-day rate

#### Scenario: Localized vehicle content
- **WHEN** the vehicles list is viewed under `/en/`
- **THEN** vehicle names and features render in English with Chinese fallback

### Requirement: Formatted price display
The system SHALL provide a price formatter that renders a CNY amount with a `¥` symbol and thousands separators, used to display per-day rates.

#### Scenario: Formats a rate
- **WHEN** the formatter is given the amount 1300
- **THEN** it returns `¥1,300`

#### Scenario: Formats a larger amount
- **WHEN** the formatter is given the amount 7200
- **THEN** it returns `¥7,200`

#### Scenario: Per-day rate shown on the page
- **WHEN** a vehicle with `day_rate_cny: 1300` is shown on the vehicles page
- **THEN** the page displays `¥1,300`
