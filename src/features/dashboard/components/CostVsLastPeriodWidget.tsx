import { Paper, Stack, Typography } from '@mui/material';
import { ArrowDown, ArrowUp } from '@carbon/icons-react';
import { formatNumber } from '@/features/dashboard/utils/formatNumberUtil';
import { NoData } from '@/features/dashboard/components/NoData';
import { PreviousPeriodCost } from '@/features/dashboard/models/previous-period-cost.model';

interface CostVsLastPeriodWidgetProps {
  data?: PreviousPeriodCost;
}

export const CostVsLastPeriodWidget = ({ data }: CostVsLastPeriodWidgetProps) => {
  const isCostIncreased = data?.currentPeriodCost > data?.previousPeriodCost;
  const color = isCostIncreased ? 'error.main' : 'success.main';

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Cost vs Last Period
      </Typography>

      {data ? (
        <Stack direction="row" gap={2} sx={{ justifyContent: 'center', alignItems: 'center', flex: 1, height: 200 }}>
          <Typography variant="h4">${formatNumber(data?.currentPeriodCost)}</Typography>

          <Stack direction="row" sx={{ alignItems: 'center', color }}>
            {isCostIncreased ? <ArrowUp /> : <ArrowDown />}
            <Typography variant="h5">${formatNumber(data?.previousPeriodCost)}</Typography>
          </Stack>
        </Stack>
      ) : (
        <NoData />
      )}
    </Paper>
  );
};
