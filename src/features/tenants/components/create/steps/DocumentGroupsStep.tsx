import React from 'react';
import { GroupObjectsNew } from '@carbon/icons-react';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { DocumentGroups } from '@/features/tenants/components/common/document-groups/DocumentGroups';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';

export const DocumentGroupsStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { accountId } = useCreateTenantContext();

  return (
    <CreateTenantLayout
      stepTitle={TenantSectionTitlesEnum.DOCUMENT_GROUPS}
      stepIcon={<GroupObjectsNew size={24} />}
      isBackButtonDisabled={true}
      isNextButtonDisabled={false}
      onBack={() => onBack(false)}
      onNext={() => onNext(false)}
    >
      <DocumentGroups tenantId={accountId} />
    </CreateTenantLayout>
  );
};
