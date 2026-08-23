# ERD — hello-word-7

## Scope

One persisted display value for module `general`. No users, edits, audit log, or localization.

## Tables

### `greetings`

| Column | Type | Null | Default | Notes |
|---|---|---:|---|---|
| `id` | `smallint` | no | none | Canonical row id. Must be `1`. |
| `display_text` | `text` | no | none | Value rendered by frontend. Seeded as `Hello Word`. |
| `created_at` | `timestamptz` | no | `now()` | Row creation time. |
| `updated_at` | `timestamptz` | no | `now()` | Last update time. |

Constraints:

- Primary key: `greetings.id`.
- Check: `id = 1`, enforcing exactly one canonical possible row.
- Check: `length(btrim(display_text)) > 0`, preventing blank/whitespace display text.

Seed data:

| id | display_text |
|---:|---|
| 1 | `Hello Word` |

## Relationships

None. Single table only.

## Operational notes

- Migration creates table and inserts canonical row.
- Backend reads row `id = 1`.
- Missing row, blank text, or unexpected row state returns error per `services.md`.
