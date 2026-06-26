import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],

    //base: '/',
    define: {
      'process.env.VITE_URL_BACK': JSON.stringify('http://localhost:3001/api')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: true,
      historyApiFallback: true, // rutas SPA en desarrollo
    },
    preview: {
      historyApiFallback: true, // rutas SPA en build preview
    }
  };
})
