'use client';

import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Group as TenantsIcon } from '@carbon/icons-react';

const sideNavRoutes = [{
  href: '/tenants',
  label: 'Tenants',
  icon: <TenantsIcon />,
}]

export const SideNavbar = () => {
  const pathname = usePathname();

  return (
    <Paper variant="outlined" square data-testid="sideNavigation" sx={{ height: '100%', paddingX: 3, paddingY: 2, overflow: 'auto' }}>
      <List component="nav" data-testid="sideNavigationRoutes">
        {sideNavRoutes.map(route => (
          <ListItemButton
            key={route.href}
            component={Link}
            href={route.href}
            selected={pathname === route.href}
          >
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText>{route.label}</ListItemText>
          </ListItemButton>
        ))}

      </List>
    </Paper>
  );
};
