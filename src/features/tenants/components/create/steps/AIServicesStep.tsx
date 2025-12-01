import { SettingsServices } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { AIServicesForm } from '@/features/tenants/components/common/forms/AIServicesForm';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const AIServicesStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.aiConfig.aiType,
    formFieldNames.aiConfig.aiEmbeddingModel,
    formFieldNames.aiConfig.temperature,
    formFieldNames.aiConfig.openAiKey,
    formFieldNames.aiConfig.openAiEndpoint,
    formFieldNames.aiConfig.openAiVersion,
    formFieldNames.aiConfig.webSearch,
  ]);
  const { adminConfig } = useCreateTenantContext();

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.AI_SERVICES}
      stepIcon={<SettingsServices size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <AIServicesForm adminConfig={adminConfig} />
    </CreateTenantLayout>
  );
};
