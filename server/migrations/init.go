package migrations

import (
	"context"
	"log/slog"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/migrate"
)

var Migrations = migrate.NewMigrations()
var migrator *migrate.Migrator

func RunMigrations(db *bun.DB, ctx context.Context) error {
	migrator = migrate.NewMigrator(db, Migrations)
	if err := migrator.Init(ctx); err != nil {
		slog.Error("Failed to initialize Migrations", "error", err.Error())
		panic(err)
	}

	if err := migrator.Lock(ctx); err != nil {
		slog.Error("Failed to acquire migration lock", "error", err.Error())
	}

	defer func(migrator *migrate.Migrator, ctx context.Context) {
		err := migrator.Unlock(ctx)
		if err != nil {
			slog.Error("Failed to unlock migration lock", "error", err.Error())
		}
	}(migrator, ctx)

	group, err := migrator.Migrate(ctx)

	if err != nil {
		slog.Error("Failed to run Migrations", "error", err.Error())
	}

	if group.IsZero() {
		slog.Info("There were no new Migrations to be done.")
		return nil
	}

	slog.Info("Migrations done.", "current_group", group)
	return nil
}
