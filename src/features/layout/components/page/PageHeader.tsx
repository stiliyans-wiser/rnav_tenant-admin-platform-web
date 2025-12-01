'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  titleKey: string;
  actionChildren?: ReactNode;
}

const PageHeader = ({ titleKey, actionChildren }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        {titleKey}
      </Typography>
      {actionChildren && <Box>{actionChildren}</Box>}
    </Box>
  );
};

export default PageHeader;
