import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    connectorsApiPath:
      "/localhost/api/connector_mgmt/v1/kafka_connectors?page=1&size=10",
  },

  viewportWidth: 1280,
  viewportHeight: 720,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "http://localhost:8080",
    supportFile: "cypress/support/commands.ts",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
