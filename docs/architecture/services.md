# Service Contracts — hello-word-7

## Base rules

- Backend routes use `/v1/...` paths.
- Do not mount routes under `/api`; deployment proxy strips `/api` before backend receives request.
- All JSON responses use `application/json`.
- Successful responses return only data needed by caller.
- Error responses use one envelope everywhere.

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

Response contract:

- `displayText` is a required string.
- `displayText` comes from `greetings.display_text` for canonical row `id = 1`.
- Backend preserves spelling, spacing, and case. No trimming or localization in successful response.
- Shape matches reviewed frontend mock module from UI PR #11: `{ displayText: 'Hello Word' }`.

Failures:

| Status | Code | Message | Cause |
|---:|---|---|---|
| `404` | `greeting_not_found` | `Greeting not found` | Canonical row `id = 1` missing |
| `409` | `invalid_greeting` | `Greeting is not valid` | Stored text is empty or whitespace |
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

Frontend handling requirement:

- Page may call this endpoint directly through deployment proxy path `/api/v1/greeting` or configured backend URL plus `/v1/greeting`.
- On any non-`200` response, invalid JSON, missing `displayText`, or network failure, page renders its error state instead of blank content.

## CORS

No custom CORS policy in scaffold. Local compose uses frontend-to-browser API URL `http://localhost:8080`; backend story may allow browser origin if direct client fetch is used.

## Story extension — Render centered Hello Word

No new endpoint is needed beyond `GET /v1/greeting`. This story consumes that endpoint to render the centered page.

Migration plan impact:

- No service migration needed.
- Backward compatibility is unchanged because response shape already matches reviewed mock contract.
- Safe on populated data because no API field is renamed or removed.
