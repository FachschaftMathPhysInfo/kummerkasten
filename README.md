<div align="center">
    <a href="https://github.com/FachschaftMathPhysInfo/kummerkasten">
        <img src="frontend/public/logo_dark.svg" alt="Logo" width="80" height="80" />
    </a>

<h3 align="center">Kummerkasten</h3>
<p align="center">A software to collect feedback in educational groups and institutions</p>

</div>

## Getting Started
>[!CAUTION]
> The software is currently only available in german but we are working on implementing general i8n.

### Deployment with docker-compose
The software is best deployed in a dockerized environment. We provide `docker-compose.example.yml` and `config.example.json`
as plug and play files, which can be used to quickly deploy the software via:
```
docker compose up -d
```
The example files can be found in `/docs`

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
4. Please dont assign people to PRs if not previously discussed with them
5. Be happy <3 
