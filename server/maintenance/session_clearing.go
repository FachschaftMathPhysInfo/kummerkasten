package maintenance

import (
	"context"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"log"
	"time"
)

func ClearExpiredSessions(ctx context.Context, r *graph.Resolver) error {
	now := time.Now()
	if _, err := r.DB.NewDelete().Model((*model.Session)(nil)).
		Where("expires_at < ?", now).
		Exec(ctx); err != nil {
		log.Printf("Error clearing session IDs: %v", err)
		return err
	}

	anHourAgo := now.Add(-time.Hour)
	if _, err := r.DB.NewDelete().Model((*model.Session)(nil)).
		Where("last_interaction < ?", anHourAgo).
		Exec(ctx); err != nil {
		log.Printf("Error clearing session IDs: %v", err)
		return err
	}

	return nil
}
