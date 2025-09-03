import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VITE_URL_BACK, // Usa una variable de entorno de Vite
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true 
});

// Interceptor para adjuntar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;