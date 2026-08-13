import { FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';

export const MatchingControlsForm = () => {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Scoring Weights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Programmatic + LLM + Embedding weights must sum to 1.0.
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Controller
          name={formFieldNames.matchConfig.programmaticWeight}
          control={control}
          defaultValue={0.4}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Programmatic"
              field={{ ...field, value: field.value ?? 0.4 }}
              fieldState={fieldState}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.llmSemanticWeight}
          control={control}
          defaultValue={0.4}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="LLM Semantic"
              field={{ ...field, value: field.value ?? 0.4 }}
              fieldState={fieldState}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.embeddingSimilarityWeight}
          control={control}
          defaultValue={0.2}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Embedding"
              field={{ ...field, value: field.value ?? 0.2 }}
              fieldState={fieldState}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Pipeline Settings
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        <Controller
          name={formFieldNames.matchConfig.topK}
          control={control}
          defaultValue={10}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 200, message: 'Max 200' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="top_k"
              field={{ ...field, value: field.value ?? 10 }}
              fieldState={fieldState}
              sx={{ maxWidth: 140 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.scoreThreshold}
          control={control}
          defaultValue={0}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Score threshold"
              field={{ ...field, value: field.value ?? 0 }}
              fieldState={fieldState}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.screeningThreshold}
          control={control}
          defaultValue={40}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Screening threshold"
              field={{ ...field, value: field.value ?? 40 }}
              fieldState={fieldState}
              sx={{ maxWidth: 180 }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Controller
          name={formFieldNames.matchConfig.screeningModel}
          control={control}
          defaultValue="gpt-4.1-mini"
          render={({ field, fieldState }) => (
            <MuiTextField
              label="Screening model"
              field={{ ...field, value: field.value ?? 'gpt-4.1-mini' }}
              fieldState={fieldState}
              sx={{ maxWidth: 200 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.deepModel}
          control={control}
          defaultValue="gpt-4.1"
          render={({ field, fieldState }) => (
            <MuiTextField
              label="Deep model"
              field={{ ...field, value: field.value ?? 'gpt-4.1' }}
              fieldState={fieldState}
              sx={{ maxWidth: 200 }}
            />
          )}
        />
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Automation
      </Typography>

      <Controller
        name={formFieldNames.matchConfig.autoMatchOnJobIngest}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Auto-match on job ingest" />
        )}
      />
      <Controller
        name={formFieldNames.matchConfig.autoMatchOnCandidateIngest}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? false} />}
            label="Auto-match on candidate ingest"
          />
        )}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Calibration
      </Typography>

      <Controller
        name={formFieldNames.matchConfig.calibrationMode}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Calibration mode" />
        )}
      />

      <Controller
        name={formFieldNames.matchConfig.calibrationTopKMultiplier}
        control={control}
        defaultValue={3}
        rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 10, message: 'Max 10' } }}
        render={({ field, fieldState }) => (
          <MuiTextField
            type="number"
            label="Calibration top_k multiplier"
            field={{ ...field, value: field.value ?? 3 }}
            fieldState={fieldState}
            sx={{ maxWidth: 220, mt: 1 }}
          />
        )}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Screening Filters
      </Typography>

      {[
        { name: 'match_config.filter_seniority', label: 'Filter by seniority' },
        { name: 'match_config.filter_min_experience', label: 'Filter by min experience' },
        { name: 'match_config.filter_location', label: 'Filter by location' },
        { name: 'match_config.filter_industry', label: 'Filter by industry' },
        { name: 'match_config.filter_mandatory_skills', label: 'Filter by mandatory skills' },
        { name: 'match_config.filter_technology_ancestry', label: 'Filter by technology ancestry' },
        { name: 'match_config.filter_embedding_similarity', label: 'Filter by embedding similarity' },
        { name: 'match_config.filter_career_trajectory', label: 'Filter by career trajectory' },
        { name: 'match_config.filter_company_dna', label: 'Filter by company DNA' },
      ].map(filter => (
        <Controller
          key={filter.name}
          name={filter.name}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label={filter.label} />
          )}
        />
      ))}
    </>
  );
};
