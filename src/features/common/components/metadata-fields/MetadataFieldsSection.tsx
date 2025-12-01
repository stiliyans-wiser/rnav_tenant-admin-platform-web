import { useState } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Add } from '@carbon/icons-react';
import { MetadataFieldPathEnum } from '@/features/common/enums/metadata-field-path.enum';
import { MetadataFieldItemEdit } from './MetadataFieldItemEdit';
import { MetadataFieldItemView } from '@/features/common/components/metadata-fields/MetadataFieldItemView';
import { ColumnTypeEnum } from '@/features/common/enums/column-type.enum';

interface MetadataFieldsSectionProps<T> {
  fieldPath: MetadataFieldPathEnum;
  title: string;
  documentType?: T;
}

export const MetadataFieldsSection = <T = null,>({ fieldPath, title, documentType }: MetadataFieldsSectionProps<T>) => {
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const formMethods = useFormContext();
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
    return documentType ? documentType[fieldPath] || [] : [];
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
