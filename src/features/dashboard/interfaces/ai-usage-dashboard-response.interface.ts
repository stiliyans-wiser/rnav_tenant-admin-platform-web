import { DailyUsageResponse } from '@/features/dashboard/interfaces/daily-usage-response.interface';
import { CostPerTokenResponse } from '@/features/dashboard/interfaces/cost-per-token-response.interface';
import { PreviousPeriodCostResponse } from '@/features/dashboard/interfaces/previous-period-cost-response.interface';
import { SummaryForPeriodResponse } from '@/features/dashboard/interfaces/summary-for-period-response.interface';

export interface AiUsageDashboardResponse {
  availability: boolean;
  inputTokens: number;
  outputTokens: number;
  costSummary: number;
  costByModel: any;
  costByToken: any;
  dailyUsage: DailyUsageResponse[];
  dailyUsagePerModel: { [key: string]: { [key: string]: number } };
  typeToCostPerToken: CostPerTokenResponse;
  previous_period_cost: PreviousPeriodCostResponse;
  summary_for_period: SummaryForPeriodResponse;
}
