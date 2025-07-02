package main

import (
	"context"
	"github.com/Plebysnacc/kummerkasten/db"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Plebysnacc/kummerkasten/graph"
	_ "github.com/lib/pq"
)

const defaultPort = "8080"

func main() {
	ctx := context.Background()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	_, DB, _ := db.Init(ctx)

	resolver := &graph.Resolver{
		DB: DB,
	}

	es := graph.NewExecutableSchema(graph.Config{Resolvers: resolver})
	srv := handler.New(es)

	if os.Getenv("DEBUG") != "" {
		http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
		http.Handle("/query", srv)

		log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
