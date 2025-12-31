package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/FachschaftMathPhysInfo/kummerkasten/configuration"
	"github.com/FachschaftMathPhysInfo/kummerkasten/db"
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
	configuration.LoadSystemConfiguration()
	config = configuration.SystemConfiguration
	if config.System.Mode == "DEV" {
		log.Print("====== WARNING ======")
		log.Print("Software is starting in DEV mode, which is insecure in production")
		log.Print("====== ======= ======")
	}

	initDatabase()
	initGraphQL()
	initCors()
	initCron()
	cronjob.Start()
	defer cronjob.Stop()

	log.Print("starting server...")
	router := chi.NewRouter()
	router.Use(c.Handler)

	router.Mount("/api", getAPIRouter())

	if config.System.Mode == "DEV" {
		router.Handle("/playground", playground.Handler("GraphQL playground", "/api"))
	}

	router.Handle("/*", httputil.NewSingleHostReverseProxy(frontendUrl))

	log.Printf("Server is ready!")
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func initDatabase() {
	log.Print("starting database initialization...")
	_, DB = db.Init(ctx, configuration.SystemConfiguration)
	log.Print("database initialization completed!")

	log.Print("starting database seeding...")
	err := db.SeedData(ctx, DB)
	if err != nil {
		log.Fatal("seed failed: ", err)
	}

	log.Print("database seeding completed!")
}

func initGraphQL() {
	log.Print("initializing GraphQL resolvers...")
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

	log.Print("GraphQL intialization completed!")
}

func initCors() {
	log.Print("setting up CORS...")
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
	log.Print("CORS set up!")
}

func initCron() {
	log.Print("setting up cronjobs...")

	cronjob = cron.New()
	if err := cronjob.AddFunc("@hourly", func() {
		if err := maintenance.ClearExpiredSessions(ctx, resolver); err != nil {
			log.Printf("failed cronjob: %v", err)
		}
	}); err != nil {
		log.Printf("failed setting up cronjob: %v", err)
	}
	log.Print("cronjob set up!")
}

func getAPIRouter() *chi.Mux {
	api := chi.NewRouter()
	api.Use(middleware.InjectWriter)
	api.Use(middleware.Auth(DB))
	api.Handle("/", srv)
	api.Handle("/*", srv)
	return api
}
