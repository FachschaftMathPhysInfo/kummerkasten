package models

import (
	"time"

	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID           string         `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Sid          string         `bun:",type:varchar(12)"`
	Mail         string         `bun:",unique,notnull,type:varchar(255)"`
	Firstname    string         `bun:",notnull,type:varchar(255)"`
	Lastname     string         `bun:",notnull,type:varchar(255)"`
	Role         model.UserRole `bun:",notnull"`
	Password     string         `bun:",notnull"`
	CreatedAt    time.Time      `bun:",notnull"`
	LastModified time.Time      `bun:",notnull"`
	LastLogin    time.Time
}
