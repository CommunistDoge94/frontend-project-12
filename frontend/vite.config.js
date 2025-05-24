import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      '/api': {
        target: 'https://chat.hexlet.io',
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: 'wss://chat.hexlet.io',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socket.io/, '/socket.io'),
      },
    },
  },
});
