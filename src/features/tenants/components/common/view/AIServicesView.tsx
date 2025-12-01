import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';

export interface AIServicesData {
  company_name: string;
  ai_config: AIConfig;
}

interface AIServicesViewProps {
  data: AIServicesData;
}

export const AIServicesView = ({ data }: AIServicesViewProps) => {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">AI tool</Typography>
          <Typography variant="subtitle2">{data.ai_config.open_ai_type}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Include web search</Typography>
          <Typography variant="subtitle2">
            {data.ai_config.web_search ? (
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
          <Typography variant="subtitle2">{data.ai_config.open_ai_embedding_model}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Temperature</Typography>
          <Typography variant="subtitle2">{data.ai_config.temperature}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Open AI key</Typography>
          <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
            {data.ai_config.open_ai_key}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Open AI version</Typography>
          <Typography variant="subtitle2">{data.ai_config.open_ai_version}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Open AI endpoint</Typography>
          <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
            {data.ai_config.open_ai_endpoint}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
