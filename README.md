<div align="center">
    <a href="https://github.com/FachschaftMathPhysInfo/kummerkasten">
        <img src="frontend/public/logo_dark.svg" alt="Logo" width="80" height="80" />
    </a>

<h3 align="center">Kummerkasten</h3>
<p align="center">A software to collect feedback in educational groups and institutions</p>

</div>

## Quick Start
A quickstart guide can be found in our [wiki](https://github.com/FachschaftMathPhysInfo/kummerkasten/wiki). You can also find a more detailed explanation of the configuration options there. We will shortly add guides for users and admins on how the software itself works - although we feel it its fairly intuitive.

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
