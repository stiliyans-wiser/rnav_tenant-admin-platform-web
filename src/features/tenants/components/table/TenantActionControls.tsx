import { Add } from '@carbon/icons-react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export const TenantActionControls = () => {
  const router = useRouter();

  const handleCreateTenant = () => {
    router.push('/tenants/create');
  };

  return (
    <>
      <Button variant="contained" startIcon={<Add size={20} />} onClick={handleCreateTenant}>
        New Tenant
      </Button>
    </>
  );
};
