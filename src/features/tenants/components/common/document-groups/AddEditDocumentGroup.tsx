import { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Stack, Button, Box, Divider } from '@mui/material';
import { useCreateTenantDocumentGroup } from '@/features/tenants/hooks/useCreateTenantDocumentGroup';
import { useUpdateTenantDocumentGroup } from '@/features/tenants/hooks/useUpdateTenantDocumentGroup';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { MetadataFieldsSection } from '@/features/common/components/metadata-fields/MetadataFieldsSection';
import { MetadataFieldPathEnum } from '@/features/common/enums/metadata-field-path.enum';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

interface AddEditDocumentGroupProps {
  tenantId: string;
  documentGroup: DocumentGroup | null;
  onClose: () => void;
}

export const AddEditDocumentGroup = ({ tenantId, documentGroup, onClose }: AddEditDocumentGroupProps) => {
  const formMethods = useForm<DocumentGroup>({
    mode: 'onChange',
    defaultValues: {
      name: documentGroup?.name || '',
      description: documentGroup?.description || '',
      metadata: documentGroup?.metadata || [],
    },
  });
  const { control, formState, trigger, handleSubmit, getValues } = formMethods;

  const createTenantDocumentGroup = useCreateTenantDocumentGroup(tenantId);
  const updateTenantDocumentGroup = useUpdateTenantDocumentGroup(tenantId);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit = async () => {
    const formData = getValues();

    try {
      if (documentGroup?.slug) {
        await updateTenantDocumentGroup.mutateAsync({
          groupSlug: documentGroup.slug,
          documentGroup: formData,
        });
      } else {
        await createTenantDocumentGroup.mutateAsync(formData);
      }

      onClose();
    } catch (error) {
      console.error(`Error saving document group:`, error);
    }
  };

  const isLoading = createTenantDocumentGroup.isPending || updateTenantDocumentGroup.isPending;

  return (
    <FormProvider {...formMethods}>
      <Stack sx={{ justifyContent: 'space-between', height: '100%' }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Controller
            name={formFieldNames.documentGroups.name as 'name'}
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField
                sx={{ mb: 3 }}
                label="Group Type Name"
                placeholder="Enter group type name"
                field={field}
                fieldState={fieldState}
              />
            )}
          />

          <Controller
            name={formFieldNames.documentGroups.description as 'description'}
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField
                sx={{ mb: 3 }}
                label="Group Type Description"
                placeholder="Enter group type description"
                field={field}
                fieldState={fieldState}
                multiline={true}
                rows={4}
              />
            )}
          />

          <MetadataFieldsSection<DocumentGroup>
            fieldPath={MetadataFieldPathEnum.DOCUMENT_GROUP_METADATA}
            title="Entity fields"
            documentType={documentGroup}
          />
        </Box>

        <Stack>
          <Divider sx={{ marginY: 3 }} />
          <Stack direction="row" gap={2} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={!formState.isValid || isLoading}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  );
};
