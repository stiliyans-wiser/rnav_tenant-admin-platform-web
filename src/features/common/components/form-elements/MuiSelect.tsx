import React, { useState } from 'react';
import { Box, FormHelperText, InputLabel, Select, SelectProps } from '@mui/material';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

interface MuiSelectProps extends Omit<SelectProps, 'options'> {
  placeholder: string;
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
  options: React.ReactNode;
  required?: boolean;
}

export const MuiSelect = ({
  sx,
  size,
  label,
  placeholder,
  multiple = false,
  required = true,
  field,
  fieldState,
  options,
  renderValue,
  MenuProps,
}: MuiSelectProps) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  return (
    <Box sx={sx}>
      <InputLabel htmlFor={field.name} required={required} shrink onClick={() => setSelectOpen(true)}>
        {label}
      </InputLabel>

      <Select
        {...field}
        id={field.name}
        fullWidth
        displayEmpty
        variant="outlined"
        size={size}
        open={selectOpen}
        autoFocus={selectOpen}
        multiple={multiple}
        error={!!fieldState.error && fieldState.isTouched}
        renderValue={(selected: any) => {
          if (!selected?.length) {
            return <Box sx={{ opacity: 'var(--mui-opacity-inputPlaceholder)' }}>{placeholder}</Box>;
          }

          return renderValue ? renderValue(selected) : selected;
        }}
        MenuProps={MenuProps}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
      >
        {options}
      </Select>

      {fieldState.error && fieldState.isTouched ? (
        <FormHelperText error sx={{ ml: 2 }}>
          {fieldState.error.message}
        </FormHelperText>
      ) : null}
    </Box>
  );
};
