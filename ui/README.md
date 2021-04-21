

# Debezium UI

React-based Single Page Application based on Patternfly 4

## Requirements
* node (version 10.13.0 or higher) and npm version 6.x.x.  
* yarn package manager (version 1.13.0 or higher).

Prior to building this project make sure you have these applications installed.  After installing node and npm you 
can install yarn globally by typing:

```sh
npm install yarn -g
```

## Development Scripts

Install development/build dependencies
```sh
yarn install
```

Run a full build
```sh
yarn build
```

Start the development server
```sh
yarn start
```

## Testing the project
Testing is also just a command away:

```sh
yarn run unit:test
```
This command runs Jest, an incredibly useful testing utility, against all files whose extensions end in `.test.ts`.
Like with the `npm run start` command, Jest will automatically run as soon as it detects changes.
If you'd like, you can run `yarn start` and `yarn run unit:test` side by side so that you can preview changes and test them simultaneously.

## Configurations
* [TypeScript Config](./packages/ui/tsconfig.json)
* [Webpack Config](./packages/ui/webpack.common.js)