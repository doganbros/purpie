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

## Create Postgres database
Please follow the steps below to get a development Postgres server running. The easiest way to use [docker](https://www.docker.com/). If you have running Postgres database server you can skip these steps and simply create an Octopus database.

1. Make sure you have docker installed on your computer. If you do not have docker already on your computer, Go to https://www.docker.com/get-started, choose your platform and click download. Follow the simple steps to get docker installed on your computer.
2. Open your terminal (command prompt or preferably powershell on windows).
3. Enter the command `docker run --name octopus-dev -e POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD -p 5432:5432 -d postgres` Postgres docker image will be downloaded and Postgres Docker container with the name `octopus-dev` will up and serve from port 5432 after this command.
4. Run `docker ps` to get ID of the running Postgres Docker container.
5. Run `docker exec -it DOCKER_ID psql -U postgres` to connect your Postgres database.
6. Run 'CREATE DATABASE octopus' to create your Octopus database.
7. Run `\q` to quit from Psql and Docker container.


## Setup your Mattermost server:

Please follow the steps below to get a development mattermost server running. The easiest way to use [docker](https://www.docker.com/).

1. Make sure you have docker installed on your computer. If you do not have docker already on your computer, Go to https://www.docker.com/get-started, choose your platform and click download. Follow the simple steps to get docker installed on your computer.
2. Open your terminal (command prompt or preferably powershell on windows).
3. Enter the command `docker run --name mattermost-preview -d --publish 8065:8065 --add-host dockerhost:127.0.0.1 mattermost/mattermost-preview`
4. If you want to change the port where mattermost runs by default, replace `<port>:8065` by your prefered port while typing the command.
5. Wait for some few minutes for the mattermost server to bootup.
6. To view the logs enter the command `docker logs mattermost-preview --follow`
7. You can run multiple instances by just changing the port of your host like above.
8. Launch mattermost on your browser by visiting `http://localhost:8065` or the port that you used above.
9. Type in the system administrator's email, username and password. **Note** that you are supposed to use a username and email different from your account in octopus. This is because octopus will try to create an account for you when you setup everything up.
10. You will be asked to create a new team. Create a new team called `octopus`.
11. *You will be signed in to the dashboard of mattermost.*
12. Press the 9 squares menu icon (similiar to grid view icon) on the top left corner. Then click System Console. 
13. Search for `Integration Management`. 
14. Under Integration Management, scroll to the bottom and set Enable Personal Access Tokens to true.
15. Search for `Bot Accounts`.
16. Under Bot Accounts, set Enable Bot Account Creation to true.
17. Now click the hamburger menu on the top left and click `Switch to octopus`
18. Press the 9 squares menu icon on the top left corner again and then click `Integrations`
19. Click Bot Accounts and the Add Bot Account at the top right of the screen.
20. Create a bot with the username `octopus-bot`. Type in any display name of your choice (Optional). Type in a description (Optional) and select `System Admin` as the role. Then Click Create Bot Account.
21. You will get a setup successful prompt when everything went well. You will also be provided with a token. Please save this token at a secure place because this will be the token octopus will be using to login as the bot.
22. Make sure you update all your environment variables for octopus. 
23. You can find examples at the .env.example file. `REACT_APP_MM_SERVER_URL, MM_SERVER_URL, MM_BOT_TOKEN`. The `MM_BOT_TOKEN` is the token you received while creating a bot account.
24. If you already had a valid session at octopus please logout and login again.




## Set environment variables into .env file:

```bash
cp .env.example .env # Then make changes to the boilerplate provided
```

## Running project

```bash
yarn server:start:dev # Runs backend side in dev mode
yarn start:web # Runs frontend side
```

## Setting web server and routing

If Octopus is installed on your local you will need to add following line to your hosts file. On Unix based systems including MacOS hosts file is /etc/hosts where as on Windows it is C:\windows\system32\drivers\etc\hosts .

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
