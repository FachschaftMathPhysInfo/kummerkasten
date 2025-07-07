package maintenance

import (
	"context"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"log"
	"time"
)

func ClearSessionsIDs(ctx context.Context, r *graph.Resolver) error{
	timeTreshold := time.Now().Add(time.Hour * -12)
	if _, err := r.DB.NewUpdate().Model((*model.User)(nil)).
		Where("last_login < (?)", timeTreshold).
		Set("sid = (?)", "").
		Exec(ctx); err != nil {
		log.Println("Error clearing sessions IDs: couldnt fetch uesrs")
		return err
	}

	return nil
}

