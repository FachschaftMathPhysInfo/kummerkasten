# Backend
## Running the Server
In the server folder:

```
gqlgen generate
make migrate-down
make migrate-up
go run ./server.go
```

## Currently Implemented
- Basic Database Structure included

### Database
```
cp env env.local
```
Edit the `env.local` to custom Postgres Initials

### Setup Local Postgres Instance
```

```
```
```


### Queries
#### User
Only  possible query currently:

```
query {
  user(id: "1") {
    id
    mail
    firstname
    lastname
    role
    createdAt
    lastModified
  }
}
```

```
query {
  users {
        firstname
  }
}
```

```
query {
  addUser(user: {firstname:"miau", lastname:"mreow", mail: "miau@mathphys.info", role:"user"}){
    firstname
  }
}
```

With dummy User currently
