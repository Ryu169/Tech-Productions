import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites under /<repo-name>/, so the build output
// must reference assets via that prefix. Switch to '/' if you ever deploy at
// the root (e.g. on a custom domain or to a Vercel/Netlify project).
const BASE = process.env.VITE_BASE || '/Tech-Productions/';

export default defineConfig({
  base: BASE,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
