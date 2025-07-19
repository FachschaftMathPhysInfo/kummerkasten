package main

import (
	"context"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Plebysnacc/kummerkasten/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/robfig/cron"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/rs/cors"

	"github.com/Plebysnacc/kummerkasten/db"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/graph/directives"
	"github.com/Plebysnacc/kummerkasten/maintenance"
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
		if err := maintenance.ClearSessionIDs(ctx, resolver); err != nil {
			log.Printf("failed cronjob: %v", err)
		}
	}); err != nil {
		log.Printf("failed setting up cronjob: %v", err)
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
