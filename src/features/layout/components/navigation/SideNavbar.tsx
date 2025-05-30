import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Group as TenantsIcon } from '@carbon/icons-react';

export const SideNavbar = () => {
  const location = useLocation();

  return (
    <Paper variant="outlined" square data-testid="sideNavigation" sx={{ height: '100%', paddingX: 3, paddingY: 2, overflow: 'auto' }}>
      <List component="nav" data-testid="sideNavigationRoutes">
        <ListItemButton
          component={Link}
          to="/tenants"
          selected={location.pathname === '/tenants'}
        >
          <ListItemIcon>
            <TenantsIcon />
          </ListItemIcon>
          <ListItemText primary="Tenants" />
        </ListItemButton>
      </List>
    </Paper>
  );
};
