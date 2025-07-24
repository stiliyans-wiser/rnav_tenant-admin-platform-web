'use client';

import { useParams } from 'next/navigation';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useGetTenantById } from '@/features/tenants/hooks/useGetTenantById';
import { TenantDetails } from '@/features/tenants/components/details/TenantDetails';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import { DocumentGroupsView } from '@/features/tenants/components/common/view/DocumentGroupsView';

export default function TenantDetailsPage() {
  const params = useParams();

  const tenantId = params.id as string;
  const { data: tenant, isLoading, error } = useGetTenantById(tenantId);

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (error) {
      return <Typography color="error">Error loading tenant details</Typography>;
    }

    if (!tenant) {
      return <Typography>Tenant not found</Typography>;
    }

    return (
      <Stack gap={2}>
        <TenantDetails tenant={tenant} />
        <DocumentGroupsView tenantId={tenant.id} />
      </Stack>
    );
  };

  const getPageTitle = () => {
    return tenant?.company_name || 'Tenant Details';
  };

  const shouldShowCenteredContent = isLoading || error || !tenant;

  return (
    <PageContainer>
      <PageHeader titleKey={getPageTitle()} />
      {shouldShowCenteredContent ? (
        <Stack direction="row" sx={{ justifyContent: 'center', padding: 4 }}>
          {renderContent()}
        </Stack>
      ) : (
        renderContent()
      )}
    </PageContainer>
  );
}
