# ERD — hello-word-7

## Scope

Database stores one canonical greeting value for `general` module. No users, sessions, audit log, or edit history exist in current scope.

## Tables

### `greetings`

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| `id` | `smallint` | no | none | Canonical row id. Must be `1`. |
| `display_text` | `text` | no | none | Text returned to frontend. Initial value: `Hello Word`. |
| `created_at` | `timestamptz` | no | `now()` | Row creation time. |
| `updated_at` | `timestamptz` | no | `now()` | Last change time. |

Constraints:

- Primary key: `id`.
- Check: `id = 1`, enforcing one canonical row.
- Check: `length(btrim(display_text)) > 0`, preventing blank page text.

Seed data:

```sql
insert into greetings (id, display_text)
values (1, 'Hello Word')
on conflict (id) do nothing;
```

## Relationships

None. `greetings` is standalone.

## Migration ownership

- Initial migration creates `greetings` and inserts canonical row.
- Backend boot applies migrations before serving traffic.
- Later stories must not create a second greeting table or alternate seed path.
