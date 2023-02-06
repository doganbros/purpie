# Octopus (Typescript React App - Express REST API with postgres using Node.js, Express and Sequelize)

## Frontend Features

- Typescript (Strict Mode)
- ESNext
- React 17
- Prettier
- Airbnb Coding Style Guide
- Hooks
- React Router
- Redux
- Styled Components
- Grommet
- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await

## Backend Features

- [Typescript](https://www.typescriptlang.org/) (Strict Mode)
- [Airbnb Coding Style Guide](https://github.com/airbnb/javascript)
- ESNext
- CORS enabled
- [yarn](https://yarnpkg.com) for package management
- [Handlebars](https://handlebarsjs.com/) for rendering email templates
- [NestJS](https://nestjs.com/) is the main framework
- [Postgresql](https://www.postgresql.org/) is the database used
- [TypeORM](https://typeorm.io) is the database ORM used
- [Class Validator](https://github.com/typestack/class-validator) is used to validate request body.
- [helmet](https://github.com/helmetjs/helmet) is used to set http headers correctly.
- [dotenv](https://github.com/rolodato/dotenv-safe) is used to load .env variables
- [compression](https://github.com/expressjs/compression)
- [eslint](http://eslint.org)
- [morgan](https://github.com/expressjs/morgan)
- [Swagger](https://swagger.io/)
- Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

- [Node.js](https://nodejs.org/en/download/) (>= 10.13.0, except for v13) (Windows Build Tools for Windows systems)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [NestCli](https://docs.nestjs.com/cli/overview)
- [Postgress](https://www.postgresql.org/)

## Getting Started

```bash

git clone https://github.com/doganbros/octopus # Clone Repository
cd octopus
```

## Install dependencies:

```bash
yarn install
```

## Set environment variables into .env file:

```bash
cp .env.example .env
```

Then make changes to the boilerplate provided with your variables. The base configuration variables for Purpie is
listed below;

`SERVER_PORT=8000`

`PORT=3000`

`HOST=purpie.localhost`

`PURPIE_API_KEY=YOUR_PURPIE_API_KEY`

`PURPIE_API_SECRET=YOUR_PURPIE_API_SECRET`

## Create Postgres database

Please follow the steps below to get a development Postgres server running. The easiest way to
use [docker](https://www.docker.com/). If you have running Postgres database server you can skip these steps and simply
create an Octopus database.

1. Make sure you have docker installed on your computer. If you do not have docker already on your computer, Go
   to https://www.docker.com/get-started, choose your platform and click download. Follow the simple steps to get docker
   installed on your computer.
2. Open your terminal (command prompt or preferably powershell on windows).
3. Enter the
   command `docker run --name octopus-postgres-dev -e POSTGRES_PASSWORD=YOUR_DB_PASSWORD -p 5432:5432 -d postgres`
   Postgres docker image will be downloaded and Postgres Docker container with the name `octopus-postgres-dev` will up
   and serve from port 5432 after this command.
4. Run `docker exec -it octopus-postgres-dev psql -U postgres` to connect your Postgres database.
5. Run `CREATE DATABASE octopus;` to create your Octopus database.
6. Update your `.env` file with `YOUR_DB_PASSWORD`.
7. Run `\q` to quit from Psql and Docker container.

## Setting web server and routing

If Octopus is installed on your local computer, you will need to add the following line to your hosts file. The hosts
file for Unix based system including MacOs is `/etc/hosts` where as on Windows, it
is  `C:\windows\system32\drivers\etc\hosts` .

```bash
127.0.0.1	octopus.localhost
```

## Running project

```bash
yarn server:start:dev # Runs backend side in dev mode where "yarn server:start" runs backend in production
yarn start # Runs frontend side
```

## Try Purpie

- Visit http://octopus.localhost:3000/ (3000 is the default port) and create your super admin user.
- Visit http://octopus.localhost:8000/swagger/ to try out some backend APIs.

## Development Test Email Setup

To test (preview) how mails will appear in email clients . We use `mail dev` client. Follow the steps below to set it up
on your local development environment.

- Run `docker run -p 1080:80 -p 1025:25 djfarrelly/maildev -d`. This will a maildev server on port `1080`
- Visit `http://localhost:1080`.
- All test mails will appear in this inbox.
- Go to Swagger UI and call the endpoint `POST [API_VERSION]/mail/test` to send test mail.
- Visit the swagger UI to learn the payload required. (TODO: No info found in Swagger)

## Development Test Meeting

We provide https://octopus-jitsi.doganbros.com as a server that handles all meetings for development. Currently every
developer must connect to this server in order to test how meeting is created, video is streamed etc. Since there is
only one server, there is a need to identify each development environment while making requests to server in order to
create a meeting. To set up your local environment to support this flow, follow the steps below.

- Set up your jitsi domain env variable to point to the jitsi
  server (`JITSI_DOMAIN=https://octopus-jitsi.doganbros.com`).
- Set up a local tunnel to your localhost so that the server can make the request to you. Use the
  command `npx localtunnel --port 8000 --subdomain yourpreferredsubdomain` where `yourpreferredsubdomain` would be a
  unique address that will be used to identify you local server later.
- Add the environment variable `MEETING_HOST=yourpreferredsubdomain.loca.lt` to your `.env` file. This is the endpoint
  the jitsi server will be making requests to. Note that you shouldn't include (https://)
- Make sure you have the correct `JITSI_SECRET`, `PURPIE_API_KEY`, `PURPIE_API_SECRET` and `JWT_APP_ID` env variables
  set already. If you don't have these already, contact the purpie channel for that.
- Add the environment variable `REACT_APP_STREAMING_URL=https://octopus-jitsi.doganbros.com:1980/hls` so that streaming
  works correctly.
- You are all set! You can now create, record and stream a meeting using the https://octopus-jitsi.doganbros.com server.

## Development Streaming

To stream meetings using the https://octopus-jitsi.doganbros.com server, follow the instructions below:

- Create a meeting
- Click on the three dots, and on start live stream
- A window will appear, enter `rtmp://octopus-jitsi.doganbros.com/live/<meeting-slug>?uid=1` as a live stream key. (
  Replace `<meeting-slug>` with the real meeting slug).
- The stream should start in few minutes

## Available Scripts

In the project directory, you can run:

## Database commands

```bash
# run all migrations
yarn migration:run # Even though nestjs runs this automatically when it boots up.

# create new migration boilerplate
yarn migration:create
```

## Test

```bash
# unit tests
$ yarn server:test

# e2e tests
yarn server:test:e2e

# test coverage
$ yarn server:test:cov
```

### `yarn server:start:dev`

Runs the app server in the development mode.

Visit http://octopus.localhost:<SERVER_PORT>/swagger to get all the endpoints and documentation for the rest api

### `npm start`

Runs the app in the development mode.\
Open [http://octopus.localhost:<PORT>](http://octopus.localhost:<PORT>) to view it in the browser.

The page will reload if you make updates.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
