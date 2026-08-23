package migrations

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"sort"
	"strings"
)

//go:embed *.up.sql
var files embed.FS

func Apply(ctx context.Context, db *sql.DB) error {
	if _, err := db.ExecContext(ctx, `create table if not exists schema_migrations (version text primary key, applied_at timestamptz not null default now())`); err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := files.ReadDir(".")
	if err != nil {
		return fmt.Errorf("read migrations: %w", err)
	}

	var names []string
	for _, entry := range entries {
		name := entry.Name()
		if !entry.IsDir() && strings.HasSuffix(name, ".up.sql") {
			names = append(names, name)
		}
	}
	sort.Strings(names)

	for _, name := range names {
		applied, err := isApplied(ctx, db, name)
		if err != nil {
			return err
		}
		if applied {
			continue
		}
		content, err := files.ReadFile(name)
		if err != nil {
			return fmt.Errorf("read migration %s: %w", name, err)
		}
		if _, err := db.ExecContext(ctx, string(content)); err != nil {
			return fmt.Errorf("apply migration %s: %w", name, err)
		}
		if _, err := db.ExecContext(ctx, `insert into schema_migrations (version) values ($1)`, name); err != nil {
			return fmt.Errorf("record migration %s: %w", name, err)
		}
	}
	return nil
}

func isApplied(ctx context.Context, db *sql.DB, name string) (bool, error) {
	var exists bool
	err := db.QueryRowContext(ctx, `select exists(select 1 from schema_migrations where version = $1)`, name).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check migration %s: %w", name, err)
	}
	return exists, nil
}
