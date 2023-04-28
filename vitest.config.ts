/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    /* environment: "node" (default environment, no need to specify) */
    setupFiles: "./vitest.setup.ts",
  },
});
