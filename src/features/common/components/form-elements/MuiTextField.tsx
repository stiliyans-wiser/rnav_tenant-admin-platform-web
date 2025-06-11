import React from 'react';
import { InputLabel, StandardTextFieldProps, TextField } from '@mui/material';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

interface MuiTextFieldProps extends StandardTextFieldProps {
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
}

export const MuiTextField = ({
  sx,
  label,
  placeholder,
  type = 'text',
  field,
  fieldState,
  multiline = false,
  rows,
  slotProps = {},
}: MuiTextFieldProps) => {
  return (
    <>
      <InputLabel sx={ { overflow: 'visible' } } htmlFor={ field.name } shrink>
        { label }
      </InputLabel>

      <TextField
        { ...field }
        id={ field.name }
        sx={ sx }
        fullWidth
        variant="outlined"
        type={ type }
        placeholder={ placeholder }
        slotProps={ slotProps }
        error={ !!fieldState.error && fieldState.isTouched }
        helperText={
          fieldState.error?.message && fieldState.isTouched
            ? fieldState.error.message
            : ''
        }
        multiline={ multiline }
        rows={ rows }
      />
    </>
  );
};
