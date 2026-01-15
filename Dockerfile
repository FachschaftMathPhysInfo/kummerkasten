FROM node:25-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN mkdir -p ../server/graph
COPY server/graph/schema.graphqls ../server/graph/schema.graphqls
RUN npm run generate
RUN npm run build

FROM golang:1.24-alpine AS server-build
WORKDIR /go/src
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ .
RUN go run github.com/99designs/gqlgen generate
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o graphql-server server.go


FROM alpine:3.23.2 AS final
WORKDIR /app

RUN apk add --no-cache nodejs

COPY --from=frontend-build /app/.next/standalone ./
COPY --from=frontend-build /app/.next/static ./.next/static
COPY --from=frontend-build /app/public ./public

COPY --from=server-build /go/src/graphql-server /usr/local/bin/graphql-server

ENV PORT=3000
ENV HOSTNAME=localhost

EXPOSE 8080


CMD ["sh", "-c", "graphql-server & node server.js"]
