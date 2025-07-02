package models

import (
	"github.com/uptrace/bun"
	"time"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID        string    `bun:",pk,default:gen_random_uuid(),scanonly"`
	sid       string    `bun:",varchar(11)"`
	Email     string    `bun:",unique,notnull"`
	Firstname string    `bun:",notnull"`
	Lastname  string    `bun:",notnull"`
	Role      string    `bun:",notnull,default:'USER'"`
	Password  string    `bun:",notnull"`
	Salt      string    `bun:",notnull,scanonly"`
	CreatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp,scanonly"`
	UpdatedAt time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
