import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { ExtractionConfig } from '@/features/tenants/interfaces/extraction-config.interface';

export interface ExtractionData {
  company_name: string;
  extraction_config?: ExtractionConfig;
}

interface ExtractionViewProps {
  data: ExtractionData;
}

export const ExtractionView = ({ data }: ExtractionViewProps) => {
  const includeReasoning = data.extraction_config?.include_reasoning ?? false;

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Include AI Reasoning</Typography>
          <Typography variant="subtitle2">
            {includeReasoning ? (
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
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {includeReasoning
          ? 'AI explains why each skill was extracted. Increases extraction cost by ~15-25%.'
          : 'Skills extracted without explanation. Reduces extraction cost.'}
      </Typography>
    </Stack>
  );
};
