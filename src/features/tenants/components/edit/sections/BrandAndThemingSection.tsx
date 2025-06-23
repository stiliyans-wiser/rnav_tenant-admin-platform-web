import React from 'react';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { useBrandThemingValidation } from '@/features/tenants/hooks/useBrandThemingValidation';
import { BrandAndThemingForm } from '@/features/tenants/components/common/forms/BrandAndThemingForm';

export const BrandAndThemingSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { hasError } = useBrandThemingValidation();

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <BrandAndThemingForm />
    </EditTenantLayout>
  );
};
