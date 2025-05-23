import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5001,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
        },
        '/socket.io': {
          target: env.VITE_WS_URL || 'ws://localhost:5001',
          ws: true,
        },
      },
    },
    define: {
      'process.env': env,
    },
  };
});
