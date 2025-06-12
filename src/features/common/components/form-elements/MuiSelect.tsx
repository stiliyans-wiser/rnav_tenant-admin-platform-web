import React, { useState } from 'react';
import {
  Box,
  FormHelperText,
  InputLabel,
  Select,
  SelectProps,
} from '@mui/material';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

interface MuiSelectProps extends Omit<SelectProps, 'options'> {
  placeholder: string;
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
  options: React.ReactNode;
}

export const MuiSelect = ({
  sx,
  label,
  placeholder,
  multiple = false,
  field,
  fieldState,
  options,
  renderValue,
  MenuProps,
}: MuiSelectProps) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  return (
    <Box sx={sx}>
      <InputLabel
        htmlFor={field.name}
        shrink
        onClick={() => setSelectOpen(true)}
      >
        {label}
      </InputLabel>

      <Select
        {...field}
        id={field.name}
        fullWidth
        displayEmpty
        variant="outlined"
        open={selectOpen}
        autoFocus={selectOpen}
        multiple={multiple}
        error={!!fieldState.error && fieldState.isTouched}
        renderValue={(selected: any) => {
          if (!selected?.length) {
            return (
              <Box sx={{ opacity: 'var(--mui-opacity-inputPlaceholder)' }}>
                {placeholder}
              </Box>
            );
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
