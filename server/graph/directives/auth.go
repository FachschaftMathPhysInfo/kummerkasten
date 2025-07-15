package directives

import (
	"context"
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/Plebysnacc/kummerkasten/models"
)

func HasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role *model.UserRole) (res interface{}, err error) {
	user, _ := ctx.Value("user").(*models.User)
	isAdmin := user.Role == model.UserRoleAdmin
	if *role == user.Role || isAdmin {
		return next(ctx)
	}
	return nil, fmt.Errorf("access denied")
}
