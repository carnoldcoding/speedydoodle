import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // The test runner needs no page builder, so the React Router plugin is left out for tests.
  plugins: [tailwindcss(), ...(process.env.VITEST ? [] : [reactRouter()])],
  resolve: {
    tsconfigPaths: true,
  },
});
