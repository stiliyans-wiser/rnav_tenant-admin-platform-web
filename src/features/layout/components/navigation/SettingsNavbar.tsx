import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavItemRoute } from '@/features/layout/interfaces/nav-item-route.interface';

const settingsNavRoutes: NavItemRoute[] = [
  {
    href: '/settings/document-types',
    label: 'Document types',
  },
];

export const SettingsNavbar = () => {
  const pathname = usePathname();

  return (
    <List component="nav">
      {settingsNavRoutes.map(route => (
        <ListItemButton key={route.href} component={Link} href={route.href} selected={pathname.includes(route.href)}>
          {route.icon && <ListItemIcon>{route.icon}</ListItemIcon>}
          <ListItemText>{route.label}</ListItemText>
        </ListItemButton>
      ))}
    </List>
  );
};
