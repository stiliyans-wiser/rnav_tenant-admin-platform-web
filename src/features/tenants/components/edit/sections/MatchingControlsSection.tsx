import React from 'react';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { MatchingControlsForm } from '@/features/tenants/components/common/forms/MatchingControlsForm';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const MatchingControlsSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.matchConfig.topK,
    formFieldNames.matchConfig.programmaticWeight,
    formFieldNames.matchConfig.llmSemanticWeight,
    formFieldNames.matchConfig.embeddingSimilarityWeight,
    formFieldNames.matchConfig.scoreThreshold,
    formFieldNames.matchConfig.screeningThreshold,
    formFieldNames.matchConfig.calibrationTopKMultiplier,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <MatchingControlsForm />
    </EditTenantLayout>
  );
};
