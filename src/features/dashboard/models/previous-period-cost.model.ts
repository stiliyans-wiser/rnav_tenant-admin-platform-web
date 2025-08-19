import { PreviousPeriodCostResponse } from '@/features/dashboard/interfaces/previous-period-cost-response.interface';

export class PreviousPeriodCost {
  currentPeriodCost: number;
  previousPeriodCost: number;
  costDifference: number;

  constructor(response: PreviousPeriodCostResponse) {
    this.currentPeriodCost = response.current_period_cost;
    this.previousPeriodCost = response.previous_period_cost;
    this.costDifference = response.cost_difference;
  }
}
