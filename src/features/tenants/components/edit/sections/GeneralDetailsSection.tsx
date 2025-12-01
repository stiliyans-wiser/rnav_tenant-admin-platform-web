import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { GeneralDetailsForm } from '../../common/forms/GeneralDetailsForm';
import { formFieldNames } from '@/features/tenants/constants/form.constants';
import { useGetAdminConfig } from '@/features/tenants/hooks/useGetAdminConfig';

export const GeneralDetailsSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { data: adminConfig } = useGetAdminConfig();
  const { hasError } = useStepValidation([
    formFieldNames.generalDetails.companyName,
    formFieldNames.generalDetails.domain,
    formFieldNames.settings.preferredCurrency,
    formFieldNames.settings.preferredTimezone,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <GeneralDetailsForm adminConfig={adminConfig} disabledFields={[formFieldNames.generalDetails.domain]} />
    </EditTenantLayout>
  );
};
