# Services — hello-word-7

## Scope

Backend exposes one public read endpoint plus health. Paths are written as backend sees them. No `/api` prefix.

## Shared response rules

- Content type: `application/json` for API responses.
- Success responses contain resource fields at top level.
- Error responses use one envelope everywhere:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Error code values:

| Code | HTTP status | Meaning |
|---|---:|---|
| `not_found` | 404 | Canonical greeting row missing |
| `invalid_state` | 500 | Greeting row blank or ambiguous stored state |
| `service_unavailable` | 503 | Database unavailable |
| `internal_error` | 500 | Unexpected server failure |

Messages are safe for public display and do not include database details.

## Endpoints

### `GET /healthz`

Purpose: runtime health check.

Request body: none.

Success response: `200 OK`

```json
{
  "status": "ok"
}
```

Failure response: `503 Service Unavailable`

```json
{
  "error": {
    "code": "service_unavailable",
    "message": "service unavailable"
  }
}
```

Health returns 200 only after migrations succeeded and `SELECT 1` against PostgreSQL works.

### `GET /v1/greeting`

Purpose: return canonical display text for main screen.

Request body: none.

Success response: `200 OK`

```json
{
  "displayText": "Hello Word"
}
```

Failure responses:

| Condition | Status | Code |
|---|---:|---|
| Greeting row missing | 404 | `not_found` |
| Greeting row blank or whitespace-only | 500 | `invalid_state` |
| More than one canonical row possible due schema corruption | 500 | `invalid_state` |
| PostgreSQL unavailable | 503 | `service_unavailable` |
| Unexpected failure | 500 | `internal_error` |

## CORS

Local frontend and backend run on different origins in development. Backend may allow `GET` requests from the configured frontend origin if needed by story implementation. Do not allow credentials; no auth or cookies exist.

## Compatibility

- Frontend must call `/v1/greeting` through `NEXT_PUBLIC_API_URL`.
- Backend must not mount `/api/v1/greeting`.
- JSON field stays `displayText`; changing it breaks frontend contract and tests.
