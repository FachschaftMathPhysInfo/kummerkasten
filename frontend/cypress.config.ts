//https://docs.cypress.io/app/references/configuration//
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
  },
});
