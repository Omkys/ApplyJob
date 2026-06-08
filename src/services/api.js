import axios from 'axios';
import { API_BASE_URL, API_PATHS } from '../lib/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

console.info('[ApplyFlow] API base:', API_BASE_URL || '(relative)');
console.info('[ApplyFlow] Templates URL:', `${API_BASE_URL}${API_PATHS.templates}`);

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
