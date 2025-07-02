package models

import "github.com/uptrace/bun"

type Setting struct {
	bun.BaseModel `bun:"table:settings"`

	Key   string `bun:",pk,scanonly"`
	Value string `bun:",notnull"`
}
