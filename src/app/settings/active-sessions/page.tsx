'use client';

import { Typography } from '@mui/material';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { PlatformSessionsTable } from '@/features/active-sessions/components/PlatformSessionsTable';
import { useGetPlatformSessions } from '@/features/active-sessions/hooks/useGetPlatformSessions';

export default function ActiveSessionsPage() {
  const { data, isLoading, isError } = useGetPlatformSessions();

  return (
    <PageContainer>
      <PageHeader titleKey="Active Sessions" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Platform-wide view of currently logged-in users grouped by tenant. Refreshes automatically every 30 seconds.
      </Typography>

      <PlatformSessionsTable data={data} isLoading={isLoading} isError={isError} />
    </PageContainer>
  );
}
