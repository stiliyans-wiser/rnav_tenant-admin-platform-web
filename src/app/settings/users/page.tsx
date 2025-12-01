'use client';

import { CircularProgress, Stack } from '@mui/material';
import { useGetUsers } from '@/features/users/hooks/useGetUsers';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import { ClientTableContainer } from '@/features/layout/components/table/ClientTableContainer';
import { UsersTable } from '@/features/users/components/table/UsersTable';
import { UserActionControls } from '@/features/users/components/table/UserActionControls';

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsers();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader titleKey="Users" />
        <Stack direction="row" sx={{ justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Stack>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <PageHeader titleKey="Users" actionChildren={<UserActionControls />} />
      <ClientTableContainer filterChildren={null} tableChildren={<UsersTable users={users || []} />} />
    </PageContainer>
  );
}
