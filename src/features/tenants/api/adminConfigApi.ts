import api from '@/features/auth/api/axiosConfig';
import { AdminConfig } from '@/features/tenants/interfaces/admin-config.interface';

const url = '/admin/config';

export const getAdminConfig = async (): Promise<AdminConfig> => {
  const response = await api.get<AdminConfig>(url);
  return response.data;
};
