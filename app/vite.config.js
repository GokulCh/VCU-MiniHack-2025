import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/cmsc408-fa2024-proj-blue/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cmsc408-fa2024-proj-blue\/api/, '/api'),
      },
    },
  },
});
