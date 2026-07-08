# content-schema Specification

## Purpose
TBD - created by archiving change content-model. Update Purpose after archive.
## Requirements
### Requirement: Bilingual content collections
The system SHALL define Astro content collections for `drivers`, `vehicles`, `routes`, `testimonials`, and `faq`, each with a zod schema whose text fields carry a required Chinese value and an optional English value.

#### Scenario: Valid entry parses
- **WHEN** a content entry provides all required fields (including the Chinese text)
- **THEN** its collection schema accepts it

#### Scenario: Missing required field is rejected
- **WHEN** a content entry omits a required field (e.g. a driver with no Chinese name)
- **THEN** the schema rejects it with a validation error

#### Scenario: English is optional
- **WHEN** a content entry provides Chinese text but omits the English text
- **THEN** the schema accepts it (English is optional)

### Requirement: Vehicle schema with per-day rate
The `vehicles` schema SHALL include a `type` constrained to a known set (`sedan`, `suv`, `van`, `minibus`), a seat count, and a per-day charter rate (`day_rate_cny`).

#### Scenario: Known vehicle type accepted
- **WHEN** a vehicle entry sets `type` to one of `sedan`, `suv`, `van`, `minibus`
- **THEN** the schema accepts it

#### Scenario: Unknown vehicle type rejected
- **WHEN** a vehicle entry sets `type` to a value outside the known set
- **THEN** the schema rejects it

#### Scenario: Day rate is a non-negative number
- **WHEN** a vehicle entry provides `day_rate_cny`
- **THEN** the schema requires it to be a non-negative number

### Requirement: Route pricing model
The `routes` schema SHALL include a `pricing_mode` of `package` or `per_day` and a list of per-vehicle-type prices, so a route can be quoted either as a fixed package total or as a daily rate.

#### Scenario: Package pricing accepted
- **WHEN** a route sets `pricing_mode: package` with one or more `{ vehicle_type, price_cny }` entries
- **THEN** the schema accepts it

#### Scenario: Per-day pricing accepted
- **WHEN** a route sets `pricing_mode: per_day` with per-vehicle-type prices
- **THEN** the schema accepts it

#### Scenario: Invalid pricing mode rejected
- **WHEN** a route sets `pricing_mode` to a value other than `package` or `per_day`
- **THEN** the schema rejects it

### Requirement: Cross-references between collections
The schemas SHALL allow entries to reference related entries by slug: routes reference vehicle types for pricing; testimonials MAY reference a route and/or a driver; drivers MAY reference a vehicle.

#### Scenario: Optional references omitted
- **WHEN** a testimonial omits its optional `route` and `driver` references
- **THEN** the schema still accepts it

#### Scenario: References captured when present
- **WHEN** a testimonial provides a `route` slug and a `driver` slug
- **THEN** the parsed entry exposes those reference values for later resolution

### Requirement: Build-time content validation
The system SHALL validate all content entries against their schemas during the build, so invalid content fails the build rather than shipping.

#### Scenario: Invalid content fails the build
- **WHEN** a content file violates its schema (missing required field or bad enum)
- **THEN** `astro build` fails with a non-zero exit code and a validation error

#### Scenario: Valid content builds
- **WHEN** all content files satisfy their schemas
- **THEN** the build completes successfully

