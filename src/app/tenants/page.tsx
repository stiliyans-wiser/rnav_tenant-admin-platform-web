'use client';

import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { ClientTableContainer } from '@/features/layout/components/table/ClientTableContainer';
import { TenantsTable } from '@/features/tenants/components/TenantsTable';

export default function TenantsPage() {
  return (
    <PageContainer>
      <PageHeader titleKey="Tenants" />
      <ClientTableContainer
        filterChildren={null}
        tableChildren={<TenantsTable />}
      />
    </PageContainer>
  );
} 
