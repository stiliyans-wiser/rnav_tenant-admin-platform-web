import { Add } from '@carbon/icons-react';
import { Button } from '@mui/material';
import { useState } from 'react';
import { AddEditDocumentType } from '@/features/document-types/components/create/AddEditDocumentType';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';

export const DocumentTypeActionControls = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <>
      <Button variant="contained" startIcon={<Add size={20} />} onClick={() => setOpenAddDialog(true)}>
        New Document Type
      </Button>

      <CustomDrawer
        title="Add document type"
        open={openAddDialog}
        drawerSxProps={{ width: '30%' }}
        handleClose={() => setOpenAddDialog(false)}
      >
        <AddEditDocumentType onClose={() => setOpenAddDialog(false)} />
      </CustomDrawer>
    </>
  );
};
