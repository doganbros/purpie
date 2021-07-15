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
- CORS enabled

## Backend Features

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

- [Node >= v14.14](https://nodejs.org/en/download/current/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [Pm2](https://pm2.io/)
- [Sequelize](http://sequelize.org/)
- [Postgress](https://www.postgresql.org/)


## Getting Started

```bash

    git clone https://github.com/doganbros/octopus # Clone Repository
    cd octopus
    # Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```

Install dependencies:

```bash
yarn install
```

Set environment variables into .env file:

```bash
cp .env.example .env
```

Create database

```bash
yarn sequelize db:create --env development
```


## TODO: Remove migrates

```bash
yarn clean:migrate
```

## Running project

```bash
    yarn start:server # Runs backend side
    yarn start:web # Runs frontend side
```

## Insert neccessery data into Database tables

```bash
yarn migrate
yarn seeds
```

## Available Scripts

In the project directory, you can run:

## Database commands

```bash
# run all migrations
yarn migrate

# run all seeds
yarn seeds

# generate new migration
yarn sequelize migration:generate --name new-migration

# generate new seed
yarn sequelize seed:generate --name new-seeds
```

## Logs

```bash
# show logs in production
pm2 logs
```
### `yarn start:server`

Runs the app server in the development mode.

### `npm start:web`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
