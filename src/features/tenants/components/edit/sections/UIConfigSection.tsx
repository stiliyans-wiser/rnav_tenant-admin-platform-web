import React from 'react';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { UIConfigForm } from '@/features/tenants/components/common/forms/UIConfigForm';

export const UIConfigSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  return (
    <EditTenantLayout isSaveButtonDisabled={false} onCancel={onCancel} onSave={onSave}>
      <UIConfigForm />
    </EditTenantLayout>
  );
};
