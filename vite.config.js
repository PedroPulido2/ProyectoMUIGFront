import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_URL_BACK': JSON.stringify('https://proyectomuigback.up.railway.app/api')
  }
})
