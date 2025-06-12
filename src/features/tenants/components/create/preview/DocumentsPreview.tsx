import React from 'react';
import { Chip, Stack } from '@mui/material';
import { Document } from '@carbon/icons-react';
import { PreviewTenantStepLayout } from '@/features/tenants/components/create/layouts/PreviewTenantStepLayout';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';

export const DocumentsPreview = ({ onEdit }: CreateTenantPreviewProps) => {
  const { selectedDocumentTypes } = useCreateTenantContext();

  return (
    <PreviewTenantStepLayout stepTitle="Documents" stepIcon={<Document size={24} />} onEdit={onEdit}>
      <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={3}>
        {selectedDocumentTypes.map(selectedDocument => (
          <Chip key={selectedDocument.id} label={selectedDocument.name} />
        ))}
      </Stack>
    </PreviewTenantStepLayout>
  );
};
