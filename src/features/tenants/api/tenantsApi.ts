import api from '@/features/auth/api/axiosConfig';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';

const url = '/admin/accounts'

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await api.get<Tenant[]>(url);
  return response.data;
};

export const getTenantById = async (id: string): Promise<Tenant> => {
  const response = await api.get<Tenant>(`${url}/${id}`);
  return response.data;
};

export const createTenant = async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
  const response = await api.post<Tenant>(url, tenant);
  return response.data;
};

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.patch<Tenant>(`${url}/${id}`, tenant);
  return response.data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  await api.delete(`${url}/${id}`);
};
