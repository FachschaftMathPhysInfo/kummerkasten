<div align="center">
    <a href="https://github.com/FachschaftMathPhysInfo/kummerkasten">
        <img src="frontend/public/logo_dark.svg" alt="Logo" width="80" height="80" />
    </a>

<h3 align="center">Kummerkasten</h3>
<p align="center">A software to collect feedback in educational groups and institutions</p>

</div>

## Quick Start
>[!CAUTION]
> The software is currently only available in german but we are working on implementing general i8n.

### Prepare config
#### .env
Take the `/.env` and add your prefered credentials, `host` will most likely be `postgres`

#### config.json
Use the template at `/docs/config.example.json` and fill out all values but `database`, those can be left empty.
`system.mode` must be either `DEV` or `PROD`. The first uses default data but as the credentials are public, it is not 
safe to deploy on a public server.

### Launching the container
Now take the compose template at `/docs/docker-compose.example.yml` and change the values if needed. If you do not add
the `env` to the `app`-service, the `database` part of the config must be filled out.

### After Launch
Login to the software using the admin data provided in the config at `domain/login`. In the `FAQ` section you can change
texts presented on the root-form. Further users can be added in the `users` tab.

### Further help
The wiki is expanding and we will add more sophisticated guides and explanations there.

## Development
### Frontend
Switch into the frontend directory and run
```
npm i
npm run generate
npm run dev
```

### Backend
After installing general golang and dependencies run

```bash
cp .env .env.local
```

and fill out the configurations as desired. Afterwards run:

```bash
cd server
export $(cat ../.env.local)
docker compose up -d
go generate ./...
go run server.go
```

now the frontend and api are available at port `8080`

### Testing
We provide E2E tests in `frontend/cypress`, to use them run
```bash
cd frontend
npm run test
```

## Contributing
1. Create an Issue or assign an existing one to yourself
2. Create a branch
3. Open a PR
5. Be happy <3 
