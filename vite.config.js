import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  publicDir: "public",
  server: {
    proxy: {
      "/api": {
        target: "http://3.6.41.54/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPresetEnv({ browsers: "last 2 versions" }),
      ],
    },
  },
});
