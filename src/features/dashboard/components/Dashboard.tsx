'use client';

import { Stack } from '@mui/material';
import { InputTokensWidget } from '@/features/dashboard/components/InputTokensWidget';
import { OutputTokensWidget } from '@/features/dashboard/components/OutputTokensWidget';
import { CostVsLastPeriodWidget } from '@/features/dashboard/components/CostVsLastPeriodWidget';
import { CostByModelWidget } from '@/features/dashboard/components/CostByModelWidget';
import { CostByTokenTypeWidget } from '@/features/dashboard/components/CostByTokenTypeWidget';
import { AiUsageDashboard } from '@/features/dashboard/models/ai-usage-dashboard.model';
import { CostSummaryWidget } from '@/features/dashboard/components/CostSummaryWidget';

interface DashboardProps {
  data?: AiUsageDashboard;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }: DashboardProps) => {
  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} sx={{ flex: 1 }}>
        <CostByModelWidget data={data?.costByModel} />
        <CostByTokenTypeWidget data={data?.costByTokenType} />
      </Stack>

      <Stack direction="row" gap={2}>
        <InputTokensWidget inputTokens={data?.inputTokens} />
        <OutputTokensWidget outputTokens={data?.outputTokens} />
      </Stack>

      <Stack direction="row" gap={2}>
        <CostSummaryWidget data={data?.summaryForPeriod} />
        <CostVsLastPeriodWidget data={data?.previousPeriodCost} />
      </Stack>
    </Stack>
  );
};
