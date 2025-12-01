import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { InputLabel, SxProps, Theme } from '@mui/material';

interface MuiDatePickerProps extends DatePickerProps {
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
  label: string;
  size?: 'small' | 'medium';
  required?: boolean;
  sx?: SxProps<Theme>;
}

export const MuiDatePicker = ({ field, fieldState, label, size = 'medium', required = false, sx }: MuiDatePickerProps) => {
  return (
    <>
      <InputLabel sx={{ overflow: 'visible' }} htmlFor={field.name} required={required} shrink>
        {label}
      </InputLabel>

      <DatePicker
        value={field.value}
        onChange={field.onChange}
        slotProps={{
          textField: {
            id: field.name,
            sx: sx,
            variant: 'outlined',
            size: size,
            error: !!fieldState.error && fieldState.isTouched,
            helperText: fieldState.error?.message && fieldState.isTouched ? fieldState.error.message : '',
          },
        }}
      />
    </>
  );
};
