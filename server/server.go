package main

import (
	"context"
	"github.com/gorilla/websocket"
	"github.com/robfig/cron"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/uptrace/bun"
	"net/http/httputil"
	"net/url"

	"github.com/Plebysnacc/kummerkasten/db"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/directives"
	"github.com/Plebysnacc/kummerkasten/maintenance"
	"github.com/Plebysnacc/kummerkasten/middleware"
	_ "github.com/lib/pq"
)

const port = "8080"

var (
	env            = os.Getenv("ENV")
	frontendUrl, _ = url.Parse("http://localhost:3000")
	cronjob        *cron.Cron
	srv            *handler.Server
	resolver       *graph.Resolver
	ctx            = context.Background()
	DB             *bun.DB
	c              *cors.Cors
)

func main() {
	if env == "DEV" {
		log.Print("====== WARNING ======")
		log.Print("Software is starting in DEV mode, which is insecure in production")
		log.Print("====== ======= ======")
	}

	log.Print("starting database initialization...")
	_, DB = db.Init(ctx)
	initGraphQL()
	initCors()

	log.Print("setting up cronjobs")
	initCron()
	cronjob.Start()
	defer cronjob.Stop()

	log.Print("starting server")
	router := chi.NewRouter()
	router.Use(c.Handler)

	router.Mount("/api", getAPIRouter())

	if env == "DEV" {
		router.Handle("/playground", playground.Handler("GraphQL playground", "/api"))
	}

	router.Handle("/*", httputil.NewSingleHostReverseProxy(frontendUrl))

	log.Printf("Server is ready!")
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func initGraphQL() {
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
}

func initCors() {
	var allowedOrigins = []string{os.Getenv("PUBLIC_DOMAIN")}

	if env == "DEV" {
		allowedOrigins = append(allowedOrigins, "localhost:3000", "localhost:8080")
	}

	c = cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            os.Getenv("DEBUG") == "true",
	})
}

func initCron() {
	cronjob = cron.New()
	if err := cronjob.AddFunc("@hourly", func() {
		if err := maintenance.ClearExpiredSessions(ctx, resolver); err != nil {
			log.Printf("failed cronjob: %v", err)
		}
	}); err != nil {
		log.Printf("failed setting up cronjob: %v", err)
	}

	cronjob.Start()
	defer cronjob.Stop()

	es := graph.NewExecutableSchema(graph.Config{Resolvers: resolver})
	srv := handler.New(es)

	log.Printf("Start Seeding!")
	err := db.SeedData(ctx, DB)
	if err != nil {
		log.Fatal("seed failed: ", err)
	}
	log.Printf("End Seeding!")

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

	if os.Getenv("DEBUG") != "" {
		http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
		http.Handle("/query", srv)

		log.Printf("Connect to http://localhost:%s/playground for GraphQL playground", port)
	}
}
func getAPIRouter() *chi.Mux {
	api := chi.NewRouter()
	api.Use(middleware.InjectWriter)
	api.Use(middleware.Auth(DB))
	api.Handle("/", srv)
	api.Handle("/*", srv)
	return api
}
