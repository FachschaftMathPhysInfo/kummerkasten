# Backend

## First Dev Setup
### Create Database
Copy the config:
`cp .env .env.local`

Start the docker
`docker compose up -d`

Set `DEBUG=true` for development

Now go into the server folder

```
go get github.com/99designs/gqlgen@v0.17.24
go mod tidy
go generate ./...
go run ./server.go
```

## Running the Server
In the server folder:

```
go generate ./...
go run ./server.go
```

Note that the docker or a local postgres instance is needed

## Currently Implemented
- Graphql Schema
- Userquery implemented as test

With dummy User currently
