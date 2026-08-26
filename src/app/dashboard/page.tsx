'use client';

import { useCallback, useState } from 'react';
import { Stack, CircularProgress, Alert, Button } from '@mui/material';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { DashboardActionControls } from '@/features/dashboard/components/DashboardActionControls';
import { DashboardFilter } from '@/features/dashboard/interfaces/dashboard-filter.interface';
import { useGetAiUsage } from '@/features/dashboard/hooks/useGetAiUsage';
import { useGetTenants } from '@/features/tenants/hooks/useGetTenants';
import { useGetAdminConfig } from '@/features/tenants/hooks/useGetAdminConfig';

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilter>();

  const { data: tenants = [], isLoading: isGettingTenants } = useGetTenants();
  const { data: adminConfig, isLoading: isGettingAdminConfig } = useGetAdminConfig();

  const { data: aiUsageData, isLoading: isGettingAiUsage, error, refetch } = useGetAiUsage(filters);

  const handleFilterChanged = useCallback((filter: DashboardFilter) => {
    setFilters(filter);
  }, []);

  const renderContent = () => {
    if (isGettingAiUsage || isGettingTenants || isGettingAdminConfig) {
      return (
        <Stack sx={{ alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      );
    }

    if (error) {
      const isNetworkError = !(error as { response?: unknown }).response;
      const errorMessage = isNetworkError
        ? 'Network error — check your connection and try again.'
        : 'Server error — the dashboard could not be loaded.';
      return (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Alert severity="error">{errorMessage}</Alert>
          <Button variant="outlined" onClick={() => refetch()}>
            Retry
          </Button>
        </Stack>
      );
    }

    return <Dashboard data={aiUsageData} />;
  };

  const renderActionControls = () => {
    if (isGettingTenants || isGettingAdminConfig) {
      return null;
    }

    return <DashboardActionControls tenants={tenants} periodOptions={adminConfig?.time_periods} onFilterChanged={handleFilterChanged} />;
  };

  return (
    <PageContainer>
      <PageHeader titleKey="Dashboard" actionChildren={renderActionControls()} />
      {renderContent()}
    </PageContainer>
  );
}
