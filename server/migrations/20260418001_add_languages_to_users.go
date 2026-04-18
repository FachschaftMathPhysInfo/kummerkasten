package migrations

import (
	"context"
	"log/slog"

	"github.com/FachschaftMathPhysInfo/kummerkasten/models"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		if _, err := db.
			NewAddColumn().
			Model((*models.User)(nil)).
			ColumnExpr("language VARCHAR(2)").
			IfNotExists().
			Exec(ctx); err != nil {
			slog.Error("failed adding table")
			return err
		}

		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		if _, err := db.
			NewDropColumn().
			Model((*models.User)(nil)).
			Column("language").
			Exec(ctx); err != nil {
			slog.Error("Failed to drop column", "table", "users", "column", "language", "err", err)
			return err
		}

		return nil
	})
}
