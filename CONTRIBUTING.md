# How do you contribute to Pavilion

We would very much like your request to improve Pavilion so please read
and follow this contributions manual before you start working.

# Create and Report Issues

You should give us as much as possible details about the problems and how to reproduce these issues.
Also, give us more detail about version of the Pavilion you are using and development environment.

## Contributor License Agreement

The Pavilion projects are licensed under
the [Apache License 2.0](https://github.com/doganbros/purpie/blob/develop/LICENSE)
so you need to sign our Apache-based contributor license agreement as either a [corporation](https://jitsi.org/ccla) or
an [individual](https://jitsi.org/icla) to
continue making these projects available under an Open Source license. If you do not accept this agreement then sadly,
we cannot accept your contribution.

## Pull Request Strategy

- Make sure your code passes the linter rules that are executing
  automatically when creating pull request.
- Pavilion is a monorepo project so perform **only** frontend or backend change with **one** logical operation per pull
  request.
- Cleanly message your commits, squash them if necessary.
- Rebase your working branch on top of the develop branch before starting the coding.

## Coding style

### Comments

* Comments documenting the source code are required.
* Comments should be formatted as proper English sentences.

### Duplication

* Copy-paste source code is not allowed, you can reuse it.

### Formatting

* There are some prettier packages with eslint in the codebase, so you need to adjust your editor with Pavilion
  settings.

### Naming

* Util function names camelCase, file names kebab-case and react file and component names PascalCase format in the
  Pavilion.

* The names of global constants (including ES6 module-global constants) should
  be written in uppercase with underscores to separate words. For example,
  `BACKGROUND_COLOR`.