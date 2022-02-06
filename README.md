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
cp .env.example .env # Then make changes to the boilerplate provided
```

## Create Postgres database
Please follow the steps below to get a development Postgres server running. The easiest way to use [docker](https://www.docker.com/). If you have running Postgres database server you can skip these steps and simply create an Octopus database.

1. Make sure you have docker installed on your computer. If you do not have docker already on your computer, Go to https://www.docker.com/get-started, choose your platform and click download. Follow the simple steps to get docker installed on your computer.
2. Open your terminal (command prompt or preferably powershell on windows).
3. Enter the command `docker run --name octopus-postgres-dev -e POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD -p 5432:5432 -d postgres` Postgres docker image will be downloaded and Postgres Docker container with the name `octopus-postgres-dev` will up and serve from port 5432 after this command.
4. Run `docker ps` to get ID of the running Postgres Docker container.
5. Run `docker exec -it DOCKER_ID psql -U postgres` to connect your Postgres database.
6. Run 'CREATE DATABASE octopus' to create your Octopus database.
7. Run `\q` to quit from Psql and Docker container.


## Setup your Mattermost server:

Please follow the steps below to get a development mattermost server running. The easiest way to use [docker](https://www.docker.com/).

1. Make sure you have docker installed on your computer. If you do not have docker already on your computer, Go to https://www.docker.com/get-started, choose your platform and click download. Follow the simple steps to get docker installed on your computer.
2. Open your terminal (command prompt or preferably powershell on windows).
3. Enter the command `docker run --name octopus-mattermost-preview -d --publish 8065:8065 --add-host dockerhost:127.0.0.1 doganbros/octopus:mattermost-preview`
4. If you want to change the port where mattermost runs by default, replace `<port>:8065` by your prefered port while typing the command.   
5. Wait for some few minutes for the mattermost server to bootup.
6. To view the logs enter the command `docker logs octopus-mattermost-preview --follow`
7. Doganbros MM image is pre-configured and should work with default .env configuration. Later you may update MM environment variables in .env file according to your MM configuration. The variables `REACT_APP_MM_SERVER_URL, MM_SERVER_URL` is used to point to the MM server just installed. The variables `MM_SYS_ADMIN_USERNAME`, `MM_SYS_ADMIN_EMAIL`, `MM_SYS_ADMIN_PASSWORD` and `MM_BOT_USERNAME` are used by octopus to set up the system adminstrator of MM. The last but not least variable, `REACT_APP_MM_TEAM_NAME` sets up the team name that will be used by octopus in MM. Examples can be found in the `.env.example` file.

## Running project

```bash
yarn server:start:dev # Runs backend side in dev mode where "yarn server:start" runs backend in production
yarn start # Runs frontend side
```

## Setting web server and routing

If Octopus is installed on your local computer, you will need to add the following line to your hosts file. The hosts file for Unix based system including MacOs is `/etc/hosts` where as on Windows, it is  `C:\windows\system32\drivers\etc\hosts` .

```bash
127.0.0.1	octopus.localhost
```

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

### `npm start`

Runs the app in the development mode.\
Open [http://octopus.localhost:<PORT>](http://octopus.localhost:<PORT>) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!