import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { Chip, Stack } from '@mui/material';
import React from 'react';

export interface DocumentsData {
  document_types: DocumentType[];
}

interface DocumentsViewProps {
  data: DocumentsData;
}

export const DocumentsView = ({ data }: DocumentsViewProps) => {
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={3}>
      {data.document_types.map(document => (
        <Chip key={document.id} label={document.name} />
      ))}
    </Stack>
  );
}
