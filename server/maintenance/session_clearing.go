package maintenance

import (
	"context"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"log"
	"time"
)

func ClearSessionIDs(ctx context.Context, r *graph.Resolver) error {
	timeThreshold := time.Now().Add(time.Hour * -12)
	if _, err := r.DB.NewUpdate().Model((*model.User)(nil)).
		Where("last_login < ?", timeThreshold).
		Set("sid = ?", "").
		Exec(ctx); err != nil {
		log.Println("Error clearing session IDs: couldn't fetch users")
		return err
	}

	return nil
}
