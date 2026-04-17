package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/FachschaftMathPhysInfo/kummerkasten/configuration"
	"github.com/FachschaftMathPhysInfo/kummerkasten/db"
	"github.com/FachschaftMathPhysInfo/kummerkasten/utils"
	"github.com/gorilla/websocket"
	"github.com/robfig/cron"

	"net/http/httputil"
	"net/url"

	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/uptrace/bun"

	"github.com/FachschaftMathPhysInfo/kummerkasten/graph"
	"github.com/FachschaftMathPhysInfo/kummerkasten/graph/directives"
	"github.com/FachschaftMathPhysInfo/kummerkasten/maintenance"
	"github.com/FachschaftMathPhysInfo/kummerkasten/middleware"
	_ "github.com/lib/pq"
)

const port = "8080"

var config configuration.Configuration

var (
	frontendUrl, _ = url.Parse("http://localhost:3000")
	cronjob        *cron.Cron
	srv            *handler.Server
	resolver       *graph.Resolver
	ctx            = context.Background()
	DB             *bun.DB
	c              *cors.Cors
)

func main() {
	utils.InitLogger()
	configuration.Init()
	config = configuration.Get()

	if config.System.Mode == "DEV" {
		slog.Warn("Software is starting in DEV mode, which is insecure in production")
	}

	initDatabase()
	initGraphQL()
	initCors()
	initCron()
	cronjob.Start()
	defer cronjob.Stop()

	slog.Info("Starting...")
	router := chi.NewRouter()
	router.Use(c.Handler)

	router.Mount("/api", getAPIRouter())

	if config.System.Mode == "DEV" {
		router.Handle("/playground", playground.Handler("GraphQL playground", "/api"))
	}

	router.Handle("/*", httputil.NewSingleHostReverseProxy(frontendUrl))

	slog.Info("Server is ready!")

	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		slog.Error("Server failed to start", "error", err)
		os.Exit(1)
	}
}

func initDatabase() {
	slog.Info("starting database initialization...")
	_, DB = db.Init(ctx)
	slog.Info("database initialization completed!")

	slog.Info("starting database seeding...")
	err := db.SeedData(ctx, DB)
	if err != nil {
		slog.Error("seed failed", "error", err)
		os.Exit(1)
	}

	slog.Info("database seeding completed!")
}

func initGraphQL() {
	slog.Info("initializing GraphQL resolvers...")
	resolver = &graph.Resolver{
		DB: DB,
	}

	config := graph.Config{
		Resolvers: resolver,
		Directives: graph.DirectiveRoot{
			HasRole:  directives.HasRole,
			OnlySelf: directives.OnlySelf,
		},
	}

	srv = handler.New(graph.NewExecutableSchema(config))
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.Websocket{})
	srv.AddTransport(transport.GET{})
	srv.Use(extension.Introspection{})

	es := graph.NewExecutableSchema(graph.Config{Resolvers: resolver})
	srv := handler.New(es)

	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.AddTransport(transport.Websocket{
		Upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		},
		KeepAlivePingInterval: 10 * time.Second,
	})
	srv.Use(extension.Introspection{})

	slog.Info("GraphQL intialization completed!")
}

func initCors() {
	slog.Info("setting up CORS...")
	var allowedOrigins = []string{config.System.Domain}

	if config.System.Mode == "DEV" {
		allowedOrigins = append(allowedOrigins, "localhost:3000", "localhost:8080")
	}

	c = cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            false,
	})
	slog.Info("CORS set up!")
}

func initCron() {
	slog.Info("setting up cronjobs...")

	cronjob = cron.New()
	if err := cronjob.AddFunc("@hourly", func() {
		if err := maintenance.ClearExpiredSessions(ctx, resolver); err != nil {
			slog.Error("cronjob failed", "error", err)
		}
	}); err != nil {
		slog.Error("setting up cronjob failed", "error", err)
	}
	slog.Info("cronjob set up!")
}

func getAPIRouter() *chi.Mux {
	api := chi.NewRouter()
	api.Use(middleware.InjectWriter)
	api.Use(middleware.Auth(DB))
	api.Handle("/", srv)
	api.Handle("/*", srv)
	return api
}
