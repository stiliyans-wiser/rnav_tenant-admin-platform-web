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
import { ExtractionSection } from '@/features/tenants/components/edit/sections/ExtractionSection';
import { UIConfigSection } from '@/features/tenants/components/edit/sections/UIConfigSection';
import { TalentAutomationSection } from '@/features/tenants/components/edit/sections/TalentAutomationSection';
import { MatchingControlsSection } from '@/features/tenants/components/edit/sections/MatchingControlsSection';
import { AutoReplacementSection } from '@/features/tenants/components/edit/sections/AutoReplacementSection';
import { CandidateDeliverySection } from '@/features/tenants/components/edit/sections/CandidateDeliverySection';
import { useUpdateTenant } from '@/features/tenants/hooks/useUpdateTenant';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { embeddingWeightsError, withEmbeddingWeights } from '@/features/tenants/utils/embeddingWeights';
import { languageSettingsError, withMatchConfigDefaults } from '@/features/tenants/utils/languageSettings';
import {
  buildSSOConfigRequestBody,
  buildThemingRequestBody,
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

const SECTIONS_SAVING_MATCH_CONFIG = [
  TenantSectionTitlesEnum.UI_CONFIG,
  TenantSectionTitlesEnum.MATCHING_CONTROLS,
  TenantSectionTitlesEnum.CANDIDATE_DELIVERY,
];

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
        match_config: withEmbeddingWeights(getValues('match_config')),
      };
    }

    if (title === TenantSectionTitlesEnum.TALENT_AUTOMATION) {
      return {
        talent_automation_config: getValues('talent_automation_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.MATCHING_CONTROLS) {
      return {
        match_config: withEmbeddingWeights(getValues('match_config')),
      };
    }

    if (title === TenantSectionTitlesEnum.AUTO_REPLACEMENT) {
      return {
        auto_replacement_config: getValues('auto_replacement_config'),
      };
    }

    if (title === TenantSectionTitlesEnum.CANDIDATE_DELIVERY) {
      return {
        match_config: withEmbeddingWeights(getValues('match_config')),
        report_config: getValues('report_config'),
      };
    }

    return getValues();
  };

  const onSubmit = async () => {
    setApiError(null);
    if (SECTIONS_SAVING_MATCH_CONFIG.includes(title)) {
      const weightsError =
        embeddingWeightsError(getValues('match_config')) ??
        (title === TenantSectionTitlesEnum.MATCHING_CONTROLS ? languageSettingsError(getValues('match_config')) : null);
      if (weightsError) {
        setApiError(weightsError);
        return;
      }
    }
    try {
      await updateTenant.mutateAsync({
        id: tenantId,
        tenant: withMatchConfigDefaults(getRequestBody()),
      });

      handleClose();
      onSaved?.();
    } catch (error) {
      console.error('Error saving tenant:', error);
      const fallback = 'An unexpected error occurred. Please try again.';
      const detail = (error as AxiosError<{ detail?: string | Array<{ msg?: string; loc?: Array<string | number> }> }>).response?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail
                .map(d => {
                  const field = d.loc?.filter(part => part !== 'body').join('.');
                  return `${field ? `${field}: ` : ''}${d.msg ?? JSON.stringify(d)}`;
                })
                .join('; ')
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
