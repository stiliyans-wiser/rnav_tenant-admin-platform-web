import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { AutoReplacementForm } from '@/features/tenants/components/common/forms/AutoReplacementForm';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const AutoReplacementSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.autoReplacement.enabled,
    formFieldNames.autoReplacement.minPoolThreshold,
    formFieldNames.autoReplacement.debounceWindowSeconds,
    formFieldNames.autoReplacement.maxReplacementSuggestions,
  ]);

  return (
    <EditTenantLayout isSaveButtonDisabled={hasError} onCancel={onCancel} onSave={onSave}>
      <AutoReplacementForm />
    </EditTenantLayout>
  );
};
