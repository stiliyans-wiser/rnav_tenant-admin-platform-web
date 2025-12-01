import { Box, Paper, Typography, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NoData } from './NoData';
import useChartColors from '@/features/theming/hooks/useChartColors';
import { CostByModel } from '@/features/dashboard/models/cost-by-model.model';

interface CostByModelWidgetProps {
  data?: CostByModel;
}

export const CostByModelWidget = ({ data }: CostByModelWidgetProps) => {
  const theme = useTheme();
  const colors = useChartColors();

  return (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '480px', p: 2, flex: '1' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Cost by Model
      </Typography>

      {!data?.chartData?.length ? (
        <NoData />
      ) : (
        <Box sx={{ height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data.chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                tickLine={false}
                dataKey="date"
                label={{
                  dy: 0,
                  style: {
                    textAnchor: 'middle',
                    fontSize: theme.typography.body2.fontSize,
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: theme.typography.body2.fontWeight,
                    fill: theme.palette.text.primary,
                  },
                }}
              />
              <YAxis
                label={{
                  dy: 0,
                  dx: -20,
                  style: {
                    textAnchor: 'middle',
                    fontSize: theme.typography.body2.fontSize,
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: theme.typography.body2.fontWeight,
                    fill: theme.palette.text.primary,
                  },
                }}
              />
              <Tooltip />
              <Legend />
              {data.uniqueModels.map((modelName, index) => (
                <Line
                  key={modelName}
                  type="monotone"
                  dataKey={modelName}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                  name={modelName}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
