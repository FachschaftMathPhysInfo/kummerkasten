package middleware

import (
	"context"
	"github.com/uptrace/bun"
	"log"
	"time"

	"github.com/Plebysnacc/kummerkasten/graph/model"
)

func VerifySID(ctx context.Context, sid string, db *bun.DB) (*model.User, error) {
	var sessions []*model.Session

	if err := db.NewSelect().Model(&sessions).Where("id = ?", sid).Scan(ctx); err != nil {
		return nil, err
	}

	if sessions == nil {
		return nil, nil
	}

	if sessions[0].ExpiresAt.Before(time.Now()) {
		_, _ = db.NewDelete().Model(sessions[0]).Exec(ctx)
		return nil, nil
	}

	var users []*model.User

	err := db.NewSelect().Model(&users).Where("id = ?", sessions[0].UserID).Scan(ctx)
	if err != nil || len(users) == 0 {
		log.Printf("User could not be verified. SID not found in database")
		return nil, err
	}

	return users[0], nil
}
