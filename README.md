# General
This repo is private until the completion of our university class. Afterwards it will be transfered to the organisation MathPhysInfo as a FOSS.

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
```
cp .env .env.local
```
and fill out the configurations as desired. Afterwards run

```
cd server
export $(cat ../.env.local)
docker compose up -d
go run generate ./...
go run server.go
```
now the frontend and api are available at port `8080`

## Deployment
To be added
