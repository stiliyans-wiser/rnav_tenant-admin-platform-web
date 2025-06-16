import { useFormContext } from 'react-hook-form';
import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse, SettingsServices } from '@carbon/icons-react';
import { PreviewTenantStepLayout } from '@/features/tenants/components/create/layouts/PreviewTenantStepLayout';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';

export const AIServicesPreview = ({ onEdit }: CreateTenantPreviewProps) => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <PreviewTenantStepLayout
      stepTitle="AI Services"
      stepIcon={<SettingsServices size={24} />}
      onEdit={onEdit}
    >
      <Stack gap={4}>
        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">AI tool</Typography>
            <Typography variant="subtitle2">
              {formValues.ai_config.open_ai_type}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Include web search</Typography>
            <Typography variant="subtitle2">
              {formValues.ai_config.web_search ? (
                <IconButton color="primary" sx={{ p: 0 }}>
                  <CheckmarkFilled />
                </IconButton>
              ) : (
                <IconButton color="error" sx={{ p: 0 }}>
                  <Misuse />
                </IconButton>
              )}
            </Typography>
          </Stack>

          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Embedding model</Typography>
            <Typography variant="subtitle2">
              {formValues.ai_config.open_ai_embedding_model}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Temperature</Typography>
            <Typography variant="subtitle2">
              {formValues.ai_config.temperature}
            </Typography>
          </Stack>

          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Open AI key</Typography>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {formValues.ai_config.open_ai_key}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Open AI version</Typography>
            <Typography variant="subtitle2">
              {formValues.ai_config.open_ai_version}
            </Typography>
          </Stack>

          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Open AI endpoint</Typography>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {formValues.ai_config.open_ai_endpoint}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </PreviewTenantStepLayout>
  );
};
