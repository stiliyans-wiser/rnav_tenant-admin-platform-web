import { Box } from '@mui/system';
import React from 'react';
import { Paper } from '@mui/material';

interface ClientTableContainerProps {
  filterChildren: React.ReactNode;
  tableChildren: React.ReactNode;
}

export const ClientTableContainer = ({ filterChildren, tableChildren }: ClientTableContainerProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>{filterChildren}</Box>
      <Box>{tableChildren}</Box>
    </Paper>
  );
};
