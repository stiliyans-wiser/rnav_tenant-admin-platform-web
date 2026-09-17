import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Stack } from '@mui/material';
import type { AxiosError } from 'axios';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { GeneralDetailsSection } from '@/features/tenants/components/edit/sections/GeneralDetailsSection';
import { BrandAndThemingSection } from '@/features/tenants/components/edit/sections/BrandAndThemingSection';
import { AIServicesSection } from '@/features/tenants/components/edit/sections/AIServicesSection';
import { ProviderFeatureFlagsSection } from '@/features/tenants/components/edit/sections/ProviderFeatureFlagsSection';
import { SSOSection } from '@/features/tenants/components/edit/sections/SSOSection';
import { DocumentsSection } from '@/features/tenants/components/edit/sections/DocumentsSection';
import { ExtractionSection } from '@/features/tenants/components/edit/sections/ExtractionSection';
import { UIConfigSection } from '@/features/tenants/components/edit/sections/UIConfigSection';
import { TalentAutomationSection } from '@/features/tenants/components/edit/sections/TalentAutomationSection';
import { MatchingControlsSection } from '@/features/tenants/components/edit/sections/MatchingControlsSection';
import { AutoReplacementSection } from '@/features/tenants/components/edit/sections/AutoReplacementSection';
import { CandidateDeliverySection } from '@/features/tenants/components/edit/sections/CandidateDeliverySection';
import { useUpdateTenant } from '@/features/tenants/hooks/useUpdateTenant';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import {
  buildSSOConfigRequestBody,
  buildThemingRequestBody,
  parseDocumentTypes,
  buildIntegrationsRequestBody,
  buildAIConfigRequestBody,
} from '@/features/tenants/utils/buildRequestBody';

interface EditTenantProps {
  title: TenantSectionTitlesEnum;
  defaultValues: any;
  tenantId: string;
  handleClose: () => void;
  onSaved?: () => void;
}

export const EditTenant = ({ title, defaultValues, tenantId, handleClose, onSaved }: EditTenantProps) => {
  const formMethods = useForm({ defaultValues, mode: 'onChange' });
  const { getValues } = formMethods;
  const [apiError, setApiError] = useState<string | null>(null);

  const updateTenant = useUpdateTenant();

  const getRequestBody = (): Partial<Tenant> => {
    if (title === TenantSectionTitlesEnum.GENERAL_DETAILS) {
      return {
        ...defaultValues,
        company_name: getValues('company_name'),
        domain: getValues('domain'),
        integrations: buildIntegrationsRequestBody(defaultValues.integrations),
      };
    }

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

    if (title === TenantSectionTitlesEnum.AI_SERVICES) {
      return {
        ...getValues(),
        ai_config: buildAIConfigRequestBody(getValues('ai_config')),
      };
    }

    if (title === TenantSectionTitlesEnum.PROVIDER_FEATURE_FLAGS) {
      return {
        provider_feature_flags: getValues('provider_feature_flags'),
      };
    }

    if (title === TenantSectionTitlesEnum.EXTRACTION) {
      return {
        extraction_config: getValues('extraction_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.UI_CONFIG) {
      return {
        match_config: getValues('match_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.TALENT_AUTOMATION) {
      return {
        talent_automation_config: getValues('talent_automation_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.MATCHING_CONTROLS) {
      return {
        match_config: getValues('match_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.AUTO_REPLACEMENT) {
      return {
        auto_replacement_config: getValues('auto_replacement_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.CANDIDATE_DELIVERY) {
      return {
        match_config: getValues('match_config'),
        report_config: getValues('report_config'),
      };
    }

    return getValues();
  };

  const onSubmit = async () => {
    setApiError(null);
    try {
      await updateTenant.mutateAsync({
        id: tenantId,
        tenant: getRequestBody(),
      });

      handleClose();
      onSaved?.();
    } catch (error) {
      console.error('Error saving tenant:', error);
      const fallback = 'An unexpected error occurred. Please try again.';
      const detail = (error as AxiosError<{ detail?: string | Array<{ msg?: string }> }>).response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map(d => d.msg ?? JSON.stringify(d)).join('; ')
            : fallback;
      setApiError(message);
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
      case TenantSectionTitlesEnum.PROVIDER_FEATURE_FLAGS:
        return <ProviderFeatureFlagsSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.SSO:
        return <SSOSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.DOCUMENTS:
        return <DocumentsSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.EXTRACTION:
        return <ExtractionSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.UI_CONFIG:
        return <UIConfigSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.TALENT_AUTOMATION:
        return <TalentAutomationSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.MATCHING_CONTROLS:
        return <MatchingControlsSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.AUTO_REPLACEMENT:
        return <AutoReplacementSection onSave={onSubmit} onCancel={handleClose} />;
      case TenantSectionTitlesEnum.CANDIDATE_DELIVERY:
        return <CandidateDeliverySection onSave={onSubmit} onCancel={handleClose} />;
      default:
        return <p>No section found!</p>;
    }
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <FormProvider {...formMethods}>
        <Stack component="form" sx={{ flex: 1 }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}
          <Stack sx={{ flex: 1 }}>{getSectionContent()}</Stack>
        </Stack>
      </FormProvider>
    </Stack>
  );
};
