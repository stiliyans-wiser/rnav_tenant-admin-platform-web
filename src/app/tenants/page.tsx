'use client';

import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { ClientTableContainer } from '@/features/layout/components/table/ClientTableContainer';
import { TenantsTable } from '@/features/tenants/components/TenantsTable';
import { useGetTenants } from '@/features/tenants/hooks/useGetTenants';
import { CircularProgress } from '@mui/material';

export default function TenantsPage() {
  const { data: tenants, isLoading } = useGetTenants();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader titleKey="Tenants" />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CircularProgress />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader titleKey="Tenants" />
      <ClientTableContainer
        filterChildren={null}
        tableChildren={<TenantsTable tenants={tenants || []} />}
      />
    </PageContainer>
  );
} 
