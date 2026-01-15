import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    // This prevents Vite from pre-bundling your UI library.
    // It forces Vite to treat it as source code, 
    // allowing Tailwind to scan the .tsx files.
    exclude: ["@ancore/ui"],
  },
})
