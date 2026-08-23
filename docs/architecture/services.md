# Service Contracts — hello-word-7

## Base rules

- Backend routes use `/v1/...` paths.
- Do not mount routes under `/api`; deployment proxy strips `/api` before backend receives request.
- All JSON responses use `application/json`.
- Successful responses return only data needed by caller.
- Error responses use one envelope everywhere.
- Public read endpoints require no authentication unless stated otherwise.

## Error envelope

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Rules:

- `code` is stable, lower snake case.
- `message` is safe for users and logs; no secrets or database internals.
- Unexpected server errors use `internal_error`.
- Error responses do not include `displayText`.

## Endpoints

### `GET /healthz`

Purpose: report backend and database readiness after migrations.

Auth: none.

Request: no body.

Success `200 OK`:

```json
{
  "status": "ok"
}
```

Failure `503 Service Unavailable`:

```json
{
  "error": {
    "code": "service_unavailable",
    "message": "Service unavailable"
  }
}
```

Readiness rules:

- Return `200` only after migrations have completed.
- Return `200` only when `SELECT 1` against PostgreSQL succeeds.

### `GET /v1/greeting`

Purpose: return stored greeting text for main page.

Auth: none.

Request: no body.

Success `200 OK`:

```json
{
  "displayText": "Hello Word"
}
```

Contract source:

```ts
export const greetingMock = {
  displayText: 'Hello Word',
} as const;
```

Mapping:

| API field | Source | Type | Null | Transform |
|---|---|---|---:|---|
| `displayText` | `greetings.display_text` for row `id = 1` | string | no | none |

Failures:

| Status | Code | Message | Cause |
|---:|---|---|---|
| `404` | `greeting_not_found` | `Greeting not found` | Canonical row `id = 1` missing |
| `409` | `invalid_greeting` | `Greeting is not valid` | Stored text is empty or whitespace, or storage state is ambiguous |
| `503` | `service_unavailable` | `Service unavailable` | PostgreSQL unavailable |
| `500` | `internal_error` | `Internal server error` | Unexpected backend failure |

Response example:

```json
{
  "error": {
    "code": "greeting_not_found",
    "message": "Greeting not found"
  }
}
```

Implementation notes:

- Query canonical row by `id = 1`.
- Return stored `display_text` exactly as `displayText`.
- Do not cache or fall back when PostgreSQL fails.
- Duplicate greeting rows are prevented by schema. If future data corruption or migration drift makes the single greeting ambiguous, return `409 invalid_greeting` and no `displayText`.

## CORS

No custom CORS policy in scaffold. Local compose uses frontend-to-browser API URL `http://localhost:8080`; backend story may allow browser origin if direct client fetch is used.
