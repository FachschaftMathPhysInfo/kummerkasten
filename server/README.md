# Backend

## First Dev Setup
### Create Database
In postgres:
```
CREATE DATABASE <db_name>;
CREATE USER <username> WITH ENCRYPTED PASSWORD '<password>';
GRANT ALL PRIVILEGES ON DATABASE <db_name> TO <username>;
\c <db_name>
GRANT USAGE, CREATE
  ON SCHEMA public
  TO <user>;
```
Afterwards copy the .env and fill in the flags
`cp .env .env.local`

Set `DEBUG=true` for development


Now go into the server folder

```
go get github.com/99designs/gqlgen@v0.17.24
go mod tidy
go generate ./..
go run ./server.go
```

## Running the Server
In the server folder:

```
go generate ./...
go run ./server.go
```

## Currently Implemented
- Graphql Schema
- Userquery implemented as test

With dummy User currently
