package middleware

import (
	"context"
	"log"

	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/model"
)

//nolint:deadcode,unused // Implemented for future use
func verifySID(r graph.Resolver, ctx context.Context, sid string) (*model.User, error) {
	var users []*model.User

	_, err := r.DB.NewSelect().Model(users).Where("sid = ?", sid).Exec(ctx)
	if err != nil || len(users) == 0 {
		log.Printf("User could not be verified. SID not found in database")
		return nil, err
	}

	return users[0], nil
}
