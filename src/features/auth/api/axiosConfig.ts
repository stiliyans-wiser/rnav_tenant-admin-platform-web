import axios from 'axios';
import { authConstants } from '@/features/auth/constants/authConstants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ai-services.protal.biz/api',
});

api.interceptors.request.use((config) => {
  const key = localStorage.getItem(authConstants.localStorage.masterLoginKey);
  
  if (key) {
    const separator = config.url?.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}key=${key}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(authConstants.localStorage.masterLoginKey);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api; 
