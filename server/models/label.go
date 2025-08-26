package models

import "github.com/uptrace/bun"

type Label struct {
	bun.BaseModel `bun:"table:labels"`

	ID      string    `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Name    string    `bun:",notnull,unique"`
	Color   string    `bun:"type:varchar(8),default:'#7a7777'"`
	Tickets []*Ticket `bun:"m2m:labels_to_tickets"`
}
