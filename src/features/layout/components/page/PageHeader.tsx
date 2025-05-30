import React, { type ReactElement } from 'react';
import { Breadcrumbs, Typography, Box, Stack } from '@mui/material';
import Link from '@mui/material/Link';

interface Breadcrumb {
  labelKey: string;
  href: string;
  icon?: ReactElement;
}

interface PageHeaderProps {
  titleKey: string;
  breadcrumbs?: Breadcrumb[];
  actionChildren?: React.ReactNode;
}

const PageHeader = ({ titleKey, breadcrumbs, actionChildren }: PageHeaderProps) => {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
      <Box>
        <Breadcrumbs>
          {breadcrumbs?.map((crumb, index) => (
            <Link underline="hover" color="inherit" key={index} href={crumb.href} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 0.5 }}>
                {crumb.icon}
              </Box>

              <Box component="span">{crumb.labelKey}</Box>
            </Link>
          ))}
        </Breadcrumbs>

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h4">{titleKey}</Typography>
        </Stack>
      </Box>

      <Box>{actionChildren}</Box>
    </Stack>
  );
};

export default PageHeader;
