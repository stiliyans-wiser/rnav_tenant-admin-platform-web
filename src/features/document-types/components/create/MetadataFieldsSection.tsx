import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Add } from '@carbon/icons-react';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { ColumnTypeEnum } from '../../enums/column-type.enum';
import { useState } from 'react';
import { MetadataFieldItemEdit } from './MetadataFieldItemEdit';
import { MetadataFieldItemView } from '@/features/document-types/components/create/MetadataFieldItemView';
import { AddEditForm } from '@/features/document-types/interfaces/add-edit-form.interface';

interface MetadataFieldsSectionProps {
  fieldPath: 'metadata_fields' | 'brief_metadata.metadata_fields';
  title: string;
  documentType?: DocumentType;
}

export const MetadataFieldsSection = ({ fieldPath, title, documentType }: MetadataFieldsSectionProps) => {
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const formMethods = useFormContext<AddEditForm>();
  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: fieldPath,
  });

  /**
   * Watch the current form values for metadata_fields to ensure view component shows updated values
   */
  const watchedMetadataFields =
    useWatch({
      control: formMethods.control,
      name: fieldPath,
    }) || [];

  /**
   * Get existing fields from document type based on field path
   */
  const getExistingFields = () => {
    if (fieldPath === 'metadata_fields') {
      return documentType?.metadata_fields;
    } else if (fieldPath === 'brief_metadata.metadata_fields') {
      return documentType?.brief_metadata?.metadata_fields;
    }

    return [];
  };

  const existingFields = getExistingFields();

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
      formMethods.resetField(`${fieldPath}.${index}`);
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2">{title}</Typography>
      <Divider sx={{ marginY: 2 }} />

      {fields.map((field, index) => {
        const isEditMode = editingFieldIndex === index;
        const isExistingField = Boolean(existingFields?.[index]);
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
            fieldPath={fieldPath}
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
  );
};
