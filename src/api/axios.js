import axios from 'axios';

const railwayApiUrl = 'https://backend-api-production-1c4b.up.railway.app';
const isLocalHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (isLocalHost ? 'http://localhost:8080' : railwayApiUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong') {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the backend. Check the deployed API URL and CORS settings.';
  }

  if (error.request && !error.response) {
    return 'No response from the backend. Check whether the server is running and allows this frontend origin.';
  }

  return fallbackMessage;
}

export default api;
