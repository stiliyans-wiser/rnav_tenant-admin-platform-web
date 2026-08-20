import { useState } from 'react';
import { Button, Chip, FormControlLabel, InputAdornment, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

const FRESHNESS_WINDOW_OPTIONS = [30, 60, 90, 180, 365];

const CADENCE_OPTIONS = [
  { value: 0, label: 'Disabled (manual only)' },
  { value: 6, label: 'Every 6 hours' },
  { value: 12, label: 'Every 12 hours' },
  { value: 24, label: 'Daily' },
  { value: 48, label: 'Every 2 days' },
  { value: 72, label: 'Every 3 days' },
];

export const CandidateDeliveryForm = () => {
  const { control, getValues, setValue } = useFormContext();
  const [newRecipient, setNewRecipient] = useState('');

  const addRecipient = () => {
    const r = newRecipient.trim();
    if (!r) return;
    const current: string[] = getValues(formFieldNames.candidateDelivery.notificationRecipients) ?? [];
    if (!current.includes(r)) {
      setValue(formFieldNames.candidateDelivery.notificationRecipients, [...current, r], { shouldDirty: true });
    }
    setNewRecipient('');
  };

  const removeRecipient = (r: string) => {
    const current: string[] = getValues(formFieldNames.candidateDelivery.notificationRecipients) ?? [];
    setValue(
      formFieldNames.candidateDelivery.notificationRecipients,
      current.filter(x => x !== r),
      { shouldDirty: true },
    );
  };

  return (
    <>
      {/* Shortlist & Candidate Limits */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shortlist &amp; Candidate Limits
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Controller
          name={formFieldNames.candidateDelivery.shortlistDefaultSize}
          control={control}
          defaultValue={3}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 20, message: 'Max 20' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Default Shortlist Size"
              type="number"
              value={field.value ?? 3}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 20 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Candidates shown per shortlist (1–20)'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 200 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.candidateDelivery.candidateLimitPerJob}
          control={control}
          defaultValue={20}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 200, message: 'Max 200' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Max Candidates Per Position"
              type="number"
              value={field.value ?? 20}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 200 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Hard cap per job (1–200)'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 220 }}
            />
          )}
        />
      </Stack>

      {/* Review & Approval */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Review &amp; Approval
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Controller
          name={formFieldNames.candidateDelivery.deliveryReviewThreshold}
          control={control}
          defaultValue={90}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Delivery Review Threshold (%)"
              type="number"
              value={field.value ?? 90}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 0, max: 100, step: 5 }}
              size="small"
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              helperText={fieldState.error?.message ?? 'Candidates scoring below this threshold require manual approval before delivery'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 260 }}
            />
          )}
        />
      </Stack>

      {/* Freshness Scoring */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Freshness Scoring
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Award bonus points to candidates whose CV was updated within the freshness window. This is separate from Time Decay (which penalises old CVs).
      </Typography>

      <Controller
        name={formFieldNames.candidateDelivery.freshnessBonusEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Enable Freshness Bonus" />
        )}
      />

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1, mb: 3 }}>
        <Controller
          name={formFieldNames.candidateDelivery.freshnessBonusPoints}
          control={control}
          defaultValue={5}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 20, message: 'Max 20' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Bonus Points"
              type="number"
              value={field.value ?? 5}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 0, max: 20 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Points added to score (0–20)'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.candidateDelivery.freshnessWindowDays}
          control={control}
          defaultValue={90}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Freshness Window (days)"
              value={field.value ?? 90}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              size="small"
              sx={{ maxWidth: 200 }}
            >
              {FRESHNESS_WINDOW_OPTIONS.map(v => (
                <MenuItem key={v} value={v}>
                  {v} days
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>

      {/* Matching Schedule */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Matching Schedule
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        How often to automatically re-run matching for active jobs.
      </Typography>

      <Controller
        name={formFieldNames.candidateDelivery.matchingCadenceHours}
        control={control}
        defaultValue={24}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Re-matching Cadence"
            value={field.value ?? 24}
            onChange={e => field.onChange(parseInt(e.target.value, 10))}
            size="small"
            sx={{ maxWidth: 220, mb: 3 }}
          >
            {CADENCE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Report Delivery */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Report Delivery
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Automatically email matching reports to specified recipients.
      </Typography>

      <Controller
        name={formFieldNames.candidateDelivery.reportCadenceEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Enable Automated Reports" />
        )}
      />

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
        <Controller
          name={formFieldNames.candidateDelivery.reportCount}
          control={control}
          defaultValue={3}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 10, message: 'Max 10' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Reports Per Period"
              type="number"
              value={field.value ?? 3}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 10 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Number of reports per period (1–10)'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 180 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.candidateDelivery.reportPeriodDays}
          control={control}
          defaultValue={14}
          rules={{ min: { value: 7, message: 'Min 7' }, max: { value: 90, message: 'Max 90' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Report Period (days)"
              type="number"
              value={field.value ?? 14}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 7, max: 90 }}
              size="small"
              InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
              helperText={fieldState.error?.message ?? 'Period length in days (7–90)'}
              error={Boolean(fieldState.error)}
              sx={{ maxWidth: 200 }}
            />
          )}
        />
      </Stack>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Report Recipients
      </Typography>

      <Controller
        name={formFieldNames.candidateDelivery.notificationRecipients}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            {(field.value ?? []).map((r: string) => (
              <Chip key={r} label={r} onDelete={() => removeRecipient(r)} size="small" />
            ))}
          </Stack>
        )}
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Add recipient email"
          value={newRecipient}
          onChange={e => setNewRecipient(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addRecipient();
            }
          }}
          size="small"
          sx={{ maxWidth: 280 }}
          placeholder="e.g. hr@company.com"
          type="email"
        />
        <Button variant="outlined" size="small" onClick={addRecipient} disabled={!newRecipient.trim()}>
          Add
        </Button>
      </Stack>
    </>
  );
};
