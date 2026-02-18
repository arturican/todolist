import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/todolist/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,      // <-- укажи нужный порт
    open: true,      // (опционально) автоматически открывать браузер
    proxy: {
      '/api': {
        target: 'https://social-network.samuraijs.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/1.1'),
      },
    },
  },
  preview: {
    port: 3001,
    open: true,
  }
});
