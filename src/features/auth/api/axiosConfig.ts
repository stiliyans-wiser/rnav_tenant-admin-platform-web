import { signOut } from 'next-auth/react';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { url as loginUrl } from '@/features/auth/api/authApi';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://api:8000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

let sessionToken: string | null = null;

export const setSessionToken = (token: string | null) => {
  sessionToken = token;
};

const setAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  if (sessionToken) {
    config.headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  return config;
};

const handleUnauthorizedResponse = async (error: AxiosError) => {
  const isLoginEndpoint = error.config?.url === loginUrl;

  if (error.response?.status === 401 && !isLoginEndpoint) {
    sessionToken = null;
    await signOut({ redirect: false });
  }

  return Promise.reject(error);
};

api.interceptors.request.use(setAuthorizationHeader, error => Promise.reject(error));
api.interceptors.response.use(response => response, handleUnauthorizedResponse);

export default api;
