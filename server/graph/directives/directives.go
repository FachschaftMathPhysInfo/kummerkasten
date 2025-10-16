package directives

import (
	"context"
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"github.com/FachschaftMathPhysInfo/kummerkasten/graph/model"
	"github.com/FachschaftMathPhysInfo/kummerkasten/middleware"
)

func HasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role *model.UserRole) (res interface{}, err error) {
	user, ok := ctx.Value(middleware.UserKey).(*model.User)

	if user == nil || !ok {
		return nil, fmt.Errorf("access denied")
	}

	isAdmin := user.Role == model.UserRoleAdmin
	if *role == user.Role || isAdmin {
		return next(ctx)
	}
	return nil, fmt.Errorf("access denied")
}

func OnlySelf(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
	user, ok := ctx.Value(middleware.UserKey).(*model.User)

	if user == nil || !ok {
		return nil, fmt.Errorf("access denied")
	}

	if user.Role == model.UserRoleAdmin {
		return next(ctx)
	}

	fieldCtx := graphql.GetFieldContext(ctx)
	if fieldCtx == nil {
		return nil, fmt.Errorf("access denied")
	}
	args := graphql.GetFieldContext(ctx).Args

	if id, exists := args["id"]; exists && id == user.ID {
		return next(ctx)
	}

	return nil, fmt.Errorf("denied: can only update self")
}
