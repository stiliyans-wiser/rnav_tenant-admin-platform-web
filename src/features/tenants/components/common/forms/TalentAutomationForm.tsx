import { useState } from 'react';
import { Button, Chip, FormControlLabel, Stack, Switch, TextField, Typography, InputAdornment } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const TalentAutomationForm = () => {
  const { control, getValues, setValue } = useFormContext();
  const [newQuestion, setNewQuestion] = useState('');

  const addQuestion = () => {
    const q = newQuestion.trim();
    if (!q) return;
    const current: string[] = getValues('talent_automation_config.enrichment_questions') ?? [];
    if (!current.includes(q)) {
      setValue('talent_automation_config.enrichment_questions', [...current, q], { shouldDirty: true });
    }
    setNewQuestion('');
  };

  const removeQuestion = (q: string) => {
    const current: string[] = getValues('talent_automation_config.enrichment_questions') ?? [];
    setValue(
      'talent_automation_config.enrichment_questions',
      current.filter(x => x !== q),
      { shouldDirty: true },
    );
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Modules
      </Typography>

      <Controller
        name={formFieldNames.talentAutomation.screeningEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="M1 — Instant Screening" />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
        Generates qualifying questions from job requirements and infers answers from the CV.
      </Typography>

      <Controller
        name={formFieldNames.talentAutomation.enrichmentEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="M2 — Profile Enrichment" />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
        Fills missing profile fields by inferring from CV text.
      </Typography>

      <Controller
        name={formFieldNames.talentAutomation.rerouteEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="M3 — Cross-role Reroute" />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
        Suggests alternative open roles when the candidate is a weak fit.
      </Typography>

      <Controller
        name={formFieldNames.talentAutomation.interviewPrepEnabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="M4 — Interview Preparation" />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
        Generates recruiter summary and tailored interview questions.
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        HITL Policy
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        <Controller
          name={formFieldNames.talentAutomation.confidenceThreshold}
          control={control}
          defaultValue={70}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Confidence threshold"
              type="number"
              value={field.value ?? 70}
              onChange={e => field.onChange(parseFloat(e.target.value))}
              inputProps={{ min: 0, max: 100, step: 5 }}
              size="small"
              sx={{ maxWidth: 200 }}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              helperText={fieldState.error?.message ?? 'Auto-commit above this confidence'}
              error={Boolean(fieldState.error)}
            />
          )}
        />
        <Controller
          name={formFieldNames.talentAutomation.screeningSlaSeconds}
          control={control}
          defaultValue={300}
          rules={{ min: { value: 60, message: 'Min 60s' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Screening SLA"
              type="number"
              value={field.value ?? 300}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 60 }}
              size="small"
              sx={{ maxWidth: 200 }}
              InputProps={{ endAdornment: <InputAdornment position="end">sec</InputAdornment> }}
              helperText={fieldState.error?.message ?? 'Max seconds before screening starts'}
              error={Boolean(fieldState.error)}
            />
          )}
        />
      </Stack>

      <Controller
        name={formFieldNames.talentAutomation.hitlRequiredForRejection}
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? true} />}
            label="Always require human approval for candidate rejections"
          />
        )}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        M2 — Enrichment Fields
      </Typography>

      <Controller
        name="talent_automation_config.enrichment_questions"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            {(field.value ?? []).map((q: string) => (
              <Chip key={q} label={q} onDelete={() => removeQuestion(q)} size="small" />
            ))}
          </Stack>
        )}
      />

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          label="Add field"
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addQuestion();
            }
          }}
          size="small"
          sx={{ maxWidth: 240 }}
          placeholder="e.g. remote_preference"
        />
        <Button variant="outlined" size="small" onClick={addQuestion} disabled={!newQuestion.trim()}>
          Add
        </Button>
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        M3 + M4 Settings
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Controller
          name={formFieldNames.talentAutomation.maxRerouteSuggestions}
          control={control}
          defaultValue={3}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 10, message: 'Max 10' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Max reroute suggestions"
              type="number"
              value={field.value ?? 3}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 10 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Alternative roles shown (1–10)'}
              error={Boolean(fieldState.error)}
            />
          )}
        />
        <Controller
          name={formFieldNames.talentAutomation.interviewPrepQuestionCount}
          control={control}
          defaultValue={5}
          rules={{ min: { value: 3, message: 'Min 3' }, max: { value: 15, message: 'Max 15' } }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Interview questions"
              type="number"
              value={field.value ?? 5}
              onChange={e => field.onChange(parseInt(e.target.value, 10))}
              inputProps={{ min: 3, max: 15 }}
              size="small"
              helperText={fieldState.error?.message ?? 'Questions per candidate (3–15)'}
              error={Boolean(fieldState.error)}
            />
          )}
        />
      </Stack>
    </>
  );
};
