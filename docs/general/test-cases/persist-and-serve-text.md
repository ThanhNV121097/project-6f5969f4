# Test Cases — Persist and serve text

Risk level: low. One read-only API and one persistent row; focus on contract, persistence, and failure states. Requirement scope: GENERAL-003, GENERAL-004.

## Automated coverage

### Scenario: API returns stored greeting from single database row
**Given** database has exactly one greeting row with display text `Hello Word`.
**When** backend handles request for greeting endpoint.
**Then** response status is `200 OK`, response content type is `application/json`, and body is exactly `{ "displayText": "Hello Word" }`.
**Check: fetch_url**

Traceability: GENERAL-003 AC-1, GENERAL-004 AC-1.

### Scenario: API returns greeting value unchanged
**Given** database row stores text `Hello Word`.
**When** backend handles request for greeting endpoint.
**Then** response status is `200 OK` and body display text is exactly `Hello Word` with same spelling and spacing, not transformed.
**Check: fetch_url**

Traceability: GENERAL-004 AC-2.

### Scenario: Greeting survives database restart
**Given** database has stored greeting row and application can read it before restart.
**When** database is restarted and backend handles request for greeting endpoint after restart.
**Then** response status is `200 OK` and body still returns `Hello Word` from persisted storage.
**Check: fetch_url**

Traceability: GENERAL-003 AC-3.

### Scenario: API returns error when database is unavailable
**Given** backend cannot reach PostgreSQL.
**When** backend handles request for greeting endpoint.
**Then** response status is `503 Service Unavailable` and body is `{ "error": { "code": "service_unavailable", "message": "Service unavailable" } }` with no stale greeting data.
**Check: fetch_url**

Traceability: GENERAL-004 AC-4, upstream failure requirement.

### Scenario: API returns error for empty stored greeting
**Given** canonical greeting row exists but stored text is empty or whitespace-only.
**When** backend handles request for greeting endpoint.
**Then** response status is `409 Conflict` and body is `{ "error": { "code": "invalid_greeting", "message": "Greeting is not valid" } }`.
**Check: fetch_url**

Traceability: boundary behavior for invalid stored content.

### Scenario: API returns not found when canonical row is missing
**Given** greeting row with `id = 1` is missing.
**When** backend handles request for greeting endpoint.
**Then** response status is `404 Not Found` and body is `{ "error": { "code": "greeting_not_found", "message": "Greeting not found" } }`.
**Check: fetch_url**

Traceability: not found behavior for missing storage row.

### Scenario: API ignores extra greeting rows and uses canonical row only
**Given** more than one greeting row exists and canonical row `id = 1` contains `Hello Word`.
**When** backend handles request for greeting endpoint.
**Then** response status is `200 OK` and body returns value from canonical row only.
**Check: fetch_url**

Traceability: conflict behavior for multiple rows.

## Manual coverage

### Scenario: Persisted greeting remains available after normal app restart
**Given** application and database are running with stored greeting row.
**When** full app stack is restarted normally.
**Then** greeting stays available without manual reseeding and page can still retrieve same text.
**Check: manual**

Traceability: GENERAL-003 AC-3, persistence expectation.

### Scenario: API returns no request-validation branch for fixed-content endpoint
**Given** guest sends request to greeting endpoint with no body.
**When** request is made.
**Then** no input form or validation UI appears because endpoint serves fixed content only.
**Check: manual**

Traceability: invalid input behavior not applicable.
