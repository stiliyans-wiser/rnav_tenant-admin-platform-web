import { SummaryForPeriodResponse } from '@/features/dashboard/interfaces/summary-for-period-response.interface';

interface SummaryForPeriodPieData {
  name: string;
  value: number;
}

export class SummaryForPeriod {
  pieData: SummaryForPeriodPieData[];
  totalCost: number;

  constructor(summaryData: SummaryForPeriodResponse) {
    this.totalCost = summaryData.total_cost;

    this.pieData = [
      { name: 'Input', value: summaryData.input_cost },
      { name: 'Output', value: summaryData.output_cost },
    ];
  }
}
