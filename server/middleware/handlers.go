package middleware

import (
	"context"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"time"
)

func Auth(db *bun.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sessionCookie, err := r.Cookie("sessionCookie")
			if err != nil || sessionCookie.Value == "" {
				next.ServeHTTP(w, r)
				return
			}

			_, err = uuid.Parse(sessionCookie.Value)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			user, err := VerifySID(r.Context(), sessionCookie.Value, db)
			if err != nil || user == nil {
				next.ServeHTTP(w, r)
				return
			}

			now := time.Now()
			if _, err := db.NewUpdate().Model((*model.Session)(nil)).
				Where("id = ?", sessionCookie.Value).
				Set("last_interaction = ?", now).
				Exec(context.Background()); err != nil {
				log.Printf("Error updating session: %v", err)
				next.ServeHTTP(w, r)
			}

			ctx := context.WithValue(r.Context(), UserKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// InjectWriter Injects an http ResponseWrite to use by the login query
func InjectWriter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), WriterKey, w)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
