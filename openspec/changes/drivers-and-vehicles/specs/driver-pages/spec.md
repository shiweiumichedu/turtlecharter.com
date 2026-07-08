## ADDED Requirements

### Requirement: Drivers list page
The system SHALL render a drivers list page at `/drivers` (and `/en/drivers`) that shows every driver ordered by `order`, each as a card with the driver's localized name and a link to their detail page.

#### Scenario: Lists drivers ordered
- **WHEN** a visitor opens `/drivers`
- **THEN** a card is shown for each driver in ascending `order`
- **AND** each card links to that driver's detail page in the current locale

#### Scenario: Localized names
- **WHEN** the drivers list is viewed on `/en/drivers`
- **THEN** driver names render in English where an English name is present, otherwise the Chinese name (fallback)

### Requirement: Driver detail page
The system SHALL render a driver detail page at `/drivers/{slug}` (and `/en/drivers/{slug}`) showing the driver's localized name, languages, years of experience, regions, specialties, and bio.

#### Scenario: Detail renders driver fields
- **WHEN** a visitor opens a driver's detail page
- **THEN** the page shows the driver's localized name, languages, years of experience, regions, and specialties

#### Scenario: Resolved vehicle shown
- **WHEN** a driver references a vehicle that exists
- **THEN** the detail page shows that vehicle's localized name

#### Scenario: Missing vehicle degrades gracefully
- **WHEN** a driver's vehicle reference does not resolve
- **THEN** the detail page renders without error and simply omits the vehicle

#### Scenario: Localized detail
- **WHEN** the detail page is viewed under `/en/`
- **THEN** localized text fields render in English with Chinese fallback, and `<html lang>` is `en`
