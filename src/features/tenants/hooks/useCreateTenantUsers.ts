import { useMutation } from '@tanstack/react-query';
import { CreateTenantUser } from '@/features/tenants/interfaces/create-tenant-user.interface';
import { createTenantUsers } from '@/features/tenants/api/tenantUsersApi';

export const useCreateTenantUsers = () => {
  return useMutation({
    mutationFn: (tenant: Omit<CreateTenantUser, 'id'>) => createTenantUsers(tenant),
  });
};
