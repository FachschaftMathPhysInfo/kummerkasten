package maintenance

import (
	"context"
	"log/slog"
	"time"

	"github.com/FachschaftMathPhysInfo/kummerkasten/graph"
	"github.com/FachschaftMathPhysInfo/kummerkasten/graph/model"
)

func ClearExpiredSessions(ctx context.Context, r *graph.Resolver) error {
	now := time.Now()
	if _, err := r.DB.NewDelete().Model((*model.Session)(nil)).
		Where("expires_at < ?", now).
		Exec(ctx); err != nil {
		slog.Error("Error clearing session IDs", "error", err)
		return err
	}

	anHourAgo := now.Add(-time.Hour)
	if _, err := r.DB.NewDelete().Model((*model.Session)(nil)).
		Where("last_interaction < ?", anHourAgo).
		Exec(ctx); err != nil {
		slog.Error("Error clearing session IDs", "error", err)
		return err
	}

	return nil
}
