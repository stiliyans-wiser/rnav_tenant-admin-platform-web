import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { Stack, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { MuiDatePicker } from '@/features/common/components/form-elements/MuiDatePicker';
import { DashboardFilter } from '@/features/dashboard/interfaces/dashboard-filter.interface';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';

const CUSTOM_PERIOD_OPTION = 'Custom';
const FIELD_WIDTH = { width: 260 };

export interface DashboardFilterProps {
  tenants: Tenant[];
  periodOptions: string[];
  onFilterChanged: (filter: DashboardFilter) => void;
}

export const DashboardActionControls = ({ tenants, periodOptions, onFilterChanged }: DashboardFilterProps) => {
  const { control, watch, setValue } = useForm<DashboardFilter>({
    defaultValues: {
      accountId: tenants[0]?.id,
      timePeriod: periodOptions?.[0],
      fromDate: null,
      toDate: null,
    },
  });
  const watchedValues = watch();

  const currentFilter = useMemo(
    () => ({
      accountId: watchedValues.accountId,
      timePeriod: watchedValues.timePeriod === CUSTOM_PERIOD_OPTION ? undefined : watchedValues.timePeriod,
      fromDate: watchedValues.fromDate,
      toDate: watchedValues.toDate,
    }),
    [watchedValues.accountId, watchedValues.timePeriod, watchedValues.fromDate, watchedValues.toDate],
  );
  const [debouncedFilter] = useDebounce(currentFilter, 300);

  const newPeriodOptions = useMemo(() => {
    return [...(periodOptions || []), CUSTOM_PERIOD_OPTION];
  }, [periodOptions]);

  useEffect(() => {
    const dateValue = watchedValues.timePeriod === CUSTOM_PERIOD_OPTION ? new Date() : null;

    setValue('fromDate', dateValue);
    setValue('toDate', dateValue);
  }, [watchedValues.timePeriod, setValue]);

  useEffect(() => {
    onFilterChanged(debouncedFilter);
  }, [debouncedFilter, onFilterChanged]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Controller
          name="accountId"
          control={control}
          render={({ field, fieldState }) => (
            <MuiSelect
              sx={FIELD_WIDTH}
              size="small"
              field={{ ...field, value: field.value || '' }}
              label="Tenant"
              placeholder="Select tenant"
              fieldState={fieldState}
              required={false}
              renderValue={(selected: string) => tenants.find(opt => opt.id === selected)?.company_name}
              options={tenants.map(tenant => (
                <MenuItem key={tenant.id} value={tenant.id}>
                  {tenant.company_name}
                </MenuItem>
              ))}
            />
          )}
        />

        <Controller
          name="timePeriod"
          control={control}
          render={({ field, fieldState }) => (
            <MuiSelect
              sx={FIELD_WIDTH}
              size="small"
              field={field}
              label="Period"
              placeholder="Select period"
              fieldState={fieldState}
              required={false}
              options={newPeriodOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            />
          )}
        />

        {watchedValues.timePeriod === CUSTOM_PERIOD_OPTION && (
          <>
            <Stack>
              <Controller
                name="fromDate"
                control={control}
                render={({ field, fieldState }) => (
                  <MuiDatePicker field={field} fieldState={fieldState} label="From Date" sx={FIELD_WIDTH} size="small" />
                )}
              />
            </Stack>

            <Stack>
              <Controller
                name="toDate"
                control={control}
                render={({ field, fieldState }) => (
                  <MuiDatePicker field={field} fieldState={fieldState} label="To Date" sx={FIELD_WIDTH} size="small" />
                )}
              />
            </Stack>
          </>
        )}
      </Stack>
    </LocalizationProvider>
  );
};
