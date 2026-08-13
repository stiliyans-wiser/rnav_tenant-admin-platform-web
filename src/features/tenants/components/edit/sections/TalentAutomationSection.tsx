import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { TalentAutomationForm } from '@/features/tenants/components/common/forms/TalentAutomationForm';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const TalentAutomationSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.talentAutomation.confidenceThreshold,
    formFieldNames.talentAutomation.screeningSlaSeconds,
    formFieldNames.talentAutomation.maxRerouteSuggestions,
    formFieldNames.talentAutomation.interviewPrepQuestionCount,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <TalentAutomationForm />
    </EditTenantLayout>
  );
};
