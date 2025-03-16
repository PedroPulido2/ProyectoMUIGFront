import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_BACK, // Usa una variable de entorno de Vite
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true 
});

export default api;