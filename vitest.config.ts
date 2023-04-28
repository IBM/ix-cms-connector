import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    /* environment: "node" (default environment, no need to specify) */
    setupFiles: "./vitest.setup.ts",
  },
});
