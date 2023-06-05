# IBM iX CMS Connector

A tool that generates a connector function (HOC) between a CMS schema and react component props.

## Usage

To exectue the cms connector simply run

```
npx ibm-ix-cms-connector
```

This will open up the UI of the connector on http://localhost:8080/. You can define another port by passing in an environment variable, e.g. `PORT=3000 npx ibm-ix-cms-connector`.

After completing all steps of the cms connector app, code is generated for a higher order component (HOC).

### HOC

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

- **pnpm** - pnpm is used as a package manager as it is disk efficient and stores all js packages in a local store. this project assumes prior installation of pnpm. For more details see: https://pnpm.io/motivation. For installation instructions see: https://pnpm.io/installation

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

### Test

Run all tests once with:

```
pnpm run test
```

### Lint & Format

The linting task `pnpm run lint` and the formatting task `pnpm run format` are run before every commit.

### Unit and Integration Tests

Unit and Integration Testing is done using a combination of Vitest (https://vitest.dev/) with Preact Testing Library (https://preactjs.com/guide/v10/preact-testing-library)

User events are available through @testing-library/user-event (https://testing-library.com/docs/user-event/intro) which is part of the Testing Library ecosystem, as does the Preact Testing Library.

Vitest has been expanded with Jest Dom (https://testing-library.com/docs/ecosystem-jest-dom/) to be able to access additional matchers to test the UI.

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

### Component overview

To get an overview of all UI components open:

```
localhost:8080/overview
```
