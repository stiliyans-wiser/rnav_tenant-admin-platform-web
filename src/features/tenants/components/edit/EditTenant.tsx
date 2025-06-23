import { FormProvider, useForm } from 'react-hook-form';
import { Stack } from '@mui/material';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { GeneralDetailsSection } from '@/features/tenants/components/edit/sections/GeneralDetailsSection';
import { BrandAndThemingSection } from '@/features/tenants/components/edit/sections/BrandAndThemingSection';
import { AIServicesSection } from '@/features/tenants/components/edit/sections/AIServicesSection';
import { SSOSection } from '@/features/tenants/components/edit/sections/SSOSection';
import { DocumentsSection } from '@/features/tenants/components/edit/sections/DocumentsSection';
import { useUpdateTenant } from '@/features/tenants/hooks/useUpdateTenant';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { buildSSOConfigRequestBody, buildThemingRequestBody, parseDocumentTypes } from '@/features/tenants/utils/buildRequestBody';

interface EditTenantProps {
  title: TenantSectionTitlesEnum;
  defaultValues: any;
  tenantId: string;
  handleClose: () => void;
}

export const EditTenant = ({ title, defaultValues, tenantId, handleClose }: EditTenantProps) => {
  const formMethods = useForm({ defaultValues, mode: 'onChange' });
  const { getValues } = formMethods;

  const updateTenant = useUpdateTenant();

  const getRequestBody = (): Partial<Tenant> => {
    if (title === TenantSectionTitlesEnum.BRAND_AND_THEMING) {
      return {
        ...getValues(),
        settings: buildThemingRequestBody(getValues().settings),
      };
    }

    if (title === TenantSectionTitlesEnum.SSO) {
      return {
        ...getValues(),
        sso_config: buildSSOConfigRequestBody(getValues('sso_config')),
      };
    }

    if (title === TenantSectionTitlesEnum.DOCUMENTS) {
      return {
        ...getValues(),
        document_types: parseDocumentTypes(getValues('document_types')),
      };
    }

    return getValues();
  };

  const onSubmit = async () => {
    try {
      await updateTenant.mutateAsync({
        id: tenantId,
        tenant: getRequestBody(),
      });

      handleClose();
    } catch (error) {
      console.error('Error saving document type:', error);
    }
  };

  const getSectionContent = () => {
    switch (title) {
      case TenantSectionTitlesEnum.GENERAL_DETAILS:
        return <GeneralDetailsSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.BRAND_AND_THEMING:
        return <BrandAndThemingSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.AI_SERVICES:
        return <AIServicesSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.SSO:
        return <SSOSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.DOCUMENTS:
        return <DocumentsSection onSave={onSubmit} onCancel={handleClose} />;
      default:
        return <p>No section found!</p>;
    }
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <FormProvider {...formMethods}>
        <Stack component="form" sx={{ flex: 1, justifyContent: 'space-between' }}>
          <Stack sx={{ flex: 1 }}>{getSectionContent()}</Stack>
        </Stack>
      </FormProvider>
    </Stack>
  );
};
