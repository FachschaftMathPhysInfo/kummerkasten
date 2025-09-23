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
and fill out the configurations as desired. Afterwards run:

```
cd server
export $(cat ../.env.local)
docker compose up -d
go generate ./...
go run server.go
```
now the frontend and api are available at port `8080`

### Testing
We currently provide a baseline of e2e tests with cypress. To use them, start the application and run 
```
cd frontend
npm run test
```

## Deployment
The software is best deployed in a dockerized environment. We provide `docker-compose.example.yml` as a plug and play file,
which can be used to quickly deploy the software via:
```
docker compose up -d
```
The example file can be found in `/docs`

> [!CAUTION]
> Note that this software was not yet penetration tested in production. While we give our best to adhere
> to security by design principles some issues can only be found in a full blown test, executed by experts
> \- something we are not.