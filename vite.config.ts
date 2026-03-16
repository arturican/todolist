import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appBase = process.env.VITE_PUBLIC_BASE || '/';
const shouldOpenBrowser = process.env.VITE_OPEN_BROWSER === 'true';

export default defineConfig({
  base: appBase,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui-vendor';
          }

          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform') ||
            id.includes('/zod/')
          ) {
            return 'forms-vendor';
          }

          if (
            id.includes('@reduxjs/toolkit') ||
            id.includes('react-redux') ||
            id.includes('axios')
          ) {
            return 'state-vendor';
          }

          if (
            id.includes('react-router') ||
            id.includes('react-dom') ||
            id.includes('/react/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: shouldOpenBrowser,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3001,
    open: shouldOpenBrowser,
  },
});
