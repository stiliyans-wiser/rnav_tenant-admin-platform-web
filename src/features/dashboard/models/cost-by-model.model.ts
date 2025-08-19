interface CostByModelChartData {
  date: string;
  [modelName: string]: string | number; // date is string, model values are numbers
}

export class CostByModel {
  chartData: CostByModelChartData[];
  uniqueModels: string[];

  constructor(dailyUsagePerModel: { [key: string]: { [key: string]: number } }) {
    const rawCostByModel = Object.entries(dailyUsagePerModel).map(([date, models]) => {
      return {
        date,
        models,
      };
    });

    if (!rawCostByModel?.length) {
      this.chartData = [];
      this.uniqueModels = [];
      return;
    }

    // Get all unique model names
    const modelNames = new Set<string>();
    rawCostByModel.forEach(item => {
      Object.keys(item.models).forEach(model => modelNames.add(model));
    });

    this.uniqueModels = Array.from(modelNames);

    // Transform data to have consistent structure for all dates
    this.chartData = rawCostByModel.map(item => {
      const dataPoint: CostByModelChartData = { date: item.date };

      // Add all models to each data point, setting to 0 if not present
      this.uniqueModels.forEach(model => {
        dataPoint[model] = item.models[model] || 0;
      });

      return dataPoint;
    });
  }
}
