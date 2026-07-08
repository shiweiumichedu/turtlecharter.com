# faq-pages Specification

## Purpose
TBD - created by syncing change testimonials-and-faq. Update Purpose after implementation.
## Requirements
### Requirement: FAQ page grouped by category
The system SHALL render an FAQ page at `/faq` (and `/en/faq`) that groups questions under their category (pricing, booking, logistics, payment, general), showing categories in a fixed display order and, within each category, questions ordered by `order`. Categories with no questions SHALL NOT render a heading.

#### Scenario: Questions grouped under category headings
- **WHEN** a visitor opens `/faq`
- **THEN** each non-empty category is shown as a heading
- **AND** the questions in that category appear beneath it in ascending `order`

#### Scenario: Empty categories are omitted
- **WHEN** no question has the `logistics` category
- **THEN** no `logistics` heading is rendered

#### Scenario: Category ordering helper
- **WHEN** `groupByCategory` is given FAQ entries spanning `booking` and `pricing`
- **THEN** it returns groups in the fixed category order (`pricing` before `booking`)
- **AND** each group's entries are sorted by `order`

### Requirement: FAQ question and answer rendering
The system SHALL render, for each FAQ entry, its localized question and its answer body (authored as markdown) under the appropriate category.

#### Scenario: Question and answer render
- **WHEN** a visitor opens `/faq`
- **THEN** each entry shows its localized question text
- **AND** the entry's markdown answer body is rendered

#### Scenario: Localized questions
- **WHEN** the FAQ page is viewed under `/en/`
- **THEN** questions render in English with Chinese fallback
