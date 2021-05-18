# Jadmin (Express REST API with postgres using Node.js, Express and Sequelize)

A rest api app used to interact with Octopus frontend and databases.

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

# Requirements

- [Node v8.10](https://nodejs.org/en/download/current/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [PM2](http://pm2.keymetrics.io/)

## Programming Languages

### [Javascript](https://www.javascript.com/)

This project main language is javascript which is most used for rest apis.

## Frameworks 

### Express.js(https://expressjs.com/)

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web.Express provides to avoid deal with redundant dependencies.
### [Axios](https://axios-http.com/)

`Axios` is a promise based HTTP client used in this app. All AJAX requests are handled with `axios`. Their interceptors really help to avoid redundancy in most part of the app.



## Development Dependencies 

### [Eslint](https://eslint.org/)

`Eslint` statically analyzes the application code to quickly find problems. It helps in maintaining the usage of Airbnb coding style guide and the similarity of code written by different develops at a time. 

## Code Structure

```
├── README.md
├── SOFTWARE-SPEC.md
├── package-lock.json
├── package.json
├── scripts
│   ├── after_install.sh
│   ├── before_install.sh
│   └── start.sh
├── server
│   ├── api
│   |   ├── controllers
│   |   ├── middlewares
│   |   ├── models
│   |   ├── repositories
│   |   ├── routes
│   |   ├── services
│   |   ├── tests
│   |   ├── utils
│   |   └── validations
│   ├── config
│   │   ├── express.js
│   │   ├── permissions.js
│   │   └── vars.js
│   ├── database
|   |   ├── migrations
|   |   │   ├── add-apikey-tenant.js
|   |   │   └── add-token-user.js
|   |   ├── seeders
|   |   │   └── seed.js
│   │   ├── config.js
│   │   └── db-build.js
│   ├── views/emails
|   |   ├── partials
|   |   │   ├── footer.hbs
|   |   │   └── header.hbs
│   │   ├── reset-password.hbs
│   │   └── welcome.hbs
│   └── index.jx
└── prettier.config.js
```

### README.md

    This is the main readme file of the application 

### SOFTWARE-SPEC.md

    This is the current document you are viewing

### Package.json

    Lists all the dependencies, author, version, etc of the app.

### Package-lock.json

    This is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.



### Scripts Folder

Server run and build commands are included in this file    

### Api Folder

Fundamental api operations are in api folder.

- Controllers: Logic of our operations are run in this folder files. For example, on login operation we check the DB to prevent duplicate users. Then add to DB. All other logic are run in the controller. Also controller seperate to main parts like auth,tenant, meeting, etc...

- Middlewares: functions that will be used before or after reaching controllers functions errorHandler and authenticate. 

- Models: Database model,tables and attirbutes are included this this file.

- Repositories: It is like a HOC.DB functions are generic and just sending parameters for function prevents code repeating for any needed operations with DB.

- Routes: Specifying endpoints and which function they will connect with specified validations. 

- Services: There are helper functions emailer, token decoding and generating.

- Tests: Unit test for functions

- Utils: Utils functions are in there.

- Validations: Before any routing to controller functions, these validation functions are run and check provided parameters, query and body values.

### Config Folder

This file contains configurations for environments like development, test and production. There is project extensions like cors,error handler,helmet etc...

### Database Folder

This file contains the DB connection functions. For development purpose db migrations and seeds are included in this file. When running migration and seed configs are run.


### Views

All templates for user interaction are included in this file like forget-password.
