import { AudioConsole } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { GeneralDetailsForm } from '@/features/tenants/components/common/forms/GeneralDetailsForm';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const GeneralDetailsStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.generalDetails.companyName,
    formFieldNames.generalDetails.domain,
    formFieldNames.settings.preferredCurrency,
    formFieldNames.settings.preferredTimezone,
  ]);

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.GENERAL_DETAILS}
      stepIcon={<AudioConsole size={24} />}
      isNextButtonDisabled={hasError}
      isBackButtonDisabled={true}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <GeneralDetailsForm />
    </CreateTenantLayout>
  );
};
