import { Paper, Typography, Stack } from '@mui/material';
import { NoData } from '@/features/dashboard/components/NoData';
import { formatNumber } from '@/features/dashboard/utils/formatNumberUtil';

interface OutputTokensWidgetProps {
  outputTokens?: number;
}

export const OutputTokensWidget = ({ outputTokens }: OutputTokensWidgetProps) => {
  const renderOutputTokenCount = () => (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h4">{formatNumber(outputTokens)}</Typography>
    </Stack>
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Output Tokens
      </Typography>

      {outputTokens ? renderOutputTokenCount() : <NoData />}
    </Paper>
  );
};
