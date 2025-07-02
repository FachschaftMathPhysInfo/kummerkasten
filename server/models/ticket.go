package models

import (
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/uptrace/bun"
	"time"
)

type Ticket struct {
	bun.BaseModel `bun:"table:tickets"`

	ID        string            `bun:",pk,default:gen_random_UUID(),type:uuid,scanonly"`
	Title     string            `bun:",not null"`
	Text      string            `bun:",not null"`
	Note      string            `bun:""`
	State     model.TicketState `bun:",notnull,default:OPEN"`
	CreatedAt time.Time         `bun:",notnull,default:current_timestamp,scanonly"`
	UpdatedAt time.Time         `bun:",notnull,default:current_timestamp"`
}

type LabelsToTickets struct {
	bun.BaseModel `bun:"table:labels_tickets"`

	TicketID  string `bun:",pk"`
	LabelName string `bun:",pk"`
}
