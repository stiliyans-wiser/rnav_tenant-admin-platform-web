import React from 'react';
import { Document } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { DocumentsForm } from '@/features/tenants/components/common/forms/DocumentsForm';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const DocumentsStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { documentTypes } = useCreateTenantContext();
  const { hasError } = useStepValidation([formFieldNames.documents.documentTypes]);

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.DOCUMENTS}
      stepIcon={<Document size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <DocumentsForm documentTypes={documentTypes} />
    </CreateTenantLayout>
  );
};
