package middleware

import (
	"context"
	"github.com/uptrace/bun"
	"log"

	"github.com/Plebysnacc/kummerkasten/graph/model"
)

func VerifySID(ctx context.Context, sid string, db *bun.DB) (*model.User, error) {
	var users []*model.User

	err := db.NewSelect().Model(&users).Where("sid = ?", sid).Scan(ctx)
	if err != nil || len(users) == 0 {
		log.Printf("User could not be verified. SID not found in database")
		return nil, err
	}

	return users[0], nil
}
