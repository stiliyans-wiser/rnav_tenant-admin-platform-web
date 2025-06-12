'use client';

import { CircularProgress, Stack } from '@mui/material';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { ClientTableContainer } from '@/features/layout/components/table/ClientTableContainer';
import { useGetTenants } from '@/features/tenants/hooks/useGetTenants';
import { TenantActionControls } from '@/features/tenants/components/table/TenantActionControls';
import { TenantsTable } from '@/features/tenants/components/table/TenantsTable';

export default function TenantsPage() {
  const { data: tenants, isLoading } = useGetTenants();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader titleKey="Tenants" />
        <Stack direction="row" sx={{ justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader titleKey="Tenants" actionChildren={<TenantActionControls />} />
      <ClientTableContainer
        filterChildren={null}
        tableChildren={<TenantsTable tenants={tenants || []} />}
      />
    </PageContainer>
  );
} 
