import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';

export interface UIConfigData {
  company_name: string;
  match_config?: MatchConfig;
}

interface UIConfigViewProps {
  data: UIConfigData;
}

const BoolIcon = ({ value }: { value: boolean }) =>
  value ? (
    <IconButton color="primary" sx={{ p: 0 }}>
      <CheckmarkFilled />
    </IconButton>
  ) : (
    <IconButton color="error" sx={{ p: 0 }}>
      <Misuse />
    </IconButton>
  );

export const UIConfigView = ({ data }: UIConfigViewProps) => {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Show AI Copilot tab</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(data.match_config?.show_ai_copilot)} />
          </Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Show rank explanations</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(data.match_config?.show_rank_explanation)} />
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
