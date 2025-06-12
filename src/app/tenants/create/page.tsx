'use client';

import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { CreateTenant } from '@/features/tenants/components/create/CreateTenant';
import { CreateTenantProvider } from '@/features/tenants/contexts/CreateTenantContext';

export default function CreateTenantPage() {
  return (
    <PageContainer>
      <PageHeader titleKey="Create New Tenant" />
      <CreateTenantProvider>
        <CreateTenant />
      </CreateTenantProvider>
    </PageContainer>
  );
}
