# Test Cases — Persist and serve text

Risk level: low. One read-only API path, one canonical row, no user input.

## Scenario: API returns stored greeting value

**Given** database has exactly one greeting row with text `Hello Word`
**When** caller sends `GET /v1/greeting`
**Then** response status is `200 OK` and JSON body is exactly `{ "displayText": "Hello Word" }`
**Trace**: GENERAL-003 AC-1, GENERAL-004 AC-1
**Check**: fetch_url

## Scenario: API returns greeting text unchanged

**Given** database greeting row text is `Hello Word`
**When** caller sends `GET /v1/greeting`
**Then** response status is `200 OK` and JSON body field `displayText` equals `Hello Word` with same spelling and spacing
**Trace**: GENERAL-004 AC-2
**Check**: fetch_url

## Scenario: Greeting survives database restart

**Given** database has exactly one greeting row with text `Hello Word`
**When** database is restarted and caller then sends `GET /v1/greeting`
**Then** response status is `200 OK` and JSON body still returns `displayText: Hello Word`
**Trace**: GENERAL-003 AC-3
**Check**: fetch_url

## Scenario: API returns error when database is unavailable

**Given** database is down or unreachable
**When** caller sends `GET /v1/greeting`
**Then** response status is `503 Service Unavailable` and JSON body is `{ "error": { "code": "service_unavailable", "message": "Service unavailable" } }` with no `displayText` field
**Trace**: GENERAL-004 AC-4, service contract `/v1/greeting` failure
**Check**: fetch_url

## Scenario: Empty stored greeting is rejected

**Given** greeting row text in database is empty or whitespace only
**When** caller sends `GET /v1/greeting`
**Then** response status is `409 Conflict` and JSON body is `{ "error": { "code": "invalid_greeting", "message": "Greeting is not valid" } }` with no `displayText` field
**Trace**: GENERAL-004 failure behavior, service contract `/v1/greeting` invalid stored content
**Check**: fetch_url

## Scenario: Missing greeting row returns not found

**Given** canonical greeting row `id = 1` is missing from database
**When** caller sends `GET /v1/greeting`
**Then** response status is `404 Not Found` and JSON body is `{ "error": { "code": "greeting_not_found", "message": "Greeting not found" } }` with no `displayText` field
**Trace**: GENERAL-004 failure behavior, service contract `/v1/greeting` missing canonical row
**Check**: fetch_url

## Scenario: Multiple greeting rows do not expose ambiguous value

**Given** more than one greeting row exists in database
**When** caller sends `GET /v1/greeting`
**Then** response is an error response and no ambiguous greeting text is returned
**Trace**: GENERAL-003 failure behavior, canonical row assumption
**Check**: fetch_url
