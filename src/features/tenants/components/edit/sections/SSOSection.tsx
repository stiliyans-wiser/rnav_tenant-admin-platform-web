import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { useGetAdminConfig } from '@/features/tenants/hooks/useGetAdminConfig';
import { SSOForm } from '@/features/tenants/components/common/forms/SSOForm';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const SSOSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { data: adminConfig } = useGetAdminConfig();
  const { hasError } = useStepValidation([
    formFieldNames.sso.type,
    formFieldNames.sso.enabled,
    formFieldNames.sso.tenantId,
    formFieldNames.sso.clientId,
    formFieldNames.sso.clientSecret,
    formFieldNames.sso.scopes,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <SSOForm adminConfig={adminConfig} />
    </EditTenantLayout>
  );
};
