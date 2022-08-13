import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "HBSUtils",
      fileName: "index",
    },
    rollupOptions: {
      external: ["contentful"],
      output: {
        globals: {
          contentful: "contentful",
        },
      },
    },
  },
});
