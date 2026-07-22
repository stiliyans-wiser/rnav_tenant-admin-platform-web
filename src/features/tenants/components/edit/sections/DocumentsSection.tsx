import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { DocumentsForm } from '@/features/tenants/components/common/forms/DocumentsForm';
import { useGetDocumentTypes } from '@/features/document-types/hooks/useGetDocumentTypes';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const DocumentsSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { data: documentTypes } = useGetDocumentTypes();
  const hasDocumentTypeCatalog = Boolean(documentTypes?.length);
  const { hasError } = useStepValidation(hasDocumentTypeCatalog ? [formFieldNames.documents.documentTypes] : []);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <DocumentsForm documentTypes={documentTypes || []} required={hasDocumentTypeCatalog} />
    </EditTenantLayout>
  );
};
