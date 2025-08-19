import { Paper, Typography, Stack } from '@mui/material';
import { NoData } from '@/features/dashboard/components/NoData';
import { formatNumber } from '@/features/dashboard/utils/formatNumberUtil';

interface InputTokensWidgetProps {
  inputTokens?: number;
}

export const InputTokensWidget = ({ inputTokens }: InputTokensWidgetProps) => {
  const renderInputTokenCount = () => (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h4">{formatNumber(inputTokens)}</Typography>
    </Stack>
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Input Tokens
      </Typography>

      {inputTokens ? renderInputTokenCount() : <NoData />}
    </Paper>
  );
};
