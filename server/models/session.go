package models

import (
	"context"
	"time"

	"github.com/uptrace/bun"
)

type Session struct {
	bun.BaseModel `bun:"table:sessions"`

	ID        string    `bun:",pk,default:gen_random_UUID(),type:uuid"`
	UserID    string    `bun:",type:uuid,notnull"`
	ExpiresAt time.Time `bun:",notnull"`
}

func (*Session) AfterCreateTable(ctx context.Context, query *bun.CreateTableQuery) error {
	_, err := query.DB().NewCreateIndex().IfNotExists().
		Model((*Session)(nil)).
		Index("user_id_idx").
		Column("user_id").
		Exec(ctx)
	return err
}
