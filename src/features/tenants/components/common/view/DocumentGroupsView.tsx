import { useState } from 'react';
import { Stack, Typography, Button, Paper } from '@mui/material';
import { GroupObjectsNew, Add } from '@carbon/icons-react';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';
import { DocumentGroups } from '@/features/tenants/components/common/document-groups/DocumentGroups';
import { AddEditDocumentGroup } from '@/features/tenants/components/common/document-groups/AddEditDocumentGroup';
import { DocumentGroupsLayoutEnum } from '@/features/tenants/enums/document-groups-layout.enum';

interface DocumentGroupsViewProps {
  tenantId: string;
}

export const DocumentGroupsView = ({ tenantId }: DocumentGroupsViewProps) => {
  const [openAddGroupDrawer, setOpenAddGroupDrawer] = useState<boolean>(false);

  return (
    <>
      <Paper variant="outlined" sx={{ height: '100%', p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
              <GroupObjectsNew size={24} />
              <Typography variant="h6">Group Types</Typography>
            </Stack>

            <Button variant="contained" color="secondary" startIcon={<Add size={16} />} onClick={() => setOpenAddGroupDrawer(true)}>
              Create Group Type
            </Button>
          </Stack>

          <DocumentGroups tenantId={tenantId} layout={DocumentGroupsLayoutEnum.GRID} />
        </Stack>
      </Paper>

      <CustomDrawer
        open={openAddGroupDrawer}
        drawerSxProps={{ width: '40%' }}
        title="Create Group Type"
        handleClose={() => setOpenAddGroupDrawer(false)}
      >
        <AddEditDocumentGroup tenantId={tenantId} documentGroup={null} onClose={() => setOpenAddGroupDrawer(false)} />
      </CustomDrawer>
    </>
  );
};
