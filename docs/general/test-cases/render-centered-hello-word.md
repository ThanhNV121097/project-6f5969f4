# Test Cases — Render centered Hello Word

Risk level: low. One-page proof screen, but cases still cover required happy path, failure state, and layout constraints written in SRS and service contract.

## Coverage map
- GENERAL-001: AC-1, AC-2
- GENERAL-002: AC-3, AC-4
- Failure behavior: not found, upstream failure
- Service contract source: `GET /v1/greeting` success shape and error envelope

## Cases

**Scenario**: Page shows stored greeting from API
**Given** backend returns `200 OK` from `GET /v1/greeting` with body `{ "displayText": "Hello Word" }`
**When** guest opens main page
**Then** page shows visible text `Hello Word` and no other content in main area
Check: render_url

**Scenario**: Shown text comes from API, not hardcoded frontend string
**Given** backend returns `200 OK` from `GET /v1/greeting` with body `{ "displayText": "Hello Word" }`
**When** guest opens main page
**Then** browser display uses API response text `Hello Word`; frontend source does not need to contain greeting text for this case to pass
Check: render_url

**Scenario**: Greeting stays centered in viewport
**Given** backend returns `200 OK` from `GET /v1/greeting` with body `{ "displayText": "Hello Word" }`
**When** guest opens main page in default, narrow, and tall viewport sizes
**Then** visible greeting stays centered horizontally and vertically in each viewport, with no horizontal scroll from layout
Check: manual

**Scenario**: Page uses white background, black text, no animation or extra controls
**Given** backend returns `200 OK` from `GET /v1/greeting` with body `{ "displayText": "Hello Word" }`
**When** guest opens main page
**Then** page background is white, text is black, and no animation, buttons, inputs, menus, or other controls appear
Check: manual

**Scenario**: Missing greeting row shows error state
**Given** backend returns `404 Not Found` from `GET /v1/greeting` with body `{ "error": { "code": "greeting_not_found", "message": "Greeting not found" } }`
**When** guest opens main page
**Then** page shows error state instead of blank content and does not show stale greeting text
Check: render_url

**Scenario**: Backend unavailable shows error state
**Given** backend returns `503 Service Unavailable` from `GET /v1/greeting` with body `{ "error": { "code": "service_unavailable", "message": "Service unavailable" } }`
**When** guest opens main page
**Then** page shows error state instead of stale or partial greeting content
Check: render_url

**Scenario**: API success response shape matches contract
**Given** caller sends `GET /v1/greeting`
**When** backend responds successfully
**Then** response status is `200 OK`, content type is `application/json`, and body contains only `{ "displayText": "Hello Word" }`
Check: fetch_url

**Scenario**: API not-found error shape matches contract
**Given** caller sends `GET /v1/greeting` and canonical greeting row is missing
**When** backend responds to request
**Then** response status is `404 Not Found`, content type is `application/json`, and body contains error envelope `{ "error": { "code": "greeting_not_found", "message": "Greeting not found" } }`
Check: fetch_url

**Scenario**: API unavailable error shape matches contract
**Given** caller sends `GET /v1/greeting` and PostgreSQL is unavailable
**When** backend responds to request
**Then** response status is `503 Service Unavailable`, content type is `application/json`, and body contains error envelope `{ "error": { "code": "service_unavailable", "message": "Service unavailable" } }`
Check: fetch_url
