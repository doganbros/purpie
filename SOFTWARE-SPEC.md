# Octopus (Typescript React App - NestJS REST API with postgres using Node.js, Express and TypeORM)

# Frontend Features

- [Typescript](https://www.typescriptlang.org/) (Strict Mode)
- ESNext
- [Airbnb Coding Style Guide](https://github.com/airbnb/javascript)
- [Prettier](https://prettier.io/)
- [eslint](http://eslint.org)
- [yarn](https://yarnpkg.com) is used for package management
- [React](https://reactjs.org/) is the main framework (with hooks)
- [React Router](https://reactrouter.com/) is used for client side routing
- [Redux](https://redux.js.org/) is used for managing application state
- [Grommet](https://v2.grommet.io/) is the main css framework

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
- [helmet](https://github.com/helmetjs/helmet)  is used to set http headers correctly.
- [dotenv](https://github.com/rolodato/dotenv-safe) is used to load .env variables
- [compression](https://github.com/expressjs/compression)
- [eslint](http://eslint.org)
- [morgan](https://github.com/expressjs/morgan)
- [Swagger](https://swagger.io/)
- Monitoring with [pm2](https://github.com/Unitech/pm2)

## Open Source Technologies used
- [Jitsi](https://jitsi.org)
- [Mattermost](https://mattermost.com)

# Requirements

- [Node.js](https://nodejs.org/en/download/) (>= 10.13.0, except for v13)
- [Yarn](https://yarnpkg.com/en/docs/install)


# Glossary
- 🏠  represents client side
- 🖥️  represents server side
# Architecture

This is a single page web application, that is it handles routing at the client-side without the need to refresh the entire page. All http requests are done using `Asynchronous Javascript and XML (AJAX)`. The data exchange format used between this app and the server is `JSON`.

## Programming Languages

### [HTML](https://en.wikipedia.org/wiki/HTML) 🏠

`HTML` is rarely used in this app. It is primarily used to setup the main index file that is responsible for loading the main javasript of the app. It loads the css and display the initial title of the app.


### [TypeScript](https://www.typescriptlang.org/) 🏠🖥️ 

This app uses no `Javascript` (Although it compiles to javascript). `Typescript` is the main programming language used on the server and for building the user interface.


## Frameworks and Libraries

### [NestJS](https://nestjs.com/) 🖥️ 

Nestjs is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. It works well with typescript and follows the [SOLID](https://en.wikipedia.org/wiki/SOLID) principle

### [TypeORM](https://typeorm.io/) 🖥️ 

TypeORM is a NodeJS database ORM that supports the latest JavaScript features and provide additional features that helps in developing any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases. It works well with typescript.

### [OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction) 🖥️ 

The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs. Nest 
provides a dedicated module which allows generating such a specification by leveraging decorators.

### [Handlebars](https://handlebarsjs.com/) 🖥️ 

Handlebars is used to render email templates before they are sent to clients.

### [SendGrid](https://sendgrid.com/) 🖥️ 

SendGrid is the main service used for sending emails.

### [Class Validator](https://github.com/typestack/class-validator) 🖥️ 

Allows use of decorator and non-decorator based validation. Internally uses validator.js to perform validation.
### [Axios](https://axios-http.com/) 🏠🖥️ 

`Axios` is a promise based HTTP client used in this app. All AJAX requests are handled with `axios`. Their interceptors really help to avoid redundancy in most part of the app.
### [SCSS](https://sass-lang.com/) 🏠

This app uses no `CSS` (Although it compiles to css in the long run). `SCSS` is rearely used in this app. It is used to style a large portion of the app. `SCSS Modules` is recommended if `SCSS` is used. `node-sass` is the library responsible for compiling the app's `scss` to `css`

### [React 17](https://reactjs.org/) 🏠

This app uses the latest version of `React` Framework (Library) in collaboration with `Typescript`. `JavaScript XML` is used to develop all the components. **Only Functional Components** are allowed for writing all React Components.

### [Grommet](https://v2.grommet.io/) 🏠

Grommet is a `React styled-component` library that helps in building responsive and accessible mobile-first projects for the web. Since this framework provides lots of styled-components, writing `scss` is often not required at all. Developers are required to use most of the features of Grommet without writing lots of `scss`  .

### [React Router DOM](https://reactrouter.com/web/guides/quick-start) 🏠

`React Router` (Its DOM binding `React Router DOM`) is the library used to for handling all the client side routing of this app. **Note** that instead of using the library's main `Link` and `NavLink` components, AnchorLink and NavLink are used respectively. This is to make it compatible with the Grommet library. To navigate to other paths of the app inside a component, the `useHistory` hook is used. Routing done in other parts of the app app (especially in a Redux action) uses the `appHistory` helper function insead.


### [Redux](https://redux.js.org/) 🏠

`Redux` is a predictable state Container for Javascript (Typescript) Apps. This is the main state management library used in the app. Mostly states that are shared across multiple components of the app use redux. Also all network-related states are handled here. `react-redux` is the library that helps in binding redux to react. `redux-thunk` provides the redux middleware that helps the app to deal with asynchronous dispatches in redux actions.

## Development Dependencies 

### [Eslint](https://eslint.org/) 🏠🖥️ 

`Eslint` statically analyzes the application code to quickly find problems. It helps in maintaining the usage of Airbnb coding style guide and the similarity of code written by different develops at a time. Run `yarn analyze` or `npm analyze` to let eslint analyze and report all errors made.  If you are using editors like vscode please install the eslint extension to help you in automatically detecting errors.

### [Prettier](https://prettier.io/) 🏠🖥️ 

`Prettier` is an opinionated code formatter that helps the app to format the code written to comform to the rules of eslint. Run `yarn format` or `npm format` to do a quick format of the entire app.

### [Jest](https://jestjs.io/) 🏠🖥️ 

Jest is a delightful JavaScript Testing Framework with a focus on simplicity.


## NestJS 🖥️ 
While using nestjs at the server-side, One must follow these guidelines.

- NestJS pattern must be followed strictly. For example controllers should be used to handle only http requests, services must be used to generate data or communicate with the database, guards must be used for securing routes etc.

- If there are a lot of routes in a controller, it could be splitted.
- Implement global providers if they are needed only. This will help other developers know from which modules those services are imported from. Example authentication and exceptions would be needed in the entire application but zone service wouldn't.
- the `@IsAuthenticated()` decorator should be used to validate the current user's token. Also permissions could be passed in as paremeters if they are needed.
- Document the controllers written extensively (using decorators provided by Nestjs for OpenAPI). This helps other developers to make requests very easily without reading the source code.
- The built in NestJS exceptions must be used accross the entire application. The first paramter must be a message about the error. And the second parameter must be an error code. For example while generating an error for invalid bearer authentication token, the example below is used.
```ts
    throw new UnauthorizedException(
          'You not authorized to use this route',
          'NOT_SIGNED_IN',
    );
```


## TypeORM 🖥️ 
While using TypeORM at the server-side, One must follow these guidelines.

- The models designed must be relational. That means you must use `OneToOne`, `ManyToOne`, `OneToMany` or `ManyToMany` relation when it is necessary.
- When models, fields, column, etc. are added a migration script must be written in respect of that. This is because we are not using syncronization as it not good for production.  **Note** that nestjs will run pending migrations when the application is booted automatically.



### Guards In This Application and their usage
This section introduces the main guards used in this application

- #### AuthGuard
    The AuthGuard validates the current bearer token passed to the server when making requests.
    It sets the payload of the user to `req.user`. It also thows an `UnauthorizedException` exception when the token is invalid.

- #### UserZoneGuard
    The UserZoneGuard validates the current user's authorization to the zone that he/she is requesting.
    It sets the user zone to `req.userZone`. Other permissions can be passed in using the `SetMetadata` decorator. It also throws an `NotFoundException` exception when the user is not authorized.

### Pipes in this application and their usage
This section introduces the main pipes used in this application

- #### ParseTokenPipe
    The ParseTokenPipe is used to parse a JWT. If it succeeds it passes the payload to the parameter. Otherwise it will throw an `UnauthorizedException`.

### Decorators in this application and their usage
This section introduces the main decorators used in this application

- #### IsAuthenticated
    The IsAuthenticated decorator wraps over the AuthGuard to avoid writing lots of boilerplates while passing permissions to the AuthGuard.

- #### UserZoneRole
    The UserZoneRole decorator wraps over the UserZoneGuard to avoid writing lots of boilerplates while passing permissions to the it. It also extends the IsAuthenticated decorators so if you do not need to specify it while using it on a route.

- #### UserChannelRole
    The UserZoneRole decorator wraps over the UserChannelGuard to avoid writing lots of boilerplates while passing permissions to the it. It also extends the IsAuthenticated decorators so if you do not need to specify it while using it on a route.

- #### CurrentUser

    The CurrentUser decorator is helper to retrieve the current user's jwt payload

- #### CurrentUserZone

    The CurrentUserZone decorator is helper to retrieve the current user zone. Notice that it zoneId or userZoneId must be set as params in order to retrieve this.

- #### CurrentUserChannel

    The CurrentUserChannel decorator is helper to retrieve the current user channel. Notice that it channelId or userChannelId must be set as params in order to retrieve this.

### Middlewares Used in this application
This section introduces the main middlewares used in this application.

- #### PaginationMiddleware
    The PaginationMiddleware parses all get requests' pagination query paramters.
    All get requests pass through this middleware. This means that, the pagination query parameters `req.query.limit` and `req.query.skip` are passed to controllers automatically (Global middleware for get requests). It can in turn be used in paginating records. When no values for limit and skip query parameters are passed by the user, limit is set to a default of 30 and skip is also set to a default of 0. Limit cannot be greater that 100. The type `PaginationQuery` can help in intellisense.



## Authentication

This app interacts with a stateless http server. Authentication is realized by sending a [JSON Web Token](https://jwt.io/) (By the way this is one of my favorite technologies) to the server. The steps for authenticating users are listed below.


1. When it is the first time the user is visiting the app or the returning user is not authenticated, React Router will redirect the user to the login page. 
2. The User will either login or create a new account
3. The app sends the authentication information to the server
4. If the server successfully authenticates the user, a json web access token and its refresh token is created on the server and sent as an http only cookie to the client
5. By default the access token only lasts an hour. After this if the refresh token is still valid, the server will generate a new access and refresh tokens to the client
6. In subsequent requests, the app will send the access token stored in the cookies to the server to identify the user making the request.
7. If the token expires or becomes invalid the user will automatically be redirected to the login page. Thanks to the `axios` response interceptor.
8. If the user returning to the app is already authenticated react router will redirect the user to the main application page.


### Authentication persistence through subdomains

Since this app allows users to create subdomains, it needs to persist authentication through the main domain and subdomains. This is one of the main reasons why cookies are been used. For cookies to persist authentication through domains and subdomains, the main domain parameter supplied while creating them must be valid. One of the rules for its validity is that it must have at least one dot. Due to this, localhost will not work. Read this [article](https://medium.com/@emilycoco/working-with-subdomains-locally-and-sharing-cookies-across-them-12b108cf5e43) to learn more.
Even though developers can still use localhost but if another subdomain is visited, authentication would be required again. Developers can therefore set a different domain other than localhost in `/etc/host` ( or ` C:\Windows\System32\Drivers\etc\hosts` for windows) file. The domain recommended is octopus.localhost. This is because it allows all subdomains to see the cookie as well.


## Mattermost

[Mattermost](https://mattermost.com) is an open source platform used for real-time communication in this application. It is used to provide feedbacks to front-end clients about events. This app also takes advantage of mattermost's channels for real-time chats between two or more people.

### Mattermost Setup and Configuration

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
10. You will be asked to create a new team. Create a new team called `app`.
11. *You will be signed in to the dashboard of mattermost.*
12. Press the hamburger menu just beside the team name. Then click System Console. 
13. Search for `Integration Management`. 
14. Under Integration Management, scroll to the bottom and set Enable Personal Access Tokens to true.
15. Search for `Bot Accounts`.
16. Under Bot Accounts, set Enable Bot Account Creation to true.
17. Now click the hamburger menu and again and click switch back to app
18. Press the hamburger menu just beside the team name. Then click Integrations
19. Click Bot Accounts and the Add Bot Account at the top right of the screen.
20. Create a bot with the username `octopus-app`. Type in any display name of your choice (Optional). Type in a description (Optional) and select `System Admin` as the role. Then Click Create Bot Account.
21. You will get a setup successful prompt when everything went well. You will also be provided with a token. Please save this token at a secure place because this will be the token octopus will be using to login as the bot.
22. Make sure you update all your environment variables for octopus. 
23. You can find examples at the .env.example file. `REACT_APP_MM_SERVER_URL, MM_SERVER_URL, MM_BOT_TOKEN`. The `MM_BOT_TOKEN` is the token you received while creating a bot account.
24. If you already had a valid session at octopus please logout and login again.



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
│   ├── README.md
│   ├── dist
│   ├── entities
│   │   ├── Channel.entity.ts
│   │   ├── Invitation.entity.ts
│   │   ├── Post.entity.ts
│   │   ├── User.entity.ts
│   │   ├── UserChannel.entity.ts
│   │   ├── UserChannelPermission.entity.ts
│   │   ├── UserZone.entity.ts
│   │   ├── UserZonePermission.entity.ts
│   │   ├── Zone.entity.ts
│   │   ├── base
│   │   ├── data
│   │   └── repositories
│   ├── helpers
│   │   ├── jwt.ts
│   │   └── utils.ts
│   ├── migrations
│   │   └── 1625561314952-InitialMigration.ts
│   ├── ormconfig.ts
│   ├── src
│   │   ├── app.module.ts
│   │   ├── auth
│   │   ├── mail
│   │   ├── main.ts
│   │   ├── typeorm-exception.filter.ts
│   │   ├── utils
│   │   ├── views
│   │   └── zone
│   ├── test
│   │   ├── app.e2e-spec.d.ts
│   │   ├── app.e2e-spec.js
│   │   ├── app.e2e-spec.js.map
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   ├── tsconfig.tsbuildinfo
│   └── types
│       ├── Post.ts
│       ├── PaginationQuery.ts
│       ├── UserPayloadRequest.ts
│       └── UserZoneRequest.ts
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── background.png
│   │   └── logo.png
│   ├── components
│   │   ├── layouts
│   │   ├── mattermost
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

    - `dist`

        Typescript compiles to this directory.

    - `entities`

        This is directory hosts all the typeorm model definitions. All typeorm entities must end with `.entity.ts`

        - `base`

            This directory hosts the typeorm models that will be inherited by other models. For example the `RecordEntity` defines most of the repeating fields in records such as `id`, `createdOn`, `updatedOn` etc.
        - `data`

            This directory hosts the default data used by some entities.
        - `repositories`

            This directory all the typeorm repositories used in the application. A custom repository can be defined only if some static methods are needed. For example the `UserZone` repository inherits from the `RecordRepository` which provides the static paginate method used for the pagination of the application.
    
    - `helpers`

        This directory hosts all the utilities functions of the application.

    - `migrations`

        This directory hosts all the migration scripts used by typeorm. To create a new migration please use the script `yarn migration:create`. NestJS automatically runs all pending migrations when it is booted. While creating migrations, typeorm driver must be prefered to raw sql. This helps in migrating to other databases in the future.

    - `types`

        This directory hosts all the utility typescript types used in the application.

    - `test`

         This is the directory that hosts all end-to-end testing scripts.

    - `src`

         This is the directory where most of the work is done. It hosts all the NestJS controllers, modules, services, pipes, guards, middlewares etc. Note that, scripts other than NestJS specific shouldn't be put here.


         - `app.module.ts`

            The root module of the application. All other modules are imported into this file.

         - `main.ts`

            The entry file of the application which uses the core function NestFactory to create a Nest application instance.

        - `mail`

            This directory hosts the module used for sending mails in this application. To send a mail, a view is created inside the views directory. The `MailModule` is imported into the current module and the `MailService` is injected into the current service. Using the `sendMailByView` method of the mail service emails can be sent using sendgrid.

        - `[module_name]`

            The src directory hosts all the nestjs modules in this application. To create a new module, a new directory with the same name is created. It is recommended that the nest cli is used to generate modules, controllers, services etc. The nest cli command `nest g module [module_name]` generates a new module. This creates a new directory inside the src folder and a new module named `[module_name].module.ts`. All directories created inside this must not be empty.

            - `decorators`

              All decorators for this module is created in this directory.

            - `dto`

              All dtos for this module is created in this directory. A DTO is an object that defines how the data will be sent over the network. This is especially useful in `POST` and `PUT` requests. The class validator decorators can also help in validating payload fields. All dtos must end with `.dto.ts`.

            - `pipes`

              All pipes for this module is created in this directory. Pipes are used to transform input data coming from `req.body`, `req.query` or `req.params` etc. All pipes must end with `.pipe.ts`

            - `guards`

              All guards for this module is created in this directory. Guards determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. All guards must end with `.guard.ts`

            - `interfaces`

              All interfaces for this module is created in this directory. **Note**: All interface must be declared using `class` but not the `interface` keyword. This is because Typescript removes all interfaces when it is compiling to Javascript. All interfaces must end with `.interface.ts`

            - `exceptions`

              All exceptions for this module is created in this directory. Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an application. When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate user-friendly response. All exceptions must end with `.exception.ts`

            - `controllers`

             If multiple controllers are used in this module, it is recommended to put them in the controllers directory. Otherwise there is no need to create this directory for them. All controllers must end with `.controller.ts`
            - `controllers`

             If multiple services are used in this module, it is recommended to put them in the services directory. Otherwise there is no need to create this directory for them. All services must end with `.service.ts`

             `[module_name].module.ts`

             This is the file that all providers, controllers etc of this module are imported into. This is then imported into the `app.module.ts`

    - `ormconfig.ts`

        This is the file that contains all the configuration of the application's database. It is used by typeorm to create migrations and connect to the database.

     - `tsconfig.json`

        This is the file that contains the typescript configuration for the server. The configuration used in this app is in strict mode.


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

    
