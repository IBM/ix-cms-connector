# cms-adapter-generator

A tool to connect a JSON schema from a CMS with the input props of UI components

## prerequistes

### node

This project needs node 18 in order to run. You can use `nvm install 18` and `nvm use 18` for that.

### pnpm

pnpm is used as a package manager as it is disk efficient and stores all js packages in a local store. this project assumes prior installation of pnpm. 

For more details see: https://pnpm.io/motivation

For installation instructions see: https://pnpm.io/installation

### preact

preact is the JavaScript library used on this project: https://preactjs.com/

preact-cli https://github.com/preactjs/preact-cli

## install

```
pnpm install
```

## dev

Spin up a development server on port `8080` (by default)

```
pnpm run dev
```

## build

Create production build

```
pnpm run build
```

## precommit hook

`pnpm run lint` and `pnpm run format` is run before every commit.

## generate schema 

to generate the json schema based on a cms api endpoint run:

```
pnpm generate:schema <apiendpoint> 
```

## Unit & Integration Testing

Testing is done using a combination of Vitest (https://vitest.dev/) with Preact Testing Library (https://preactjs.com/guide/v10/preact-testing-library)

User events are available through @testing-library/user-event (https://testing-library.com/docs/user-event/intro) which is part of the Testing Library ecosystem, as does the Preact Testing Library.

Vitest has been expanded with Jest Dom (https://testing-library.com/docs/ecosystem-jest-dom/) to be able to access additional matchers to test the UI.

### test

Runs the tests once

```
pnpm run test
```

### test: verbose

Runs the tests once and shows the full task tree

```
pnpm run test:verbose
```

### test: watch

Watch mode

```
pnpm run test:watch
```