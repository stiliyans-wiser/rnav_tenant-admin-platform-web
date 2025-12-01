'use client';

import { CircularProgress, Stack } from '@mui/material';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { ClientTableContainer } from '@/features/layout/components/table/ClientTableContainer';
import { useGetDocumentTypes } from '@/features/document-types/hooks/useGetDocumentTypes';
import { DocumentTypeActionControls } from '@/features/document-types/components/table/DocumentTypeActionControls';
import { DocumentTypesTable } from '@/features/document-types/components/table/DocumentTypesTable';

export default function DocumentTypesPage() {
  const { data: documentTypes, isLoading } = useGetDocumentTypes();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader titleKey="Document Types" />
        <Stack direction="row" sx={{ justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader titleKey="Document Types" actionChildren={<DocumentTypeActionControls />} />
      <ClientTableContainer filterChildren={null} tableChildren={<DocumentTypesTable documentTypes={documentTypes || []} />} />
    </PageContainer>
  );
}
