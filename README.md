# Kummerkasten

This project enables students to give anonymous, moderated feedback to their lecturers.

# Installation
We strongly recommend using the Docker-based approach!

## docker-compose

1. Edit the `development.env` accordingly
2. Build the docker-image `docker-compose build .`
3. Start the container `docker-compose up -d`
4. Create the database, if needed, `docker-compose exec kummerkasten bundle exec rake db:create`
5. Migrate the database, if needed, `docker-compose exec kummerkasten bundle exec rake db:migrate qc:update`
6. Done! Visit `localhost:3000`

## Non-Docker (Development environment)

1. Install all needed packages (see above)
2. Install and start an redis instance: https://redis.io/topics/quickstart
3. Clone this repository
4. set the needed environment variables(use `source development.sh` for a quickstart)
5. Create the needed database: `rake db:create db:migrate`
6. Precompile the assets: `rake assets:precompile`
7. Start the engines: `rails s`

### Requirements

#### Ruby version
The recommended software versions are
  - rails `>=5.1`
  - ruby `>=2.3`
  - node `>=7`

#### System dependencies
You should have the following packages installed (see Dockerfile)
  - `build-essential`
  - `nodejs`
  - `npm`
  - `libpq-dev`
  - `wget`
  - `git`
  - `cron`

You should provide a redis instance and an SMTP server.

