import path from "path"
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from "vite"
import tailwindcss from "tailwindcss";

// @ts-ignore
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig(

    {
      plugins: [react()],
      base: "/",
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      server: {
      }
    })
}
