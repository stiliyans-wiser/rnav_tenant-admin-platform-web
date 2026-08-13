import React from 'react';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { ExtractionForm } from '@/features/tenants/components/common/forms/ExtractionForm';

export const ExtractionSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  return (
    <EditTenantLayout isSaveButtonDisabled={false} onCancel={onCancel} onSave={onSave}>
      <ExtractionForm />
    </EditTenantLayout>
  );
};
