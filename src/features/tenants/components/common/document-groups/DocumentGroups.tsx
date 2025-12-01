import React, { useState, useMemo } from 'react';
import { Stack, Button, Grid } from '@mui/material';
import { Add } from '@carbon/icons-react';
import { useGetTenantDocumentGroups } from '@/features/tenants/hooks/useGetTenantDocumentGroups';
import { useDeleteTenantDocumentGroup } from '@/features/tenants/hooks/useDeleteTenantDocumentGroup';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';
import { ConfirmDialog } from '@/features/common/components/dialogs/ConfirmDialog';
import { AddEditDocumentGroup } from '@/features/tenants/components/common/document-groups/AddEditDocumentGroup';
import { EmptyDocumentGroupsState } from '@/features/tenants/components/common/document-groups/EmptyDocumentGroupsState';
import { DocumentGroupItem } from '@/features/tenants/components/common/document-groups/DocumentGroupItem';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';
import { DocumentGroupsLayoutEnum } from '@/features/tenants/enums/document-groups-layout.enum';

interface DocumentGroupsProps {
  tenantId: string;
  layout?: DocumentGroupsLayoutEnum;
}

export const DocumentGroups = ({ tenantId, layout = DocumentGroupsLayoutEnum.COLUMN }: DocumentGroupsProps) => {
  const [openAddEditDrawer, setOpenAddEditDrawer] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<DocumentGroup>();

  const { data: documentGroups } = useGetTenantDocumentGroups(tenantId);
  const deleteTenantDocumentGroup = useDeleteTenantDocumentGroup(tenantId);

  const handleAddEditGroup = (group: DocumentGroup, isOpen: boolean) => {
    setSelectedGroup(group);
    setOpenAddEditDrawer(isOpen);
  };

  const handleDeleteGroup = (group: DocumentGroup, isOpen: boolean) => {
    setSelectedGroup(group);
    setOpenDeleteDialog(isOpen);
  };

  const confirmDelete = () => {
    if (selectedGroup?.slug) {
      deleteTenantDocumentGroup.mutate(selectedGroup.slug, {
        onSuccess: () => {
          handleDeleteGroup(null, false);
        },
        onError: error => {
          console.error('Error deleting document group:', error);
        },
      });
    }
  };

  const renderDocumentGroupItem = useMemo(() => {
    return (group: DocumentGroup) => (
      <DocumentGroupItem
        key={group.name}
        group={group}
        onEdit={() => handleAddEditGroup(group, true)}
        onDelete={() => handleDeleteGroup(group, true)}
      />
    );
  }, [handleAddEditGroup, handleDeleteGroup]);

  const renderDocumentGroupItems = useMemo(() => {
    if (layout === DocumentGroupsLayoutEnum.GRID) {
      return (
        <Grid container spacing={3}>
          {documentGroups?.map(group => (
            <Grid key={group.name} size={4}>
              {renderDocumentGroupItem(group)}
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <Stack spacing={3}>
        {documentGroups?.map(group => renderDocumentGroupItem(group))}

        <Button
          variant="contained"
          color="secondary"
          sx={{ alignSelf: 'flex-start' }}
          startIcon={<Add size={16} />}
          onClick={() => handleAddEditGroup(null, true)}
        >
          Create Group Type
        </Button>
      </Stack>
    );
  }, [documentGroups, layout, renderDocumentGroupItem, handleAddEditGroup]);

  return (
    <>
      {documentGroups?.length ? (
        <Stack spacing={3}>{renderDocumentGroupItems}</Stack>
      ) : (
        <EmptyDocumentGroupsState
          showCreateButton={layout === DocumentGroupsLayoutEnum.COLUMN}
          onAddGroup={() => handleAddEditGroup(null, true)}
        />
      )}

      <CustomDrawer
        open={openAddEditDrawer}
        drawerSxProps={{ width: '40%' }}
        title={selectedGroup ? 'Edit Group Type' : 'Create Group Type'}
        handleClose={() => handleAddEditGroup(null, false)}
      >
        <AddEditDocumentGroup tenantId={tenantId} documentGroup={selectedGroup} onClose={() => handleAddEditGroup(null, false)} />
      </CustomDrawer>

      <ConfirmDialog
        title={`Are you sure you want to delete "${selectedGroup?.name}"?`}
        isOpen={openDeleteDialog}
        handleClose={() => handleDeleteGroup(null, false)}
        handleConfirm={confirmDelete}
      />
    </>
  );
};
