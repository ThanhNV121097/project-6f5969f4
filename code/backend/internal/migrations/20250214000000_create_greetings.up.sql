create table if not exists greetings (
  id smallint primary key,
  display_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint greetings_singleton check (id = 1),
  constraint greetings_display_text_not_blank check (length(btrim(display_text)) > 0)
);

insert into greetings (id, display_text)
values (1, 'Hello Word')
on conflict (id) do nothing;
