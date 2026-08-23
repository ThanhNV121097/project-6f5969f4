CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE greetings (
  id smallint PRIMARY KEY,
  display_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT greetings_singleton CHECK (id = 1),
  CONSTRAINT greetings_display_text_not_blank CHECK (length(btrim(display_text)) > 0)
);

INSERT INTO greetings (id, display_text)
VALUES (1, 'Hello Word')
ON CONFLICT (id) DO NOTHING;
