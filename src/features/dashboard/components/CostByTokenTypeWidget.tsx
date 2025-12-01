import { Box, Paper, Typography, useTheme } from '@mui/material';
import { NoData } from './NoData';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useChartColors from '@/features/theming/hooks/useChartColors';
import { CostByTokenType } from '@/features/dashboard/models/cost-by-token-type.model';

interface CostByTokenTypeWidgetProps {
  data: CostByTokenType[];
}

export const CostByTokenTypeWidget = ({ data }: CostByTokenTypeWidgetProps) => {
  const theme = useTheme();
  const colors = useChartColors();

  return (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '480px', p: 2, flex: '1' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Cost by Token Type
      </Typography>

      {!data?.length ? (
        <NoData />
      ) : (
        <Box sx={{ height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
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
              <Line type="monotone" dataKey="outputTokensCost" stroke={colors[7]} strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="inputTokensCost" stroke={colors[3]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
