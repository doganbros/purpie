# Jadmin Client (Typescript React App)

A single page react app used to interact with JADMIN Server

# Features

- Typescript (Strict Mode)
- ESNext
- React
- Prettier
- Airbnb Coding Style Guide
- Hooks
- React Router
- Redux


# Requirements

- At least Node v12


# Getting Started

```bash

    git clone https://github.com/doganbros/jadmin-frontend # Clone Repository
    cd jadmin-frontend
    yarn install # install dependencies or npm install
    cp .env.example .env # copy example environment variables
    npm start # Runs the app in the development mode.
    # Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```

# Available Scripts

In the project directory, you can run:
### `npm start`

Runs the app in the development mode.
### `npm run build`

Builds the app for production to the `build` folder.
### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

# Architecture

This is a single page web application, that is it handles routing at the client-side without the need to refresh the entire page. All http requests are done using `Asynchronous Javascript and XML (AJAX)`. The data exchange format used between this app and the server is `JSON`.

## Programming Languages

### [HTML](https://en.wikipedia.org/wiki/HTML)

`HTML` is rarely used in this app. It is primarily used to setup the main index file that is responsible for loading the main javasript of the app. It loads the css and display the initial title of the app.


### [TypeScript](https://www.typescriptlang.org/)

This app uses no `Javascript` (Although it compiles to javascript). `Typescript` is the main programming language for building the user interface of this app.


## Frameworks

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

### [Axios](https://axios-http.com/)

`Axios` is a promise based HTTP client used in this app. All AJAX requests are handled with `axios`. Their interceptors really help to avoid redundancy in most part of the app.



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
8. If the user returning to the app is already authenticated react router will redirect the user to the tenant lists.


# Application Structure

```
├── README.md
├── SOFTWARE-SPEC.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
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
│   │   └── validators.ts
│   ├── hooks
│   │   └── useTitle.ts
│   ├── index.tsx
│   ├── layers
│   │   ├── meeting
│   │   └── tenant
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

- `src`

    This is where most of the work is done in this app.

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
            

    

    
