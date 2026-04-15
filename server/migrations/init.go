package migrations

import (
	"context"
	"embed"
	"log/slog"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/migrate"
)

//go:embed *.go
var sqlFiles embed.FS

var Migrations = migrate.NewMigrations()
var migrator *migrate.Migrator

func InitMigrator(db *bun.DB, ctx context.Context) {
	if err := Migrations.Discover(sqlFiles); err != nil {
		slog.Error("Failed to find migration files", "error", err.Error())
		panic(err)
	}

	migrator = migrate.NewMigrator(db, Migrations)
	if err := migrator.Init(ctx); err != nil {
		slog.Error("Failed to initialize Migrations", "error", err.Error())
		panic(err)
	}
}

func RunMigrations(ctx context.Context) error {
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
