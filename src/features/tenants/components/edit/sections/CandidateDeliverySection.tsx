import React from 'react';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { CandidateDeliveryForm } from '@/features/tenants/components/common/forms/CandidateDeliveryForm';

export const CandidateDeliverySection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  return (
    <EditTenantLayout isSaveButtonDisabled={false} onCancel={onCancel} onSave={onSave}>
      <CandidateDeliveryForm />
    </EditTenantLayout>
  );
};
