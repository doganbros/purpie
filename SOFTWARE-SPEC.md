# Octopus (Typescript React App - Express REST API with postgres using Node.js, Express and Sequelize)

# Frontend Features

- Typescript (Strict Mode)
- ESNext
- React
- Prettier
- Airbnb Coding Style Guide
- Hooks
- React Router
- Redux

## Backend Features

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

# Architecture

This is a single page web application, that is it handles routing at the client-side without the need to refresh the entire page. All http requests are done using `Asynchronous Javascript and XML (AJAX)`. The data exchange format used between this app and the server is `JSON`.

## Programming Languages

### [HTML](https://en.wikipedia.org/wiki/HTML)

`HTML` is rarely used in this app. It is primarily used to setup the main index file that is responsible for loading the main javasript of the app. It loads the css and display the initial title of the app.


### [TypeScript](https://www.typescriptlang.org/)

This app uses no `Javascript` (Although it compiles to javascript). `Typescript` is the main programming language for building the user interface of this app.


## Frameworks

### Express.js(https://expressjs.com/)

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web.Express provides to avoid deal with redundant dependencies.
### [Axios](https://axios-http.com/)

`Axios` is a promise based HTTP client used in this app. All AJAX requests are handled with `axios`. Their interceptors really help to avoid redundancy in most part of the app.
### [SCSS](https://sass-lang.com/)

This app uses no `CSS` (Although it compiles to css in the long run). `SCSS` is rearely used in this app. It is used to style a large portion of the app. `SCSS Modules` is recommended if `SCSS` is used. `node-sass` is the library responsible for compiling the app's `scss` to `css`

### [React 17](https://reactjs.org/)

This app uses the latest version of `React` Framework (Library) in collaboration with `Typescript`. `JavaScript XML` is used to develop all the components. **Only Functional Components** are allowed for writing all React Components.

### [Grommet](https://v2.grommet.io/)

Grommet is a `React styled-component` library that helps in building responsive and accessible mobile-first projects for the web. Since this framework provides lots of styled-components, writing `scss` is often not required at all. Developers are required to use most of the features of Grommet without writing lots of `scss`  .

### [React Router DOM](https://reactrouter.com/web/guides/quick-start)

`React Router` (Its DOM binding `React Router DOM`) is the library used to for handling all the client side routing of this app. **Note** that instead of using the library's main `Link` and `NavLink` components, AnchorLink and NavLink are used respectively. This is to make it compatible with the Grommet library. To navigate to other paths of the app inside a component, the `useHistory` hook is used. Routing done in other parts of the app app (especially in a Redux action) uses the `appHistory` helper function insead.


### [Redux](https://redux.js.org/)

`Redux` is a predictable state Container for Javascript (Typescript) Apps. This is the main state management library used in the app. Mostly states that are shared across multiple components of the app use redux. Also all network-related states are handled here. `react-redux` is the library that helps in binding redux to react. `redux-thunk` provides the redux middleware that helps the app to deal with asynchronous dispatches in redux actions.

## Development Dependencies 

### [Eslint](https://eslint.org/)

`Eslint` statically analyzes the application code to quickly find problems. It helps in maintaining the usage of Airbnb coding style guide and the similarity of code written by different develops at a time. Run `yarn analyze` or `npm analyze` to let eslint analyze and report all errors made.  If you are using editors like vscode please install the eslint extension to help you in automatically detecting errors.

### [Prettier](https://prettier.io/)

`Prettier` is an opinionated code formatter that helps the app to format the code written to comform to the rules of eslint. Run `yarn format` or `npm format` to do a quick format of the entire app.


## Authentication

