# Jadmin (Express REST API with postgres using Node.js, Express and Sequelize)


## Features

- No transpilers, just vanilla javascript
- ES2017 latest features like Async/Await
- CORS enabled
- Uses [yarn](https://yarnpkg.com) 
- Express + Postgres ([Sequelize](http://docs.sequelizejs.com/))
- Request validation ([express validator](https://github.com/ctavan/express-validator)
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Logging with [morgan](https://github.com/expressjs/morgan)
- API documentation generation with [postman](http://postman.com)
- Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

- [Node v14.14](https://nodejs.org/en/download/current/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [Pm2] 

## Getting Started

Clone the repo:

```bash
git clone --depth 1 https://github.com/doganbros/jadmin-backend
cd jadmin-backend
```

Install dependencies:

```bash
yarn install
```

Set environment variables into .env file:

```bash
cp .env.example .env
```

Crete database

```bash
sequelize db:create --env development
```

## Insert neccessery data into Database tables

```bash
yarn migrate
yarn seeds
```

## Running project

```bash
yarn start
```

## Database commands

```bash
# run all migrations
yarn migrate

# run all seeds
yarn seeds

# generate new migration
sequelize migration:generate --name new-migration

# generate new seed
sequelize seed:generate --name new-seeds
```

## Logs

```bash
# show logs in production
pm2 logs
```
