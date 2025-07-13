package models

import (
	"time"

	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/uptrace/bun"
)

type Ticket struct {
	bun.BaseModel `bun:"table:tickets"`

	ID           string            `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Title        string            `bun:",notnull"`
	Text         string            `bun:",notnull"`
	Note         string            `bun:""`
	State        model.TicketState `bun:",notnull,default:'NEW'"`
	CreatedAt    time.Time         `bun:",notnull,default:current_timestamp"`
	LastModified time.Time         `bun:",notnull,default:current_timestamp"`
	Labels       []string          `bun:",notnull"`
}

type LabelsToTickets struct {
	bun.BaseModel `bun:"table:labels_tickets"`

	TicketID string `bun:",pk"`
	LabelID  string `bun:",pk"`
}
