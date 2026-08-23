# ERD — hello-word-7

## Scope

One persisted display value for module `general`. No users, edits, audit log, or localization.

## Story extension: Persist and serve text

Reviewed UI mock contract:

```ts
export const greetingMock = {
  displayText: 'Hello Word',
} as const;
```

Backend schema stores one `display_text` value and service layer maps it to API field `displayText` without trimming, casing, or other display transformation.

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
- Check: `id = 1`, enforcing exactly one canonical possible row and preventing duplicates.
- Check: `length(btrim(display_text)) > 0`, preventing blank/whitespace display text.
- No foreign keys.
- No secondary indexes; `GET /v1/greeting` reads by primary key `greetings.id = 1`, served by `greetings_pkey`.

Seed data:

| id | display_text |
|---:|---|
| 1 | `Hello Word` |

## Relationships

None. Single table only.

## Migration plan

Forward:

1. Create `greetings` table with columns and constraints listed above.
2. Insert canonical row `(id, display_text) = (1, 'Hello Word')`.
3. Keep timestamps database-generated with `now()`.

Backward:

1. Drop `greetings` table.

Safety on populated tables:

- Forward migration is safe on an empty database.
- Forward migration is not intended for a database that already has a `greetings` table; migration must fail rather than merge ambiguous existing data.
- Backward migration deletes the single stored greeting. Safe only before any production dependence on persisted greeting content; acceptable here because value is seed data and no user edits exist.

## Operational notes

- Migration creates table and inserts canonical row.
- Backend reads row `id = 1`.
- Missing row, blank text, duplicate impossible-row attempts, or unexpected row state returns error per `services.md`.
