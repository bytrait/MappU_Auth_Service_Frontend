import axios from 'axios';
import { getSlugFromPath } from '../tenant/slug';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API || import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const careerApi = axios.create({
  baseURL: import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_API_URL || '/',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const slug = getSlugFromPath();
  config.headers = config.headers || {};
  config.headers['X-Tenant-Slug'] = slug;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    const normalized = {
      status: err.response?.status,
      message: data?.message || err.message || 'Request failed',
      code: data?.code,
      details: data?.details,
      raw: err,
    };
    return Promise.reject(normalized);
  }
);

export default api;

export { careerApi };
