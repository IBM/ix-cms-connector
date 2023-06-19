# IBM iX CMS Connector

IBM iX CMS Connector is a tool that generates a connector function (HOC) between a CMS schema and react component props.

## Roadmap

We are constantly improving the existing features and adding new ones. Our current focus is on the following topics:

- [ ] Update on the logic to receive a schema (yaml) from a CMS instead of a JSON
- [ ] Additional CMS parser: Magnolia
- [ ] UI changes to have a clear visualization of nested props available for mapping
- [ ] Improvements on filter usability and bugfix for filtering union types
- [ ] Ability to copy/paste the schemas and components
- [ ] Additional CMS parser: Contentful

## How to use?

To exectute the cms connector simply run

```
npm exec github:IBM/ix-cms-connector
```

This will open up the UI of the connector on http://localhost:8080/. You can define another port by passing in an environment variable, e.g. `PORT=3000 npm exec github:IBM/ix-cms-connector`.

After completing all steps of the cms connector app, code is generated for a higher order component (HOC).

### Higher Order Component (HOC)

To map the CMS data with the properties of your component, call the generated HOC, passing it the data and invoke the returned function with the component you want to adapt as an argument, like so:

```
const ConnectedComponent = connectSampleComponentToCMS(cmsData)(SampleComponent);
```

The return value is the component with the CMS data already applied. The component can then be used as usual and you can pass rest props if necessary. It is also possible to overwrite already applied props.

```
<ConnectedComponent notMappedProp={new Date()} mappedProp="new value" />
```

## Development

### Prerequistes

In order to develop the cms connector web app the following prequistes are required:

- **node 18** - This project needs node 18 in order to run. You can use `nvm install 18` and `nvm use 18` for that.

- **pnpm** - [pnpm](https://pnpm.io/motivation) is used as a package manager as it is disk efficient and stores all js packages in a local store. this project assumes prior installation of pnpm. For more details see: . For installation instructions see: https://pnpm.io/installation

- **preact** - [Preact](https://preactjs.com/) is the chosen JavaScript library used to build the cms connector as an alternative to React.:

### Installation

Install all required development dependencies for development with:

```
pnpm install
```

### Run

Spin up a development server on port `8080` (by default) with:

```
pnpm run dev
```

### Build

Create production build with:

```
pnpm run build
```

### Lint & Format

The linting task `pnpm run lint` and the formatting task `pnpm run format` are run before every commit.

### Component overview

To get an overview of all UI components open:

```
localhost:8080/overview
```

## Unit and Integration Tests

Unit and Integration Testing is done using a combination of [Vitest](https://vitest.dev/) with [Preact Testing Library](https://preactjs.com/guide/v10/preact-testing-library)

User events are available through [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) which is part of the Testing Library ecosystem, as does the Preact Testing Library.

Vitest has been expanded with [Jest Dom](https://testing-library.com/docs/ecosystem-jest-dom/) to be able to access additional matchers to test the UI.

### Test

Run all tests once with:

```
pnpm run test
```

### Test: verbose

Runs the tests once and shows the full task tree

```
pnpm run test:verbose
```

### Test: watch

Watch mode

```
pnpm run test:watch
```

### Test: coverage

Create the coverage report of the project under the folder /coverage

```
pnpm run test:coverage
```

## License

This project is licensed under Apache 2.0. Full license text is available in [LICENSE](./LICENSE.txt).
All source files must be include a Copyright and License header.

```
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
```
