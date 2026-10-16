import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  try {
    const token = JSON.parse(localStorage.getItem('blog_auth') || 'null')?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { localStorage.removeItem('blog_auth'); }
  return config;
});
export default api;
