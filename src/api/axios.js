import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API || import.meta.env.VITE_API_URL,
  withCredentials: true,
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
