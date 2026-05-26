import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const careerApi = axios.create({
  baseURL: import.meta.env.VITE_CAREER_GUIDANCE_PLATFORM_API_URL || "/",
  withCredentials: true,
})

export default api;

export { careerApi };
