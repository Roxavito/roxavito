import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative base so the build works when served from a sub-path
  // (e.g. GitHub Pages at /roxavito/) as well as from the root.
  base: './',
  plugins: [react()]
});
