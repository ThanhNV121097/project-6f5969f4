# Persist and serve text

## User story
As an Operator, I want one greeting row stored in PostgreSQL and served by the backend API, so that the page can read display text from the server instead of hardcoding it.

## In scope
- Store exactly one canonical greeting row for `general` in PostgreSQL.
- Return the stored greeting through the backend API without transforming the text.
- Keep the value available after application and database restarts.
- Return an error when the row is missing, empty, duplicated, or the database is unavailable.

## Out of scope
- Any browser editing or admin UI for changing the stored greeting.
- Multiple greeting records, user accounts, or permissions.
- Frontend rendering details beyond consuming this API response.
- Fallback or cached greeting content when PostgreSQL fails.

## UI scope
No direct UI in this story. It only supplies backend data for the main screen. The only visible state it affects is the API response that later front-end work will render or surface as an error.

## Acceptance criteria
1. Given one valid greeting row in PostgreSQL, when the backend requests greeting text, then the API returns that exact value.
2. Given the stored value is `Hello Word`, when the backend requests greeting text, then the API returns `Hello Word` unchanged.
3. Given the database restarts, when the backend requests greeting text after restart, then the stored greeting is still returned.
4. Given the greeting row is missing, empty, or duplicated, when the backend requests greeting text, then the API returns an error and no display text.
5. Given PostgreSQL is unavailable, when the backend requests greeting text, then the API returns an error and no cached substitute.

## Dependencies
- PostgreSQL service and schema migration support.
- Backend API implementation for the greeting endpoint.
- Existing canonical greeting data seeded or migrated into the database.
- The `Render centered Hello Word` story to consume the API on the page.
