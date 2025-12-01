import { useState } from 'react';
import { Button } from '@mui/material';
import { Add } from '@carbon/icons-react';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';
import { AddUser } from '@/features/users/components/create/AddUser';

export const UserActionControls = () => {
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

  return (
    <>
      <Button variant="contained" startIcon={<Add size={20} />} onClick={() => setOpenAddDialog(true)}>
        New User
      </Button>

      <CustomDrawer title="Add user" open={openAddDialog} drawerSxProps={{ width: '30%' }} handleClose={() => setOpenAddDialog(false)}>
        <AddUser onClose={() => setOpenAddDialog(false)} />
      </CustomDrawer>
    </>
  );
};
