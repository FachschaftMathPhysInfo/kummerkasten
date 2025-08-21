package models

import (
	"time"

	"github.com/uptrace/bun"
)

type Session struct {
	bun.BaseModel `bun:"table:sessions"`

	ID        string    `bun:",pk,type:varchar(12),notnull"`
	UserID    string    `bun:",type:uuid,notnull"`
	ExpiresAt time.Time `bun:",notnull"`
}
