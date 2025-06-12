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
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';

enum CreateTenantStepEnum {
  GENERAL_DETAILS = 'General Details',
  BRAND_THEMING = 'Brand & Theming',
  AI_SERVICES = 'AI Services',
  SSO = 'SSO',
  DOCUMENTS = 'Documents',
  PREVIEW = 'Preview',
}

interface CreateTenantStep {
  id: CreateTenantStepEnum;
  title: string;
}

const steps: CreateTenantStep[] = [
  {
    id: CreateTenantStepEnum.GENERAL_DETAILS,
    title: 'General Details',
  },
  {
    id: CreateTenantStepEnum.BRAND_THEMING,
    title: 'Brand & Theming',
  },
  {
    id: CreateTenantStepEnum.AI_SERVICES,
    title: 'AI Services',
  },
  {
    id: CreateTenantStepEnum.SSO,
    title: 'SSO',
  },
  {
    id: CreateTenantStepEnum.DOCUMENTS,
    title: 'Documents',
  },
  {
    id: CreateTenantStepEnum.PREVIEW,
    title: 'Preview & Create tenant',
  },
];

const getStepContent = (
  stepId: string,
  onNext: (hasError?: boolean) => void,
  onBack: (hasError?: boolean) => void,
  onEdit: (stepTitle: string) => void,
  isFirstStep: boolean,
  isLastStep: boolean,
) => {
  switch (stepId) {
    case CreateTenantStepEnum.GENERAL_DETAILS:
      return <GeneralDetailsStep onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />;
    case CreateTenantStepEnum.BRAND_THEMING:
      return <BrandAndThemingStep onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />;
    case CreateTenantStepEnum.AI_SERVICES:
      return <AIServicesStep onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />;
    case CreateTenantStepEnum.SSO:
      return <SSOStep onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />;
    case CreateTenantStepEnum.DOCUMENTS:
      return <DocumentsStep onNext={onNext} onBack={onBack} isFirstStep={isFirstStep} isLastStep={isLastStep} />;
    case CreateTenantStepEnum.PREVIEW:
      return <PreviewStep onNext={onNext} onBack={onBack} onEdit={onEdit} />;
    default:
      return null;
  }
};

export const CreateTenant = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errorSteps, setErrorSteps] = useState<boolean[]>(Array(steps.length).fill(false));

  const { setAdminConfig, setDocumentTypes, selectedDocumentTypes } = useCreateTenantContext();

  const { data: adminConfig } = useGetAdminConfig();
  const { data: documentTypes } = useGetDocumentTypes();

  const formMethods = useForm<Tenant>({
    mode: 'onChange',
  });

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

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

    if (isLastStep) {
      const requestBody = getRequestBody();

      try {
        await createTenant.mutateAsync(requestBody);
      } catch (error) {
        console.error('Error saving document type:', error);
      }
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const getRequestBody = (): Tenant => {
    const requestBody = {
      ...formMethods.getValues(),
      sso_config: {
        ...formMethods.getValues('sso_config'),
        scopes: JSON.parse(formMethods.getValues('sso_config.scopes')),
      },
      document_types: selectedDocumentTypes,
    };

    if (!requestBody.settings.logos?.light) {
      delete requestBody.settings.logos;
    } else {
      if (!requestBody.settings.logos?.dark) {
        requestBody.settings.logos.dark = { ...requestBody.settings.logos.light };
      }
    }

    delete requestBody.settings.has_dark_logo;

    return requestBody;
  };

  return (
    <Stack direction="row" gap={3} sx={{ height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      <FormProvider {...formMethods}>
        <Box component="form" sx={{ width: '50%' }}>
          {getStepContent(steps[activeStep].id, handleNext, handleBack, handleEdit, isFirstStep, isLastStep)}
        </Box>
      </FormProvider>

      <Box sx={{ width: '50%', paddingX: 3 }}>
        <Stepper orientation="vertical" activeStep={activeStep} nonLinear>
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel error={errorSteps[index]}>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Stack>
  );
};
