import { VisualRecognition } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { BrandAndThemingForm } from '@/features/tenants/components/common/forms/BrandAndThemingForm';
import { useBrandThemingValidation } from '@/features/tenants/hooks/useBrandThemingValidation';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';

export const BrandAndThemingStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { hasError } = useBrandThemingValidation();

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.BRAND_AND_THEMING}
      stepIcon={<VisualRecognition size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <BrandAndThemingForm />
    </CreateTenantLayout>
  );
};
