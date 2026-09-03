import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path in tsconfig.json so tests import modules exactly
    // the way the application does.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Only the pure logic is covered here. Component behaviour is not worth a
    // DOM harness in this project; the value is in the parser and date maths.
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
