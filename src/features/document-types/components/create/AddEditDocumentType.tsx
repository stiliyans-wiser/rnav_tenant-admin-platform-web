import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Divider, Stack, Tab, Tabs } from '@mui/material';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { useState } from 'react';
import { useCreateDocumentType } from '@/features/document-types/hooks/useCreateDocumentType';
import { useUpdateDocumentType } from '@/features/document-types/hooks/useUpdateDocumentType';
import { AddEditForm } from '@/features/document-types/interfaces/add-edit-form.interface';
import { GeneralTab } from './GeneralTab';
import { BriefTab } from './BriefTab';

interface AddEditDocumentTypeProps {
  onClose: () => void;
  documentType?: DocumentType;
}

export const AddEditDocumentType = ({ onClose, documentType }: AddEditDocumentTypeProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const formMethods = useForm<AddEditForm>({
    defaultValues: {
      name: documentType?.name || '',
      description: documentType?.description || '',
      metadata_fields: documentType?.metadata_fields || [],
      brief_metadata: {
        prefix_prompt: documentType?.brief_metadata?.prefix_prompt || '',
        suffix_prompt: documentType?.brief_metadata?.suffix_prompt || '',
        metadata_fields: documentType?.brief_metadata?.metadata_fields || [],
      },
    },
    mode: 'onChange',
  });

  const createDocumentType = useCreateDocumentType();
  const updateDocumentType = useUpdateDocumentType();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const onSubmit = async (formValue: AddEditForm) => {
    try {
      if (documentType?.id) {
        await updateDocumentType.mutateAsync({
          id: documentType.id,
          documentType: { ...formValue },
        });
      } else {
        await createDocumentType.mutateAsync({ ...formValue });
      }
      onClose();
    } catch (error) {
      console.error('Error saving document type:', error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Stack component="form" sx={{ height: '100%' }} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="General" />
            <Tab label="Brief" />
          </Tabs>
        </Box>

        <Stack sx={{ justifyContent: 'space-between', flex: 1 }}>
          {activeTab === 0 && <GeneralTab documentType={documentType} />}
          {activeTab === 1 && <BriefTab documentType={documentType} />}

          <Stack>
            <Divider sx={{ marginY: 3 }} />
            <Stack direction="row" gap={2} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={!formMethods.formState.isValid}>
                {documentType ? 'Edit' : 'Create'}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  );
};
