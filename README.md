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

Install dependencies:

```bash
yarn install
```

Create Database if it doesn't exist

```bash
#eg with postgresql
createdb octopus # use these credentials in your .env variable
```

Set environment variables into .env file:

```bash
cp .env.example .env # Then make changes to the boilerplate provided
```

## Running project

```bash
yarn server:start:dev # Runs backend side in dev mode
yarn start:web # Runs frontend side
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

## Logs

```bash
# show logs in production
pm2 logs
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

### `npm start:web`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
