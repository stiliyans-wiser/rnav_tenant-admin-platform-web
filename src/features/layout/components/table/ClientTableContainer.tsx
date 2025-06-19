'use client';

import { Box, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface ClientTableContainerProps {
  filterChildren: ReactNode;
  tableChildren: ReactNode;
}

export const ClientTableContainer = ({ filterChildren, tableChildren }: ClientTableContainerProps) => {
  return (
    <Box>
      {filterChildren && <Box sx={{ mb: 3 }}>{filterChildren}</Box>}
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          overflow: 'hidden',
        }}
      >
        {tableChildren}
      </Paper>
    </Box>
  );
};
