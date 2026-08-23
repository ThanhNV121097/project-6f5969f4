# Test Cases — Render centered Hello Word

Risk level: low. Scope is single public page, but contract and error states still need coverage because page depends on API and layout rules.

## Cases

### Scenario: Page shows stored text
**Given** backend returns `Hello Word` from `GET /v1/greeting`
**When** guest opens main page
**Then** page shows visible text `Hello Word`
**Check:** render_url

Traceability: GENERAL-001, AC-1

### Scenario: Shown text comes from API response
**Given** backend API returns `Hello Word` and frontend source has no hardcoded greeting value
**When** guest opens main page
**Then** rendered text matches API response, not a frontend constant
**Check:** render_url

Traceability: GENERAL-001, AC-2

### Scenario: Greeting stays centered in viewport
**Given** page loads in a viewport of any size
**When** guest opens main page
**Then** greeting is centered horizontally and vertically in viewport
**Check:** manual

Traceability: GENERAL-002, AC-3

### Scenario: White background, black text, no extras
**Given** page loads successfully
**When** guest views main page
**Then** page background is white, text is black, and no animation or extra controls appear
**Check:** manual

Traceability: GENERAL-002, AC-4

### Scenario: Page shows error state when backend or database is unavailable
**Given** backend or PostgreSQL is unavailable
**When** guest opens main page
**Then** page shows error state instead of stale or partial content
**Check:** render_url

Traceability: GENERAL-002 failure behavior, upstream failure

### Scenario: Page shows error state when greeting row is missing
**Given** canonical greeting row is missing in storage
**When** guest opens main page
**Then** page shows error state instead of blank content
**Check:** render_url

Traceability: GENERAL-002 failure behavior, not found

### Scenario: No guest input or permission gate appears
**Given** guest opens public main page
**When** page loads
**Then** no validation UI and no access gate appear
**Check:** manual

Traceability: GENERAL-001, GENERAL-002 invalid input / not permitted

### Scenario: Main page remains centered at narrow viewport
**Given** page loads at 320px width or similarly narrow viewport
**When** guest opens main page
**Then** greeting remains centered and page has no horizontal scroll from layout
**Check:** manual

Traceability: GENERAL-002 boundary

### Scenario: GET /v1/greeting success shape
**Given** backend has stored greeting value `Hello Word`
**When** caller requests `GET /v1/greeting`
**Then** response status is `200`, content type is `application/json`, and body is `{ "displayText": "Hello Word" }`
**Check:** fetch_url

Traceability: GENERAL-004, service contract success

### Scenario: GET /v1/greeting error envelope for missing greeting
**Given** canonical greeting row is missing
**When** caller requests `GET /v1/greeting`
**Then** response status is `404` and body is `{ "error": { "code": "greeting_not_found", "message": "Greeting not found" } }`
**Check:** fetch_url

Traceability: GENERAL-004, service contract failure

### Scenario: GET /v1/greeting error envelope for invalid stored text
**Given** stored greeting text is empty or whitespace-only
**When** caller requests `GET /v1/greeting`
**Then** response status is `409` and body is `{ "error": { "code": "invalid_greeting", "message": "Greeting is not valid" } }`
**Check:** fetch_url

Traceability: GENERAL-004, boundary behavior

### Scenario: GET /v1/greeting returns service unavailable when PostgreSQL is down
**Given** PostgreSQL is unavailable
**When** caller requests `GET /v1/greeting`
**Then** response status is `503` and body is `{ "error": { "code": "service_unavailable", "message": "Service unavailable" } }`
**Check:** fetch_url

Traceability: GENERAL-004, upstream failure

### Scenario: GET /v1/greeting returns internal error for unexpected backend failure
**Given** backend hits an unexpected failure while serving greeting
**When** caller requests `GET /v1/greeting`
**Then** response status is `500` and body uses error code `internal_error`
**Check:** fetch_url

Traceability: service contract failure
