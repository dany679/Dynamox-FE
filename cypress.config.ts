import { defineConfig } from "cypress";
import "dotenv/config";

const defaultEnv = {
  webTitle: "Company Box",
};
export default defineConfig({
  env: {
    ...defaultEnv,
    NEXT_BASE_HTTP: process.env.NEXT_BASE_HTTP,
  },
  e2e: {
    env: {
      ...defaultEnv,
      email: process.env.email,
      password: process.env.password,
    },
    baseUrl: process.env.baseUrl,
    specPattern: "cypress/e2e/**",
    video: false,
    setupNodeEvents(on, config) {
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
