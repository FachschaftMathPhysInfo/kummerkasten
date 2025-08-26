package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/Plebysnacc/kummerkasten/models"
	"github.com/joho/godotenv"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

var (
	db     *bun.DB
	sqldb  *sql.DB
	err    error
	tables = []interface{}{
		(*models.User)(nil),
		(*models.Label)(nil),
		(*models.Setting)(nil),
		(*models.Ticket)(nil),
		(*models.QuestionAnswerPair)(nil),
		(*models.Session)(nil),
	}

	relations = []interface{}{
		(*models.LabelsToTickets)(nil),
	}
)

func Init(ctx context.Context) (*sql.DB, *bun.DB) {
	if err = godotenv.Load("../.env.local"); err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DB"))

	sqldb = sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	if err = sqldb.Ping(); err != nil {
		log.Fatal("Error connecting to database: ", err)
	}

	db = bun.NewDB(sqldb, pgdialect.New())
	db.AddQueryHook(bundebug.NewQueryHook())
	db.RegisterModel((*models.LabelsToTickets)(nil))

	if err := createTables(ctx, tables); err != nil {
		log.Panic("Failed to create basic tabels: ", err)
	}

	log.Println("Basic Database Tables successfully initialized")

	if err := createTables(ctx, relations); err != nil {
		log.Panic("Failed to create basic relations: ", err)
	}

	log.Println("Basic Database Relations successfully initialized")

	return sqldb, db
}

func createTables(ctx context.Context, tables []interface{}) error {
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
