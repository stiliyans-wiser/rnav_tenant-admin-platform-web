import { IbmCloudHyperProtectCryptoServices } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { SSOForm } from '@/features/tenants/components/common/forms/SSOForm';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const SSOStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { hasError } = useStepValidation([
    formFieldNames.sso.type,
    formFieldNames.sso.tenantId,
    formFieldNames.sso.clientId,
    formFieldNames.sso.clientSecret,
    formFieldNames.sso.scopes,
  ]);
  const { adminConfig } = useCreateTenantContext();

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.SSO}
      stepIcon={<IbmCloudHyperProtectCryptoServices size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <SSOForm adminConfig={adminConfig} />
    </CreateTenantLayout>
  );
};
