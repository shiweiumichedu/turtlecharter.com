# content-queries Specification

## Purpose
TBD - created by archiving change content-model. Update Purpose after archive.
## Requirements
### Requirement: Ordered listing
The system SHALL provide a helper that returns content entries sorted by their `order` field ascending, so lists render in a controlled sequence.

#### Scenario: Entries sorted by order
- **WHEN** entries with `order` values 3, 1, 2 are passed to the ordering helper
- **THEN** they are returned in the sequence 1, 2, 3

#### Scenario: Stable for equal order
- **WHEN** two entries share the same `order` value
- **THEN** their relative input order is preserved

### Requirement: Featured filtering
The system SHALL provide a helper that returns only entries marked `featured: true`.

#### Scenario: Only featured returned
- **WHEN** a mix of featured and non-featured entries is filtered
- **THEN** only the featured entries are returned

### Requirement: Find by slug
The system SHALL provide a helper that returns the single entry matching a given slug, or nothing when no entry matches.

#### Scenario: Match found
- **WHEN** a slug that exists is looked up
- **THEN** the matching entry is returned

#### Scenario: No match
- **WHEN** a slug that does not exist is looked up
- **THEN** the helper returns nothing (undefined/null), not an error

### Requirement: Reference resolution
The system SHALL provide a helper that resolves a reference slug on one entry to the target entry in another collection.

#### Scenario: Resolve an existing reference
- **WHEN** a route's pricing entry references a vehicle type that exists
- **THEN** the resolver returns the matching vehicle entry

#### Scenario: Unresolved reference
- **WHEN** a reference points to a slug that has no target
- **THEN** the resolver returns nothing rather than throwing

### Requirement: Locale-aware value resolution for content
The system SHALL resolve a content entry's bilingual field to a single string for a given locale, returning the English value on `en` when present and otherwise falling back to the Chinese value.

#### Scenario: English present on en
- **WHEN** a field has both Chinese and English values and the locale is `en`
- **THEN** the English value is returned

#### Scenario: Fallback to Chinese on en
- **WHEN** a field has no English value and the locale is `en`
- **THEN** the Chinese value is returned

#### Scenario: Chinese on zh
- **WHEN** the locale is `zh`
- **THEN** the Chinese value is returned regardless of the English value

