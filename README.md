# cms-adapter-generator

A tool to connect a JSON schema from a CMS with the input props of UI components

## prerequistes

pnpm is used as a package manager as it is disk efficient and stores all js packages in a local store. this project assumes prior installation of pnpm. 

for more details see: https://pnpm.io/motivation

for installation instructions see: https://pnpm.io/installation

## install

```
pnpm install
```

## precommit hook

`pnpm run lint` and `pnpm run format` is run before every commit.

## generate schema 

to generate the json schema based on a cms api endpoint run:

```
pnpm generate:schema <apiendpoint> 
```


