import { Add } from '@carbon/icons-react';
import { Button } from '@mui/material';
import { useState } from 'react';
import { CustomDialog } from '@/features/common/components/dialogs/CustomDialog';
import { AddEditDocumentType } from '@/features/document-types/components/create/AddEditDocumentType';

export const DocumentTypeActionControls = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <>
      <Button variant="contained" startIcon={<Add size={20} />} onClick={() => setOpenAddDialog(true)}>
        New Document Type
      </Button>

      {openAddDialog && (
        <CustomDialog title="Add document type" handleClose={() => setOpenAddDialog(false)}>
          <AddEditDocumentType onClose={() => setOpenAddDialog(false)} />
        </CustomDialog>
      )}
    </>
  );
};
