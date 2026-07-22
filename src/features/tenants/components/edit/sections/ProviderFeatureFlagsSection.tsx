import { EditTenantSectionProps } from '@/features/tenants/interfaces/edit-tenant-section-props.interface';
import { EditTenantLayout } from '@/features/tenants/components/common/layouts/EditTenantLayout';
import { ProviderFeatureFlagsForm } from '@/features/tenants/components/common/forms/ProviderFeatureFlagsForm';

export const ProviderFeatureFlagsSection = ({ onSave, onCancel }: EditTenantSectionProps) => {
  return (
    <EditTenantLayout isSaveButtonDisabled={false} onCancel={onCancel} onSave={onSave}>
      <ProviderFeatureFlagsForm />
    </EditTenantLayout>
  );
};
