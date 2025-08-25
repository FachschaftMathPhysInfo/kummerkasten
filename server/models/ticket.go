package models

import (
	"time"

	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/uptrace/bun"
)

type Ticket struct {
	bun.BaseModel `bun:"table:tickets"`

	ID            string            `bun:",pk,default:gen_random_UUID(),type:uuid"`
	OriginalTitle string            `bun:",notnull"`
	Title         string            `bun:",notnull"`
	Text          string            `bun:",notnull"`
	Note          string            `bun:""`
	State         model.TicketState `bun:",notnull,default:'NEW'"`
	CreatedAt     time.Time         `bun:",notnull,default:current_timestamp"`
	LastModified  time.Time         `bun:",notnull,default:current_timestamp"`
	Labels        []*Label          `bun:"m2m:labels_to_tickets"`
}

type LabelsToTickets struct {
	bun.BaseModel `bun:"table:labels_to_tickets,alias:ltt"`

	TicketID string  `bun:",pk,type:uuid,notnull"`
	LabelID  string  `bun:",pk,type:uuid,notnull"`
	Ticket   *Ticket `bun:"rel:belongs-to,join:ticket_id=id"`
	Label    *Label  `bun:"rel:belongs-to,join:label_id=id"`
}
