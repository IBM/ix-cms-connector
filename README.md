# IBM iX CMS Connector

A tool that helps create a connector function (HOC) between a CMS schema and a react component.

## How to use the HOC

To map the CMS data with the properties of your component, call the
generated higher order component like so, passing it the data and invoke the
returned function with the component you want to adapt as an argument.

```
const ConnectedComponent = connectSampleComponentToCMS(cmsData)(SampleComponent);
```

The return value is the component with the CMS data already applied. The
component can then be used as usual and you can pass the rest props if
necessary. It is also possible to overwrite already applied props.

```
<ConnectedComponent notMappedProp={new Date()} mappedProp="new value" />
```

## usage with npx

To execute the cms adapter generator simply run `npx ibm-ix-cms-connector`. This will open up the UI of the generator on http://localhost:8080/. You can define another port by passing in an environment variable, e.g. `PORT=3000 npx ibm-ix-cms-connector`.

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

#### Component overview

It is possible to check all the components avaible in the overview page.

```
localhost:8080/overview
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

### test: coverage

Create the coverage report of the project under the folder /coverage

```
pnpm run test:coverage
```
