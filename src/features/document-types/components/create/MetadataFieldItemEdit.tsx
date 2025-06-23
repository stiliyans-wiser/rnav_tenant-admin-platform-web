import { Button, Divider, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { Checkmark, Close } from '@carbon/icons-react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { ColumnTypeEnum } from '@/features/document-types/enums/column-type.enum';
import { useEffect } from 'react';

interface MetadataFieldItemEditProps {
  index: number;
  isEdit: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  onCancel?: () => void;
  fieldPath: 'metadata_fields' | 'brief_metadata.metadata_fields';
}

/**
 * Component for editing metadata fields in single-field edit mode.
 * Only one field can be edited at a time to prevent conflicts.
 */
export const MetadataFieldItemEdit = ({ index, isEdit, onDiscard, onSave, onCancel, fieldPath }: MetadataFieldItemEditProps) => {
  const { control, formState, getFieldState, trigger } = useFormContext();

  useEffect(() => {
    trigger(`${fieldPath}.${index}`);
  }, [trigger, fieldPath, index]);

  return (
    <Paper elevation={4} sx={{ padding: 2, marginBottom: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">{isEdit ? 'Edit metadata field' : 'New metadata field'}</Typography>

        <Stack direction="row" gap={2}>
          <Button color="secondary" size="small" startIcon={<Close />} onClick={() => (isEdit ? onCancel?.() : onDiscard?.())}>
            {isEdit ? 'Cancel' : 'Discard'}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            startIcon={<Checkmark />}
            disabled={getFieldState(`${fieldPath}.${index}`, formState).invalid}
            onClick={() => onSave()}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ marginY: 2 }} />

      <Stack>
        <Controller
          name={`${fieldPath}.${index}.name`}
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field, fieldState }) => (
            <MuiTextField sx={{ mb: 3 }} label="Name" placeholder="Enter metadata field name" field={field} fieldState={fieldState} />
          )}
        />

        <Controller
          name={`${fieldPath}.${index}.description`}
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field, fieldState }) => (
            <MuiTextField
              sx={{ mb: 3 }}
              label="Description"
              placeholder="Enter metadata field description"
              field={field}
              fieldState={fieldState}
            />
          )}
        />

        <Controller
          name={`${fieldPath}.${index}.column_type`}
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field, fieldState }) => (
            <MuiSelect
              field={field}
              fieldState={fieldState}
              placeholder="Select field type"
              label="Field type"
              options={Object.values(ColumnTypeEnum).map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 300,
                      maxWidth: 100,
                    },
                  },
                },
              }}
            />
          )}
        />
      </Stack>
    </Paper>
  );
};
