# SRS — general

Module: `general`
Last updated: 2025-02-14
Design: [View the approved design](http://localhost:8080/design/6f5969f4-dcb7-4037-b58b-f1d717880172)
Design system: `design/design-system.md`

> One file per module, at `docs/{module}/SRS.md`. It covers only the functions
> that belong to this module. Never write `docs/SRS.md`.

## 1. Purpose

`general` covers the one-page proof-of-pipeline experience. It stores one short piece of display text in PostgreSQL, serves it through the backend, and renders it centered on the page. If this module does not exist, the project stops being an end-to-end test of the full stack.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Guest | Any visitor with no account | View the public page and receive the displayed text |
| Operator | Project runtime | Read the stored text from the database and return it through the API |

## 3. Scope

**In scope** — the functions specified below, by their plan titles:

- Render centered Hello Word
- Persist and serve text

**Out of scope** — name what a reader would reasonably expect here and say where it lives instead.

- Multiple pages, navigation, or user input — deliberately not built; this project is a single static-style proof page.
- Editing the stored text from the browser — out of scope for `general`; no write UI is planned.

## 4. Functional requirements

### 4.1 Render centered Hello Word

**Requirement GENERAL-001 — Page shows stored text**

*As a* Guest, *I want to* see the stored greeting on the page, *so that* I can confirm the frontend reads data from the backend.

Behaviour:

1. The guest opens the page.
2. The page requests the greeting from the backend.
3. The page renders the returned text in the only visible content area.
4. The rendered text is not hardcoded in the frontend.

**Requirement GENERAL-002 — Page stays centered**

*As a* Guest, *I want to* see the greeting centered horizontally and vertically, *so that* the page matches the approved minimal design.

Behaviour:

1. The page uses a white background and black text.
2. The greeting appears centered in the viewport on load.
3. The greeting remains centered when the viewport size changes.
4. No extra visible controls, animation, or decorative content appear.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/general/test-cases/render-centered-hello-word.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | backend returns `Hello Word` | guest opens page | page shows `Hello Word` |
| AC-2 | frontend source has no hardcoded greeting | guest opens page | shown text comes from API response |
| AC-3 | page loads in any viewport size | guest opens page | greeting is centered horizontally and vertically |
| AC-4 | page loads | guest views page | background is white, text is black, and no animation or extra controls appear |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | Not applicable; guest provides no input | No validation UI is shown |
| Boundary | Viewport is very narrow or very tall | Greeting remains centered and page has no horizontal scroll from the layout |
| Not found | Greeting row is missing in storage | Page shows an error state instead of blank content |
| Not permitted | Not applicable; page is public | No access gate appears |
| Conflict | Not applicable; module has no user edits | No conflict state is exposed |
| Upstream failure | Backend or database is unavailable | Page shows an error state instead of stale or partial content |

**Data touched** — the fields this function reads and writes, in product terms.

| Field | Type | Required | Rule |
|---|---|---|---|
| Display text | text | yes | Must render exactly the stored value, including spacing and case |
| Page background | color | yes | Must be white |
| Text color | color | yes | Must be black |

### 4.2 Persist and serve text

**Requirement GENERAL-003 — Store greeting in database**

*As an* Operator, *I want to* keep one greeting row in PostgreSQL, *so that* the page has a persistent value to display.

Behaviour:

1. The database contains exactly one active greeting value for this project.
2. The value persists across application restarts.
3. The stored value is available to the backend without manual seeding during normal use.

**Requirement GENERAL-004 — API returns greeting**

*As an* Guest, *I want to* receive the greeting through a backend API, *so that* the frontend can render data from the server instead of hardcoding it.

Behaviour:

1. The backend reads the greeting from PostgreSQL.
2. The backend returns the stored greeting to the caller.
3. The backend does not transform the text beyond passing it through as display content.
4. If storage is unavailable, the backend returns an error response and no greeting value.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/general/test-cases/persist-and-serve-text.md`.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | database has one greeting row | backend requests greeting | API returns that value |
| AC-2 | database value is `Hello Word` | backend requests greeting | API returns `Hello Word` unchanged |
| AC-3 | database is restarted | backend requests greeting after restart | stored greeting is still returned |
| AC-4 | database is unavailable | backend requests greeting | API returns an error, not stale data |

**Failure, boundary and permission behaviour**

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | Not applicable; endpoint serves fixed content only | No request validation branch is needed |
| Boundary | Greeting text is empty or whitespace-only | Backend treats it as invalid stored content and returns an error rather than blank page text |
| Not found | Greeting row is missing | Backend returns a not-found or error response and no display text |
| Not permitted | Not applicable; no authenticated write path exists | No permission check is required |
| Conflict | More than one greeting row exists | Backend uses the single canonical row only if defined; otherwise returns an error and no ambiguous value |
| Upstream failure | PostgreSQL unavailable | Backend returns an error response and no cached substitute |

**Data touched** — the fields this function reads and writes, in product terms.

| Field | Type | Required | Rule |
|---|---|---|---|
| Greeting text | text | yes | Exactly one stored value, expected to equal `Hello Word` |
| Greeting row | record | yes | Exactly one active row exists for the module |

## 5. Screens

| Screen | Section in the design | Functions it serves | States that must exist |
|---|---|---|---|
| Main screen | Main screen: single centered Hello Word display on white background | GENERAL-001, GENERAL-002, GENERAL-003, GENERAL-004 | default, error |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Page and greeting API respond within 1s on a typical connection |
| Accessibility | Text contrast is at least 4.5:1 and content remains readable without animation |
| Responsive | Main screen works at 320px width and up with no horizontal page scroll |
| Localisation | Copy is English only |
| Privacy | No personal data is stored or displayed |

## 7. Dependencies and assumptions

- **Depends on:** PostgreSQL, for persistent greeting storage.
- **Depends on:** backend API, for serving the stored greeting to the page.
- **Assumption:** one canonical greeting value is enough for this project; if that changes, scope expands beyond this proof page.

| Open question | Proposed default | Who decides |
|---|---|---|
| Should the error state show a message or stay blank on failure? | Show a simple error message | Stakeholder |

## 8. Traceability

| Plan item | Requirement ids | Test cases |
|---|---|---|
| Render centered Hello Word | GENERAL-001, GENERAL-002 | `test-cases/render-centered-hello-word.md` |
| Persist and serve text | GENERAL-003, GENERAL-004 | `test-cases/persist-and-serve-text.md` |
