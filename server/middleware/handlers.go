package middleware

import (
	"context"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
)

func Auth(db *bun.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sid, err := r.Cookie("sid")
			if err != nil || sid.Value == "" {
				next.ServeHTTP(w, r)
				return
			}

			_, err = uuid.Parse(sid.Value)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			user, err := VerifySID(r.Context(), sid.Value, db)
			if err != nil || user == nil {
				next.ServeHTTP(w, r)
				return
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
