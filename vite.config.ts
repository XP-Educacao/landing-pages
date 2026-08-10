import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  // Relative base so the build works on GitHub Pages under /<repo>/ and locally.
  base: "./",
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    // Resolves the "@/*" alias from tsconfig.json.
    tsconfigPaths: true,
  },
  build: {
    // GitHub Pages serves from /docs on the default branch.
    outDir: "docs",
    emptyOutDir: true,
  },
});
