# inquiry-form Specification

## Purpose
TBD - created by syncing change inquiry-form. Update Purpose after implementation.
## Requirements
### Requirement: Inquiry form on the contact page
The system SHALL render an inquiry form on the contact page (`/contact` and `/en/contact`) that collects the visitor's name, contact details (email and/or WeChat/phone), trip details (travel dates, party size, preferred route or interests), and a free-text message, with all labels localized per locale and a consent note shown near the submit control.

#### Scenario: Form renders with its fields
- **WHEN** a visitor opens `/contact`
- **THEN** the page shows an inquiry form with name, contact, trip-detail, and message fields
- **AND** a consent note is shown near the submit button

#### Scenario: Localized form
- **WHEN** the contact page is viewed under `/en/`
- **THEN** the field labels, placeholders, submit button, and consent note render in English

### Requirement: Required-field validation
The system SHALL require a name and at least one contact method (email or WeChat/phone) before a submission is composed, and SHALL surface a validation message when these are missing rather than composing an email.

#### Scenario: Missing name blocks submission
- **WHEN** the visitor submits the form with an empty name
- **THEN** a validation message is shown
- **AND** no email is composed

#### Scenario: No contact method blocks submission
- **WHEN** the visitor provides a name but neither an email nor a WeChat/phone value
- **THEN** a validation message is shown
- **AND** no email is composed

### Requirement: Compose a pre-filled email on submit
The system SHALL, on a valid submission, compose a `mailto:` link to the configured contact address with a subject and a body containing the submitted fields as labelled lines, omitting fields the visitor left blank, and open it so the visitor can send it from their mail client.

#### Scenario: Valid submission composes a mailto
- **WHEN** the visitor submits a valid form with a name and an email
- **THEN** a `mailto:` link to the contact address is composed
- **AND** its body contains the provided fields as labelled lines

#### Scenario: Blank fields are omitted from the body
- **WHEN** the visitor leaves the message field blank
- **THEN** the composed email body does not include a message line

#### Scenario: Special characters are encoded
- **WHEN** a field value contains spaces, newlines, or non-ASCII characters
- **THEN** the composed `mailto:` link percent-encodes them so it is a valid URL

### Requirement: Works without JavaScript
The system SHALL provide a functional submission path when JavaScript is unavailable, via a native `mailto:` form action, so the visitor can still reach the contact address.

#### Scenario: No-JS fallback
- **WHEN** the form is rendered
- **THEN** its `action` attribute is a `mailto:` link to the contact address
- **SO THAT** submitting without JavaScript still opens the visitor's mail client
