import axios from 'axios';

const api = axios.create({
    baseURL: 'https://proyectomuigback.onrender.com/api',
});

export default api;