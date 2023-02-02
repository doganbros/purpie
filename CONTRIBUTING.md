# How do you contribute to Purpie

We would very much like your request to improve Purpie so please read
and follow this contributions manual before you start working.

# Create and Report Issues

You should give us as much as possible details about the problems and how to reproduce these issues.
Also, give us more detail about version of the Purpie you are using and development environment.

## Contributor License Agreement

The Purpie projects are licensed under the [Apache License 2.0](https://github.com/jitsi/jitsi-meet/blob/master/LICENSE)
so you need to sign our Apache-based contributor license agreement as either a [corporation](https://jitsi.org/ccla) or
an [individual](https://jitsi.org/icla) to
continue making these projects available under an Open Source license. If you do not accept this agreement then sadly,
we cannot accept your contribution.

## Pull Request Strategy

- Make sure your code passes the linter rules that are executing
  automatically when creating pull request.
- Purpie is a monorepo project so perform **only** frontend or backend change with **one** logical operation per pull
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

* There are some prettier packages with eslint in the codebase, so you need to adjust your editor with Purpie
  settings.

### Naming

* All names CamelCase format in the Purpie.

* The names of global constants (including ES6 module-global constants) should
  be written in uppercase with underscores to separate words. For example,
  `BACKGROUND_COLOR`.

* The underscore character at the beginning of a name signals that the
  respective variable, function, property is non-public i.e. private, protected,
  or internal.

### Avoiding bundle bloat

When adding a new feature it's possible that it triggers a build failure due to the increased bundle size. We have
safeguards inplace to avoid bundles growing disproportionatelly. While there are legit reasons for increasing the
limits, please analyze the bundle first to make sure no unintended dependencies have been included, causing the increase
in size.