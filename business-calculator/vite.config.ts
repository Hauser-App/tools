import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5175,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router-dom/")
          ) {
            return "vendor";
          }
          if (
            id.includes("@radix-ui/react-label") ||
            id.includes("@radix-ui/react-select") ||
            id.includes("@radix-ui/react-slot")
          ) {
            return "ui";
          }
        },
      },
    },
  },
  base: process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx"],
  },
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
