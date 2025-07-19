package middleware

type ctxKey string

const (
	WriterKey ctxKey = "writer"
	UserKey   ctxKey = "user"
)
