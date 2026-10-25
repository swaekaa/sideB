import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'src/public',
  server: {
    port: 5173,
    open: false
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500
  }
});
