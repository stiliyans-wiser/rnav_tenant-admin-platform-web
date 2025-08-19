'use client';

import { Box, Typography } from '@mui/material';

interface NoDataProps {
  message?: string;
}

export const NoData: React.FC<NoDataProps> = ({ message = 'No data available' }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
