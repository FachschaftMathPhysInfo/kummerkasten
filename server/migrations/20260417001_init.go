package migrations

import (
	"context"
	"log/slog"
	"time"

	"github.com/FachschaftMathPhysInfo/kummerkasten/graph/model"
	"github.com/uptrace/bun"
)

var tables = []interface{}{
	(*User)(nil),
	(*Label)(nil),
	(*Setting)(nil),
	(*Ticket)(nil),
	(*QuestionAnswerPair)(nil),
	(*Session)(nil),
	(*LabelsToTickets)(nil),
}

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		slog.Info("Migration up starting")

		if err := createTables(db, ctx); err != nil {
			slog.Error("Failed setting up inital tables", "error", err)
			return err
		}

		if _, err := db.NewCreateIndex().
			IfNotExists().
			TableExpr("sessions").
			Index("user_id_idx").
			ColumnExpr("user_id").
			Exec(ctx); err != nil {
			return err
		}

		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		tableNames := []string{
			"labels_to_tickets",
			"sessions",
			"question_answer_pairs",
			"tickets",
			"settings",
			"labels",
			"users",
		}

		if _, err := db.NewDropIndex().
			Index("user_id_idx").
			IfExists().
			Exec(ctx); err != nil {
			return err
		}

		for _, table := range tableNames {
			if _, err := db.NewDropTable().
				TableExpr(table).
				IfExists().
				Exec(ctx); err != nil {
				return err
			}
		}

		return nil
	})
}

func createTables(db *bun.DB, ctx context.Context) error {
	for _, table := range tables {
		if _, err := db.NewCreateTable().
			Model(table).
			IfNotExists().
			Exec(ctx); err != nil {
			return err
		}
	}
	return nil
}

type Label struct {
	bun.BaseModel `bun:"table:labels"`

	ID        string    `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Name      string    `bun:",notnull,unique"`
	Color     string    `bun:"type:varchar(8),default:'#7a7777'"`
	FormLabel bool      `bun:",default:false,notnull"`
	Tickets   []*Ticket `bun:"m2m:labels_to_tickets"`
}

type QuestionAnswerPair struct {
	bun.BaseModel `bun:"table:question_answer_pairs"`

	ID       string `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Question string `bun:",unique,notnull"`
	Answer   string `bun:",notnull"`
	Position int    `bun:",unique,notnull"`
}

type Session struct {
	bun.BaseModel `bun:"table:sessions"`

	ID              string    `bun:",pk,default:gen_random_UUID(),type:uuid"`
	UserID          string    `bun:",type:uuid,notnull"`
	LastInteraction time.Time `bun:",notnull"`
	ExpiresAt       time.Time `bun:",notnull"`
}

func (*Session) AfterCreateTable(ctx context.Context, query *bun.CreateTableQuery) error {
	_, err := query.DB().NewCreateIndex().IfNotExists().
		Model((*Session)(nil)).
		Index("user_id_idx").
		Column("user_id").
		Exec(ctx)
	return err
}

type Setting struct {
	bun.BaseModel `bun:"table:settings"`

	Key   string `bun:",pk"`
	Value string `bun:",notnull"`
}

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

type User struct {
	bun.BaseModel `bun:"table:users"`

	ID           string         `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Mail         string         `bun:",unique,notnull,type:varchar(255)"`
	Firstname    string         `bun:",notnull,type:varchar(255)"`
	Lastname     string         `bun:",notnull,type:varchar(255)"`
	Role         model.UserRole `bun:",notnull"`
	Password     string         `bun:",notnull"`
	CreatedAt    time.Time      `bun:",notnull"`
	LastModified time.Time      `bun:",notnull"`
	LastLogin    time.Time
}
