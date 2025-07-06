package models

import (
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/uptrace/bun"
	"time"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID        string         `bun:",pk,default:gen_random_uuid()"`
	Sid       string         `bun:",type:varchar(11)"`
	Email     string         `bun:",unique,notnull"`
	Firstname string         `bun:",notnull"`
	Lastname  string         `bun:",notnull"`
	Role      model.UserRole `bun:",notnull,default:'USER'"`
	Password  string         `bun:",notnull"`
	Salt      string         `bun:",notnull"`
	CreatedAt time.Time      `bun:",notnull,default:current_timestamp"`
	UpdatedAt time.Time      `bun:",notnull,default:current_timestamp"`
}
