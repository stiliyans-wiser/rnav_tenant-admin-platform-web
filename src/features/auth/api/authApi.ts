import api from '@/features/auth/api/axiosConfig';
import { LoginResponse } from '@/features/auth/interfaces/login-response.interface';

export const url = '/backoffice/login';

export const login = async (formData: FormData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(url, formData);

  return response.data;
};
