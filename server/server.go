package main

import (
	"context"
	"github.com/robfig/cron"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/Plebysnacc/kummerkasten/db"
	"github.com/Plebysnacc/kummerkasten/graph"
	"github.com/Plebysnacc/kummerkasten/maintenance"

	_ "github.com/lib/pq"
)

const defaultPort = "8080"

func main() {
	ctx := context.Background()

	port := defaultPort

	_, DB := db.Init(ctx)

	resolver := &graph.Resolver{
		DB: DB,
	}

	c := cron.New()
	if err := c.AddFunc("@hourly", func() {
		if err := maintenance.ClearSessionIDs(ctx, resolver); err != nil {
			log.Printf("failed cronjob: %v", err)
		}
	}); err != nil {
		log.Printf("failed setting up cronjob: %v", err)
	}

	c.Start()
	defer c.Stop()

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

	if os.Getenv("DEBUG") != "" {
		http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
		http.Handle("/query", srv)

		log.Printf("Connect to http://localhost:%s/playground for GraphQL playground", port)
	}

	log.Printf("Server is ready!")

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
