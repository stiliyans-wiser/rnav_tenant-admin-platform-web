import { AiUsageDashboardResponse } from '@/features/dashboard/interfaces/ai-usage-dashboard-response.interface';
import { CostByModel } from '@/features/dashboard/models/cost-by-model.model';
import { CostByTokenType } from '@/features/dashboard/models/cost-by-token-type.model';
import { SummaryForPeriod } from '@/features/dashboard/models/summary-for-period.model';
import { PreviousPeriodCost } from '@/features/dashboard/models/previous-period-cost.model';

export class AiUsageDashboard {
  inputTokens: number;
  outputTokens: number;
  costByTokenType: CostByTokenType[];
  costByModel: CostByModel;
  summaryForPeriod: SummaryForPeriod;
  previousPeriodCost: PreviousPeriodCost;

  constructor(response: AiUsageDashboardResponse) {
    this.inputTokens = response.inputTokens;
    this.outputTokens = response.outputTokens;
    this.costByTokenType = response.dailyUsage?.map(dailyUsage => new CostByTokenType(dailyUsage, response.typeToCostPerToken));
    this.costByModel = new CostByModel(response.dailyUsagePerModel);
    this.previousPeriodCost = new PreviousPeriodCost(response.previous_period_cost);
    this.summaryForPeriod = new SummaryForPeriod(response.summary_for_period);
  }
}
