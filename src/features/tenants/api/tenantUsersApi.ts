import api from '@/features/auth/api/axiosConfig';
import { CreateTenantUser } from '@/features/tenants/interfaces/create-tenant-user.interface';

const url = '/admin/users';

export const createTenantUsers = async (tenant: Omit<CreateTenantUser, 'id'>): Promise<CreateTenantUser> => {
  const response = await api.post<CreateTenantUser>(url, tenant);
  return response.data;
};
