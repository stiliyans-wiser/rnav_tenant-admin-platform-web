import React from 'react';
import { TextField, InputLabel, StandardTextFieldProps } from '@mui/material';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

interface MuiTextFieldProps extends StandardTextFieldProps {
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
  required?: boolean;
}

export const MuiTextField = ({
  sx,
  label,
  placeholder,
  type = 'text',
  field,
  fieldState,
  size = 'medium',
  required = true,
  multiline = false,
  rows,
  slotProps = {},
}: MuiTextFieldProps) => {
  return (
    <>
      <InputLabel sx={{ overflow: 'visible' }} htmlFor={field.name} required={required} shrink>
        {label}
      </InputLabel>

      <TextField
        {...field}
        id={field.name}
        sx={sx}
        fullWidth
        variant="outlined"
        type={type}
        size={size}
        placeholder={placeholder}
        slotProps={slotProps}
        error={!!fieldState.error && fieldState.isTouched}
        helperText={fieldState.error?.message && fieldState.isTouched ? fieldState.error.message : ''}
        multiline={multiline}
        rows={rows}
      />
    </>
  );
};
