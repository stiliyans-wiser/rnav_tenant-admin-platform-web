import { useQuery } from '@tanstack/react-query';
import { adminConfigConstants } from '@/features/tenants/constants/adminConfig.constants';
import { getAdminConfig } from '@/features/tenants/api/adminConfigApi';

export const useGetAdminConfig = () => {
  return useQuery({
    queryKey: adminConfigConstants.adminConfigKeys.all,
    queryFn: getAdminConfig,
  });
};
