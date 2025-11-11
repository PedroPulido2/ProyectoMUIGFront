import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'process.env.VITE_URL_BACK': JSON.stringify('/api')
  },
  server: {
    historyApiFallback: true, // rutas SPA en desarrollo
  },
  preview: {
    historyApiFallback: true, // rutas SPA en build preview
  }
})
