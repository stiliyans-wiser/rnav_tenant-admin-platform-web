import React from 'react';
import { Chip, Stack } from '@mui/material';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';

export interface DocumentsData {
  company_name: string;
  document_types: string[];
}

interface DocumentsViewProps {
  data: DocumentsData;
}

export const DocumentsView = ({ data }: DocumentsViewProps) => {
  // Parse the document_types strings into DocumentType objects
  const parsedDocuments: DocumentType[] = data.document_types?.map(document => JSON.parse(document)) || [];

  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={3}>
      {parsedDocuments?.map(parsedDocument => <Chip key={parsedDocument.id} label={parsedDocument.name} />)}
    </Stack>
  );
};
