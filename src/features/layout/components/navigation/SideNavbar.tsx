'use client';

import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Group as TenantsIcon, SettingsAdjust, Dashboard as DashboardIcon } from '@carbon/icons-react';
import { NavItemRoute } from '@/features/layout/interfaces/nav-item-route.interface';
import { SettingsNavbar } from '@/features/layout/components/navigation/SettingsNavbar';

const sideNavRoutes: NavItemRoute[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    href: '/tenants',
    label: 'Tenants',
    icon: <TenantsIcon />,
  },
  {
    href: '/settings/document-types',
    label: 'Configuration',
    icon: <SettingsAdjust />,
  },
];

export const SideNavbar = () => {
  const pathname = usePathname();

  const isSettingsRouteActive = pathname.includes('/settings');

  return (
    <Paper variant="outlined" square data-testid="sideNavigation" sx={{ height: '100%', paddingX: 3, paddingY: 2, overflow: 'auto' }}>
      <List component="nav" data-testid="sideNavigationRoutes">
        {sideNavRoutes.map(route => (
          <ListItemButton key={route.href} component={Link} href={route.href} selected={pathname === route.href}>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText>{route.label}</ListItemText>
          </ListItemButton>
        ))}
      </List>

      <Divider variant="middle" sx={{ paddingY: 1 }} />

      {isSettingsRouteActive && <SettingsNavbar />}
    </Paper>
  );
};