This app interacts with a stateless http server. Authentication is realized by sending a [JSON Web Token](https://jwt.io/) (By the way this is one of my favorite technologies) to the server. The steps for authenticating users are listed below.


1. When it is the first time the user is visiting the app or the returning user is not authenticated, React Router will redirect the user to the login page. 
2. The User will either login or create a new account
3. The app sends the authentication information to the server
4. If the server successfully authenticates the user, a json web access token is created on the server and sent to the app
5. The app stores the json web token in the browser's local storage.
6. In subsequent requests, the app will send the access token stored in local storage to the server to identify the user making the request. Thanks to the `axios` request interceptor.
7. If the token expires or becomes invalid the user will automatically be redirected to the login page. Thanks to the `axios` response interceptor.
8. If the user returning to the app is already authenticated react router will redirect the user to the zone lists.


# Application Structure

```
├── README.md
├── SOFTWARE-SPEC.md
├── appspec.yml
├── package-lock.json
├── package.json
├── scripts
│   ├── after_install.sh
│   ├── before_install.sh
│   └── start.sh
├── server
│   ├── api
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── tests
│   │   ├── utils
│   │   └── validations
│   ├── config
│   ├── database
│   │   ├── config.js
│   │   ├── db-build.js
│   │   ├── migrations
│   │   └── seeders
│   │       └── seed.js
│   ├── index.js
│   └── views
│       └── emails
│           ├── partials
│           │   ├── footer.hbs
│           │   └── header.hbs
│           ├── reset-password.hbs
│           └── welcome.hbs
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── background.png
│   │   └── logo.png
│   ├── components
│   │   ├── layouts
│   │   └── utils
│   ├── config
│   │   ├── app-config.ts
│   │   └── http.ts
│   ├── helpers
│   │   ├── history.ts
│   │   ├── utils.ts
│   │   └── validators.ts
│   ├── hooks
│   │   └── useTitle.ts
│   ├── index.tsx
│   ├── layers
│   │   ├── meeting
│   │   └── zone
│   ├── models
│   │   ├── form-submit-event.ts
│   │   └── response-error.ts
│   ├── pages
│   │   ├── Private
│   │   └── Public
│   ├── react-app-env.d.ts
│   ├── routes.ts
│   ├── scss
│   │   └── index.scss
│   └── store
│       ├── actions
│       ├── constants
│       ├── reducers
│       ├── services
│       ├── store.ts
│       └── types
└── tsconfig.json
```


- `README.md`
  
  This is the main readme file of the application

- `SOFTWARE-SPEC.md`
  
  This is the current document you are viewing

- `package-lock.json`

    This is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.

- `package.json`

    Lists all the dependencies, author, version, etc of the app.

- `public`

    This is where the main index.html file that loads the react app lives.

- `server`

    This is where most backend work is done in this app.


    - `api`

        all api operations, functions, tests, .etc are included in api folder.

        - `Controllers` 
            Logic of our operations are run in this folder files. For example, on login operation we check the DB to prevent duplicate users. Then add to DB. All other logic are run in the controller. Also controller seperate to main parts like auth,zone, meeting, etc...

        - `Middlewares` 
            functions that will be used before or after reaching controllers functions errorHandler and authenticate. 

        - `models`
            Database model,tables and attirbutes are included this this file.

        - `repositories` 
            It is like a HOC.DB functions are generic and just sending parameters for function prevents code repeating for any needed operations with DB.

        - `routes` 
            Specifying endpoints and which function they will connect with specified validations. 

        - `services`
            There are helper functions emailer, token decoding and generating.

        - `tests`
            Unit testing for all apis functions

        - `utils` 
            Utils functions are in there.

        - `validations`
            Before any routing to controller functions, these validation functions are run and check provided parameters, query and body values.

    - `config`

        This folder contains configurations for environments like development, test and production. There is project extensions like cors,error handler,helmet etc...

    - `database`

        This file contains the DB connection functions. For development purpose db migrations and seeds are included in this file. When running migration and seed configs are run.

    - `views` 

        All templates for user interaction are included in this file like forget-password.


- `src`

    This is where most frontend work is done in this app.

    - `App.tsx`

        This is the main component that loads the app routes and run initial scripts (eg. retrieving current user)
    
    - `assets`

        This directory contains all the static assests used in the app

    - `components`

        This directory contains most of the helper components used in the app

    - `config`

        This directory contains all the configuration files of the app

    - `helpers`

        This directory contains all the utilities functions of the app

    - `hooks`

        This directory contains all the general react hooks used in the app

    - `index.tsx`

        This is the main script and starting point of the app responsible for bootstrapping the react app

    - `layers`

        This is the directory where layers (modals) used in the app are stored

    - `models`

        This is the directory where typescript types used accross the entire app are declared.

    - `pages`

        This is the directory where pages served in the browser are stored

        - `Private`

            All Privates Pages are stored in this directory.

        - `Public`

            All Public Pages are stored in this directory.

    - `react-app-env.d.ts`

        This is a generated file coming with create react app

    - `routes.ts`

        This is the file where all public and private routes are decalared. All public and private routes live in the publicRoutes and privateRoutes array respectively. Make sure you put the route in the correct context. All private routes require that users are authenticated, otherwise they will be redirected to the login page

    - `scss`

        The directory that hosts all the scss for the app

    - `store`

        This is the directory that is used to handle everything to do with the app's redux store.

        - `actions`

            All actions of the store are declared in this directory. Every action ends with `.action.ts`. This is to make all actions easier to search. Also all action functions end with `Action`.

        - `constants`

            All constants used in the store is declared in this directory. End all constants with `.constant.ts`.  This is to make all constants easier to search. 

        - `reducers`

            All reducers of the store are declared in this directory. Every reducer ends with `.reducer.ts`. This is to make all reducers easier to search. 

        - `services`

            All services of the store are declared in this directory. Every service ends with `.service.ts`. This is to make all services easier to search. The `http` helper function must be used to make http requests

        - `store.ts`

            This is the script that creates the main store of the app.


        - `types`

            All typescript types of the stored are declared in this directory. Every type file ends with `.types.ts`. This is to make all types easier to search.

        - `tsconfig.json`

            This is the file that contains the typescript configuration for the app. The configuration used in this app is strict
            

    - `scripts`
        
        Server run and build commands are included in this folder files for installing requirements and ci cd auto deployment.  

    - `appspec.js`

        file contains scripts files calls for ci cd auto deployment into aws instance

    
