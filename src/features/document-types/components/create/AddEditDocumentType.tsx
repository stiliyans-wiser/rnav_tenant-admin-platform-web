import { Controller, FormProvider, useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Add } from '@carbon/icons-react';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { ColumnTypeEnum } from '../../enums/column-type.enum';
import { useState } from 'react';
import { MetadataFieldItemEdit } from './MetadataFieldItemEdit';
import { MetadataFieldItemView } from '@/features/document-types/components/create/MetadataFieldItemView';
import { useCreateDocumentType } from '@/features/document-types/hooks/useCreateDocumentType';
import { useUpdateDocumentType } from '@/features/document-types/hooks/useUpdateDocumentType';

interface AddEditDocumentTypeProps {
  onClose: () => void;
  documentType?: DocumentType;
}

interface AddEditForm {
  name: string;
  description: string;
  metadata_fields: {
    name: string;
    description: string;
    column_type: ColumnTypeEnum;
  }[];
}

export const AddEditDocumentType = ({ onClose, documentType }: AddEditDocumentTypeProps) => {
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const formMethods = useForm<AddEditForm>({
    defaultValues: {
      name: documentType?.name || '',
      description: documentType?.description || '',
      metadata_fields: documentType?.metadata_fields || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'metadata_fields',
  });

  /**
   * Watch the current form values for metadata_fields to ensure view component shows updated values
   */
  const watchedMetadataFields =
    useWatch({
      control: formMethods.control,
      name: 'metadata_fields',
    }) || [];

  const createDocumentType = useCreateDocumentType();
  const updateDocumentType = useUpdateDocumentType();

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

  /**
   * Adds a new metadata field to the form and automatically sets it to edit mode
   */
  const addMetadataField = () => {
    const newIndex = fields.length;
    append({
      name: '',
      description: '',
      column_type: ColumnTypeEnum.VARCHAR,
    });

    setEditingFieldIndex(newIndex);
  };

  /**
   * Removes a metadata field from the form and handles editing state cleanup
   * @param index - The index of the field to remove
   */
  const removeMetadataField = (index: number) => {
    remove(index);

    if (editingFieldIndex === index) {
      setEditingFieldIndex(null);
    } else if (editingFieldIndex !== null && editingFieldIndex > index) {
      setEditingFieldIndex(editingFieldIndex - 1);
    }
  };

  /**
   * Initiates editing mode for a metadata field (only one field can be edited at a time)
   * @param index - The index of the field to edit
   */
  const handleEditField = (index: number) => {
    if (editingFieldIndex === null) {
      setEditingFieldIndex(index);
    }
  };

  /**
   * Saves the edited metadata field and exits edit mode
   * @param index - The index of the field being saved
   */
  const handleSaveField = (index: number) => {
    if (editingFieldIndex === index) {
      setEditingFieldIndex(null);
    }
  };

  /**
   * Cancels editing mode for a metadata field without saving changes
   * @param index - The index of the field being canceled
   */
  const handleCancelEdit = (index: number) => {
    if (editingFieldIndex === index) {
      formMethods.resetField(`metadata_fields.${index}`);
      setEditingFieldIndex(null);
    }
  };

  /**
   * Discards a new metadata field by removing it entirely
   * @param index - The index of the new field to discard
   */
  const handleDiscardNewField = (index: number) => {
    removeMetadataField(index);
  };

  return (
    <FormProvider {...formMethods}>
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={formMethods.control}
          rules={{ required: 'This field is required' }}
          render={({ field, fieldState }) => (
            <MuiTextField
              sx={{ mb: 3 }}
              label="Document Type Name"
              placeholder="Enter document type name"
              field={field}
              fieldState={fieldState}
            />
          )}
        />

        <Controller
          name="description"
          control={formMethods.control}
          rules={{ required: 'This field is required' }}
          render={({ field, fieldState }) => (
            <MuiTextField
              sx={{ mb: 3 }}
              label="Document Type Description"
              placeholder="Enter document type description"
              field={field}
              fieldState={fieldState}
              multiline={true}
              rows={4}
            />
          )}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2">Included metadata fields</Typography>
          <Divider sx={{ marginY: 2 }} />

          {fields.map((field, index) => {
            const isEditMode = editingFieldIndex === index;
            const isExistingField = Boolean(documentType?.metadata_fields?.[index]);
            const canEdit = editingFieldIndex === null || editingFieldIndex === index;
            const currentFieldData = watchedMetadataFields[index] || field;

            return isEditMode ? (
              <MetadataFieldItemEdit
                key={field.id}
                index={index}
                isEdit={isExistingField}
                onSave={() => handleSaveField(index)}
                onCancel={() => handleCancelEdit(index)}
                onDiscard={() => handleDiscardNewField(index)}
              />
            ) : (
              <MetadataFieldItemView
                key={field.id}
                field={currentFieldData}
                onEdit={() => handleEditField(index)}
                onDelete={() => removeMetadataField(index)}
                canEdit={canEdit}
              />
            );
          })}

          <Button variant="outlined" startIcon={<Add />} onClick={addMetadataField} fullWidth disabled={editingFieldIndex !== null}>
            Add new metadata field
          </Button>
        </Box>

        <Stack direction="row" sx={{ mt: 6, justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={!formMethods.formState.isValid}>
            {documentType ? 'Edit' : 'Create'}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};
