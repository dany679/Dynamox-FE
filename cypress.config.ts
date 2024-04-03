import { defineConfig } from "cypress";
import "dotenv/config";

const defaultEnv = {
  webTitle: "Company Box",
  RECORD_KEY: "fd629ced-45be-47c1-85cc-175d3ffb6f41",
  CYPRESS_RECORD_KEY: "fd629ced-45be-47c1-85cc-175d3ffb6f41",
};
export default defineConfig({
  projectId: process.env.projectId,
  env: {
    ...defaultEnv,
    NEXT_BASE_HTTP: process.env.NEXT_PUBLIC_HTTP,
  },
  e2e: {
    defaultCommandTimeout: 20000,
    env: {
      ...defaultEnv,
      email: process.env.email,
      password: process.env.password,
    },
    baseUrl: process.env.baseUrl,
    specPattern: "cypress/e2e/**",
    video: false,
    setupNodeEvents(on, config) {
      defaultCommandTimeout: 10000;
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
