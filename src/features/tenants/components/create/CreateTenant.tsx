import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Stack, Step, StepLabel, Stepper } from '@mui/material';
import { DocumentsStep } from '@/features/tenants/components/create/steps/DocumentsStep';
import { GeneralDetailsStep } from '@/features/tenants/components/create/steps/GeneralDetailsStep';
import { BrandAndThemingStep } from '@/features/tenants/components/create/steps/BrandAndThemingStep';
import { AIServicesStep } from '@/features/tenants/components/create/steps/AIServicesStep';
import { SSOStep } from '@/features/tenants/components/create/steps/SSOStep';
import { PreviewStep } from '@/features/tenants/components/create/steps/PreviewStep';
import { useGetAdminConfig } from '@/features/tenants/hooks/useGetAdminConfig';
import { useGetDocumentTypes } from '@/features/document-types/hooks/useGetDocumentTypes';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { useCreateTenant } from '@/features/tenants/hooks/useCreateTenant';
import { Tenant, TenantForm } from '@/features/tenants/interfaces/tenant.interface';
import { UsersStep } from '@/features/tenants/components/create/steps/UsersStep';
import { SuccessStep } from '@/features/tenants/components/create/steps/SuccessStep';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import {
  buildDocumentDataSourcesRequestBody,
  buildSSOConfigRequestBody,
  buildThemingRequestBody,
  parseDocumentTypes,
} from '@/features/tenants/utils/buildRequestBody';

enum CreateTenantStepEnum {
  GENERAL_DETAILS,
  BRAND_THEMING,
  AI_SERVICES,
  SSO,
  DOCUMENTS,
  PREVIEW,
  ADD_USERS,
  SUCCESS,
}

interface CreateTenantStep {
  id: CreateTenantStepEnum;
  title: string;
  subTitle?: string;
}

const steps: CreateTenantStep[] = [
  {
    id: CreateTenantStepEnum.GENERAL_DETAILS,
    title: TenantSectionTitlesEnum.GENERAL_DETAILS,
  },
  {
    id: CreateTenantStepEnum.BRAND_THEMING,
    title: TenantSectionTitlesEnum.BRAND_AND_THEMING,
  },
  {
    id: CreateTenantStepEnum.AI_SERVICES,
    title: TenantSectionTitlesEnum.AI_SERVICES,
  },
  {
    id: CreateTenantStepEnum.SSO,
    title: TenantSectionTitlesEnum.SSO,
  },
  {
    id: CreateTenantStepEnum.DOCUMENTS,
    title: TenantSectionTitlesEnum.DOCUMENTS,
  },
  {
    id: CreateTenantStepEnum.PREVIEW,
    title: 'Preview & Create tenant',
  },
  {
    id: CreateTenantStepEnum.ADD_USERS,
    title: 'Add user',
    subTitle: 'You need to add at least one user to finalise the process of creating a tenant',
  },
  {
    id: CreateTenantStepEnum.SUCCESS,
    title: 'Finish',
  },
];

const getStepContent = (
  stepId: number,
  onNext: (hasError?: boolean) => void,
  onBack: (hasError?: boolean) => void,
  onEdit: (stepTitle: string) => void,
) => {
  switch (stepId) {
    case CreateTenantStepEnum.GENERAL_DETAILS:
      return <GeneralDetailsStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.BRAND_THEMING:
      return <BrandAndThemingStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.AI_SERVICES:
      return <AIServicesStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.SSO:
      return <SSOStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.DOCUMENTS:
      return <DocumentsStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.PREVIEW:
      return <PreviewStep onNext={onNext} onBack={onBack} onEdit={onEdit} />;
    case CreateTenantStepEnum.ADD_USERS:
      return <UsersStep onNext={onNext} onBack={onBack} />;
    case CreateTenantStepEnum.SUCCESS:
      return <SuccessStep />;
    default:
      return null;
  }
};

export const CreateTenant = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<boolean[]>(Array(steps.length).fill(false));

  const formMethods = useForm<TenantForm>({
    mode: 'onChange',
  });

  const { setAccountId, setAdminConfig, setDocumentTypes } = useCreateTenantContext();

  const { data: adminConfig } = useGetAdminConfig();
  const { data: documentTypes } = useGetDocumentTypes();
  const createTenant = useCreateTenant();

  useEffect(() => {
    if (adminConfig) {
      setAdminConfig(adminConfig);
    }
  }, [adminConfig]);

  useEffect(() => {
    if (documentTypes) {
      setDocumentTypes(documentTypes);
    }
  }, [documentTypes]);

  const updateErrorSteps = (hasError: boolean) => {
    setErrorSteps(prev => {
      const newErrorSteps = [...prev];

      newErrorSteps[activeStep] = hasError;

      return newErrorSteps;
    });
  };

  const handleEdit = (stepTitle: string) => {
    const newActiveStep = steps.findIndex((step: CreateTenantStep) => step.title === stepTitle);
    setActiveStep(newActiveStep);
  };

  const handleBack = (hasError?: boolean) => {
    updateErrorSteps(hasError);
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleNext = async (hasError?: boolean) => {
    updateErrorSteps(hasError);

    if (steps[activeStep].id === CreateTenantStepEnum.PREVIEW) {
      await onSubmitTenant();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const getRequestBody = (): Tenant => {
    const formValues = formMethods.getValues();

    return {
      ...formValues,
      settings: buildThemingRequestBody(formValues.settings),
      sso_config: buildSSOConfigRequestBody(formMethods.getValues('sso_config')),
      document_types: parseDocumentTypes(formMethods.getValues('document_types')),
      document_data_sources: buildDocumentDataSourcesRequestBody(formMethods.getValues('document_data_sources')),
    };
  };

  const onSubmitTenant = async () => {
    const requestBody = getRequestBody();

    try {
      const responseData = await createTenant.mutateAsync(requestBody);

      setAccountId(responseData.id);
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
  };

  return (
    <Stack direction="row" gap={3} sx={{ height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      <FormProvider {...formMethods}>
        <Box component="form" sx={{ width: '50%' }}>
          {getStepContent(steps[activeStep].id, handleNext, handleBack, handleEdit)}
        </Box>
      </FormProvider>

      <Box sx={{ width: '50%', paddingX: 3 }}>
        <Stepper orientation="vertical" activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step.id} completed={index < activeStep || activeStep === steps.length - 1}>
              <StepLabel error={errorSteps[index]} optional={step.subTitle}>
                {step.title}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Stack>
  );
};
