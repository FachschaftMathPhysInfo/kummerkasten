package models

import "github.com/uptrace/bun"

type Label struct {
	bun.BaseModel `bun:"table:labels"`

	Name  string `bun:",pk"`
	Color string `bun:"type:varchar(8),default:'#151515'"`
}
