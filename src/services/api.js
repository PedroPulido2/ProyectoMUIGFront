import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BACK,
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

// Base del backend sin barra final (p. ej. http://localhost:3001/api)
const BACKEND_URL = (import.meta.env.VITE_URL_BACK || '').replace(/\/+$/, '');

// Extrae el ID de una URL de Google Drive (.../d/<id>/...)
const extractDriveId = (driveUrl) => {
  if (!driveUrl) return null;
  const afterD = String(driveUrl).split('/d/')[1];
  if (!afterD) return null;
  return afterD.split('/')[0] || null;
};

export const getImagenUrl = (driveUrl, { wm = false, width = null } = {}) => {
  const id = extractDriveId(driveUrl);
  if (!id) return null;
  const ruta = wm ? `/imagen/wm/load/${id}` : `/imagen/load/${id}`;
  const query = width ? `?width=${width}` : '';
  return `${BACKEND_URL}${ruta}${query}`;
};

export default api;