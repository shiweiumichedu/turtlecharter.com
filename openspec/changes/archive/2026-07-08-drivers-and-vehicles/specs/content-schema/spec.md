## ADDED Requirements

### Requirement: Driver bio fields
The `drivers` schema SHALL support optional bilingual bio fields (`bio_zh`, `bio_en`) so a driver's biography renders per-locale rather than as mixed-language body text.

#### Scenario: Bio omitted remains valid
- **WHEN** a driver entry provides no bio fields
- **THEN** the schema still accepts it

#### Scenario: Bio resolved per locale
- **WHEN** a driver has both `bio_zh` and `bio_en` and the detail page is viewed under `/en/`
- **THEN** the English bio is shown; if `bio_en` is absent, the Chinese bio is shown as fallback
