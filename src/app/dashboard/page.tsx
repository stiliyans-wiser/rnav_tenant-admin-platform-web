'use client';

import { useCallback, useState } from 'react';
import { Stack, CircularProgress, Typography } from '@mui/material';
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

  const { data: aiUsageData, isLoading: isGettingAiUsage, error } = useGetAiUsage(filters);

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
      return <Typography color="error">Error loading dashboard</Typography>;
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
