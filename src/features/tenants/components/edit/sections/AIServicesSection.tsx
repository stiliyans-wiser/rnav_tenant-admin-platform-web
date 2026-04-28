import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { AIServicesForm } from '@/features/tenants/components/common/forms/AIServicesForm';
import { useGetAdminConfig } from '@/features/tenants/hooks/useGetAdminConfig';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const AIServicesSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { data: adminConfig } = useGetAdminConfig();
  const { hasError } = useStepValidation([
    formFieldNames.aiConfig.aiType,
    formFieldNames.aiConfig.aiEmbeddingModel,
    formFieldNames.aiConfig.temperature,
    formFieldNames.aiConfig.openAiKey,
    formFieldNames.aiConfig.openAiEndpoint,
    formFieldNames.aiConfig.openAiVersion,
    formFieldNames.aiConfig.webSearch,
    formFieldNames.matchConfig.topK,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <AIServicesForm adminConfig={adminConfig} />
    </EditTenantLayout>
  );
};
