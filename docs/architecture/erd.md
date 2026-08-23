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

## Story extension — Render centered Hello Word

Reviewed frontend mock contract from UI PR #11:

```ts
export const greetingMock = {
  displayText: 'Hello Word',
} as const;
```

No new entity is needed. Existing `greetings.display_text` maps to API field `displayText` for the centered page.

Data source mapping:

| UI field | Source table | Source column | Rule |
|---|---|---|---|
| `displayText` | `greetings` | `display_text` | Return exact stored value for canonical row `id = 1`; preserve spelling, spacing, and case. |

Indexes:

- No new index. Primary key `greetings.id` serves `GET /v1/greeting` query by canonical row id.

## Migration plan — Render centered Hello Word

Forward:

1. No schema migration required for this story. `greetings` already stores the only value the page reads.
2. Existing seed row remains `id = 1`, `display_text = 'Hello Word'` from the base migration.

Backward:

1. No rollback migration required because this story adds no table, column, constraint, or index.

Safety on populated tables:

- Safe. No data definition or data rewrite is performed for this story.
