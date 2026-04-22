package db

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/FachschaftMathPhysInfo/kummerkasten/configuration"
	"github.com/FachschaftMathPhysInfo/kummerkasten/migrations"
	"github.com/FachschaftMathPhysInfo/kummerkasten/models"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

var (
	db    *bun.DB
	sqldb *sql.DB
	err   error
)

const MaxDbPings = 10
const PingIntervalDBConnection = 5 * time.Second

func Init(ctx context.Context) (*sql.DB, *bun.DB) {
	config := configuration.Get()

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		config.Database.User,
		config.Database.Password,
		config.Database.Host,
		config.Database.Port,
		config.Database.Name)

	sqldb = sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	for i := 0; i < MaxDbPings; i++ {
		slog.Info("Connecting to database...",
			"attempt", i+1,
			" max_attempts", MaxDbPings)
		err = sqldb.Ping()
		if err == nil {
			break
		}

		time.Sleep(PingIntervalDBConnection)
	}

	if err != nil {
		slog.Error("Error connecting to database", "error", err)
		os.Exit(1)
	}

	db = bun.NewDB(sqldb, pgdialect.New())
	db.WithQueryHook(bundebug.NewQueryHook())
	db.RegisterModel((*models.LabelsToTickets)(nil))

	if err := migrations.RunMigrations(db, ctx); err != nil {
		slog.Error("Error running migrations. To save the data from corruption the service will abort.", "error", err)
		panic(err)
	}

	return sqldb, db
}
