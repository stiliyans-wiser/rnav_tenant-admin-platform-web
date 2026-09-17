import { useEffect } from 'react';
import { AudioConsole } from '@carbon/icons-react';
import { useFormContext } from 'react-hook-form';
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
  ]);

  const { setValue, getValues } = useFormContext();

  useEffect(() => {
    if (!getValues(formFieldNames.documents.documentDataSources)?.length) {
      setValue(formFieldNames.documents.documentDataSources, ['manual_upload']);
    }
    if (!getValues(formFieldNames.generalDetails.chatStrategy)) {
      setValue(formFieldNames.generalDetails.chatStrategy, 'Default');
    }
    if (!getValues(formFieldNames.settings.preferredCurrency)) {
      setValue(formFieldNames.settings.preferredCurrency, 'USD');
    }
    if (!getValues(formFieldNames.settings.preferredTimezone)) {
      setValue(formFieldNames.settings.preferredTimezone, 'UTC');
    }
  }, [setValue, getValues]);

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
