import { Paper, Typography, Box } from '@mui/material';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { NoData } from '@/features/dashboard/components/NoData';
import { SummaryForPeriod } from '@/features/dashboard/models/summary-for-period.model';
import { formatNumber } from '@/features/dashboard/utils/formatNumberUtil';
import useChartColors from '@/features/theming/hooks/useChartColors';

interface CostSummaryWidgetProps {
  data?: SummaryForPeriod;
}

export const CostSummaryWidget = ({ data }: CostSummaryWidgetProps) => {
  const colors = useChartColors();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0];

      return (
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Typography variant="body2">
            {data.name}: ${formatNumber(data.value, 2)}
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Cost Summary
      </Typography>

      {data?.pieData?.length ? (
        <Box sx={{ position: 'relative', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90}>
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 5 }} />
            </PieChart>
          </ResponsiveContainer>

          <Typography
            variant="h4"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            ${formatNumber(data.totalCost, 2)}
          </Typography>
        </Box>
      ) : (
        <NoData />
      )}
    </Paper>
  );
};
