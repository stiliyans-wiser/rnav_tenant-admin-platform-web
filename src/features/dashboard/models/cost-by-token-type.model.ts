import { DailyUsageResponse } from '@/features/dashboard/interfaces/daily-usage-response.interface';
import { CostPerTokenResponse } from '@/features/dashboard/interfaces/cost-per-token-response.interface';

export class CostByTokenType {
  date: string;
  inputTokensCost: number;
  outputTokensCost: number;

  constructor(dailyUsage: DailyUsageResponse, costPerToken: CostPerTokenResponse) {
    this.date = dailyUsage.date;
    this.inputTokensCost = dailyUsage.inputTokens * costPerToken.input;
    this.outputTokensCost = dailyUsage.outputTokens * costPerToken.output;
  }
}