import axios from 'axios';
import { authConstants } from '@/features/auth/constants/authConstants';
import { isClient } from '@/features/common/utils/is-client.util';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (isClient()) {
    const key = localStorage.getItem(authConstants.localStorage.masterLoginKey);
    
    if (key) {
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}key=${key}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (isClient()) {
        localStorage.removeItem(authConstants.localStorage.masterLoginKey);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api; 
