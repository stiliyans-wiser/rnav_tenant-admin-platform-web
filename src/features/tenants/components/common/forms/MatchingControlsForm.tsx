import { Box, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';

export const MatchingControlsForm = () => {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Scoring Weights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The three weights control how each scoring signal contributes to the final match score.{' '}
        <strong>Programmatic + LLM Semantic + Embedding must sum to 1.0.</strong>
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
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

      <Box sx={{ mb: 3, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        {[
          {
            label: 'Programmatic',
            desc: 'Rule-based skill overlap scoring using parsed CV data. Fast, deterministic, zero LLM cost. Increase when skill precision matters most.',
          },
          {
            label: 'LLM Semantic',
            desc: 'GPT-4 evaluation of experience depth, role relevance, and seniority fit. Richest signal, highest cost. Increase for senior or specialist roles.',
          },
          {
            label: 'Embedding',
            desc: 'Vector similarity from pre-computed CV and job embeddings. Surfaces candidates with similar backgrounds who use different terminology. Increase to broaden recall.',
          },
        ].map(({ label, desc }) => (
          <Typography key={label} variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            · <strong>{label}</strong>: {desc}
          </Typography>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Programmatic Scoring
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Multiplier applied to skills listed on a CV that have <strong>no supporting evidence</strong> — no years of
        experience stated and no "last used" date. Default: <strong>0.65</strong>.
      </Typography>
      <Box sx={{ mb: 1, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <strong>Impact by value:</strong>
        </Typography>
        {[
          { value: '1.0', label: 'Full credit for all mentioned skills regardless of evidence — higher recall, more noise, weaker ranking signal.' },
          { value: '0.65 (default)', label: 'Skills without proof count at 65%. Balances trust vs. noise for general-purpose matching.' },
          { value: '0.3–0.5', label: 'Strict — only skills with explicit years or dates contribute meaningfully. Fewer matches, higher precision.' },
          { value: '0.0', label: 'Zero credit for unverified skills — only dated/evidenced skills count. May miss valid candidates who omit dates.' },
        ].map(({ value, label }) => (
          <Typography key={value} variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            · <strong>{value}</strong>: {label}
          </Typography>
        ))}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <strong>When to adjust:</strong> Increase toward 1.0 when CVs in your market rarely include years per skill
        (e.g. junior roles, certain regions). Decrease toward 0.3–0.5 when you want only candidates with
        proven, dated skill experience. Keep default for general-purpose matching.
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        <Controller
          name={formFieldNames.matchConfig.unverifiedSkillCredit}
          control={control}
          defaultValue={0.65}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Unverified Skill Credit"
              field={{ ...field, value: field.value ?? 0.65 }}
              fieldState={fieldState}
              inputProps={{ step: 0.05 }}
              sx={{ maxWidth: 220 }}
            />
          )}
        />
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Embedding Weights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Blends four vector types when computing the embedding similarity component of the match score. All four weights
        must sum to 1.0. Applies only when the Embedding scoring weight above is &gt; 0.
      </Typography>
      <Box sx={{ mb: 2, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        {[
          {
            label: 'Full Text (default 0.35)',
            desc: 'Overall CV-to-job text similarity. Broadest signal — captures the whole document. Higher = favors candidates with strong overall content match.',
          },
          {
            label: 'Skills (default 0.30)',
            desc: 'Skills-focused embedding. Isolates technical competency overlap. Higher = emphasizes skill alignment over career narrative.',
          },
          {
            label: 'Experience (default 0.20)',
            desc: 'Work history and seniority embedding. Captures career trajectory and role level alignment. Higher = values career path match.',
          },
          {
            label: 'Bio (default 0.15)',
            desc: 'Candidate bio/summary embedding. Captures career narrative and cultural fit signals from the profile header. Higher = favors profile overview match.',
          },
        ].map(({ label, desc }) => (
          <Typography key={label} variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            · <strong>{label}</strong>: {desc}
          </Typography>
        ))}
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        <Controller
          name={formFieldNames.matchConfig.embeddingWeightFullText}
          control={control}
          defaultValue={0.35}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Full Text"
              field={{ ...field, value: field.value ?? 0.35 }}
              fieldState={fieldState}
              inputProps={{ step: 0.05 }}
              sx={{ maxWidth: 140 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.embeddingWeightSkills}
          control={control}
          defaultValue={0.3}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Skills"
              field={{ ...field, value: field.value ?? 0.3 }}
              fieldState={fieldState}
              inputProps={{ step: 0.05 }}
              sx={{ maxWidth: 140 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.embeddingWeightExperience}
          control={control}
          defaultValue={0.2}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Experience"
              field={{ ...field, value: field.value ?? 0.2 }}
              fieldState={fieldState}
              inputProps={{ step: 0.05 }}
              sx={{ maxWidth: 140 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.embeddingWeightBio}
          control={control}
          defaultValue={0.15}
          rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 1, message: 'Max 1' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Bio"
              field={{ ...field, value: field.value ?? 0.15 }}
              fieldState={fieldState}
              inputProps={{ step: 0.05 }}
              sx={{ maxWidth: 140 }}
            />
          )}
        />
      </Stack>

      <Box sx={{ mb: 1, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Multi-vector shortlist</strong>: When ON, uses the union of all four embedding vectors to build the
          initial candidate pool — broader and more diverse results. When OFF, only the full-text vector is used —
          faster but may miss candidates who score well on skills or experience vectors alone. Default:{' '}
          <strong>ON</strong>.
        </Typography>
      </Box>
      <Controller
        name={formFieldNames.matchConfig.useMultiVectorShortlist}
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? true} />}
            label="Multi-vector shortlist"
            sx={{ mb: 3 }}
          />
        )}
      />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Pipeline Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Controls how many candidates are evaluated, at what score thresholds, and which models run each pipeline stage.
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
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
          name={formFieldNames.matchConfig.flashrankTopK}
          control={control}
          defaultValue={5}
          rules={{ min: { value: 1, message: 'Min 1' }, max: { value: 100, message: 'Max 100' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="FlashRank top_k"
              field={{ ...field, value: field.value ?? 5 }}
              fieldState={fieldState}
              sx={{ maxWidth: 160 }}
            />
          )}
        />
        <Controller
          name={formFieldNames.matchConfig.llmProgrammaticGuaranteeK}
          control={control}
          defaultValue={10}
          rules={{ min: { value: 0, message: 'Min 0 (0 disables)' }, max: { value: 40, message: 'Max 40' } }}
          render={({ field, fieldState }) => (
            <MuiTextField
              type="number"
              label="Guaranteed top candidates for AI scoring"
              helperText="After every candidate gets a rule-based score (skills, experience, title), FlashRank pre-filter picks who goes to AI scoring, reading only a short CV snippet, so it can drop strong candidates. This always adds the N best by rule-based score to AI scoring, on top of FlashRank's picks. 10 recommended, 0 = off, max 40. Cost ≈ $0.02 per extra candidate on first run."
              field={{ ...field, value: field.value ?? 10 }}
              fieldState={fieldState}
              sx={{ maxWidth: 480 }}
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

      <Box sx={{ mb: 2, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        {[
          {
            label: 'top_k',
            desc: 'Candidates pulled from the vector index and passed to FlashRank reranking. Higher = broader initial pool, higher cost. Default: 10. Increase to 20–50 for large talent pools or broad roles.',
          },
          {
            label: 'FlashRank top_k',
            desc: 'Candidates kept after FlashRank cross-encoder reranking and passed to embedding and AI scoring. Controls funnel width at the reranking stage. Default: 5. Typical range: 5–20.',
          },
          {
            label: 'Score threshold',
            desc: 'Minimum combined match score (0–100) to appear in results. Set 0 to disable. Use 50–70 to surface only high-confidence matches and reduce recruiter noise.',
          },
          {
            label: 'Screening threshold',
            desc: 'Minimum score for a candidate to pass the fast LLM screening pass and proceed to deep evaluation. Default: 40. Increase to reduce cost on large pipelines; decrease to widen the funnel.',
          },
        ].map(({ label, desc }) => (
          <Typography key={label} variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            · <strong>{label}</strong>: {desc}
          </Typography>
        ))}
      </Box>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 1 }}>
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

      <Box sx={{ mb: 3, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        {[
          {
            label: 'Screening model',
            desc: 'OpenAI model for the fast first-pass screening stage. Lighter models (gpt-4.1-mini) lower cost. Use stronger models only if screening precision is insufficient.',
          },
          {
            label: 'Deep model',
            desc: 'OpenAI model for full semantic evaluation of shortlisted candidates. Stronger models improve ranking quality at higher cost per match run.',
          },
        ].map(({ label, desc }) => (
          <Typography key={label} variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            · <strong>{label}</strong>: {desc}
          </Typography>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Automation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Trigger matching automatically when new data arrives, without manual intervention.
      </Typography>

      <Box sx={{ mb: 0.5 }}>
        <Controller
          name={formFieldNames.matchConfig.autoMatchOnJobIngest}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Auto-match on job ingest" />
          )}
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5, mt: -0.5, mb: 1 }}>
          Run matching automatically when a new job is ingested. Enable for real-time pipelines. Disable to batch-trigger matching manually and control API costs.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
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
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5, mt: -0.5, mb: 0 }}>
          Run matching automatically when a new candidate CV is ingested. Enable to keep candidate pools continuously ranked against active jobs.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
        Calibration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Calibration runs expand the candidate pool beyond normal top_k to audit scoring quality. Results are not shown to recruiters.
      </Typography>

      <Box sx={{ mb: 0.5 }}>
        <Controller
          name={formFieldNames.matchConfig.calibrationMode}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label="Calibration mode" />
          )}
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5, mt: -0.5, mb: 1 }}>
          Activate calibration runs for this tenant. Use to tune scoring weights and thresholds before enabling production matching. Disable when weights are stable.
        </Typography>
      </Box>

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
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Multiplies top_k during calibration runs. A value of 3 with top_k=10 evaluates 30 candidates. Higher = more thorough audit at higher API cost. Default: 3.
      </Typography>

      <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
        Screening Filters
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Hard filters applied before scoring. Candidates that fail an enabled filter are excluded entirely, regardless of score. Enable filters only when the job requirement is reliable and consistently extracted.
      </Typography>

      {[
        {
          name: 'match_config.filter_seniority',
          label: 'Filter by seniority',
          description: 'Exclude candidates whose detected seniority level (junior / mid / senior) does not match the job requirement. Only enable when job seniority is consistently specified.',
        },
        {
          name: 'match_config.filter_min_experience',
          label: 'Filter by min experience',
          description: 'Exclude candidates who do not meet the minimum total years of experience required by the job. Requires reliable experience extraction from CVs.',
        },
        {
          name: 'match_config.filter_location',
          label: 'Filter by location',
          description: 'Exclude candidates outside the job\'s required location or region. Use for on-site or location-constrained roles; disable for remote-friendly positions.',
        },
        {
          name: 'match_config.filter_industry',
          label: 'Filter by industry',
          description: 'Exclude candidates with no detected experience in the job\'s required industry. Useful for specialist sectors; may over-filter in cross-industry roles.',
        },
        {
          name: 'match_config.filter_mandatory_skills',
          label: 'Filter by mandatory skills',
          description: 'Exclude candidates missing any skill the job marks as mandatory. Hard filter — use with care on sparse CVs where candidates may have the skill but not list it explicitly.',
        },
        {
          name: 'match_config.filter_technology_ancestry',
          label: 'Filter by technology ancestry',
          description: 'Exclude candidates who lack the technology family required by the job (e.g. filtering for .NET excludes pure Java candidates). Useful for platform-specific roles.',
        },
        {
          name: 'match_config.filter_career_trajectory',
          label: 'Filter by career trajectory',
          description: 'Exclude candidates whose career progression signals a structural mismatch — declining seniority, unexplained gaps, or repeated unrelated pivots.',
        },
        {
          name: 'match_config.filter_company_dna',
          label: 'Filter by company DNA',
          description: 'Exclude candidates whose company background (startup vs. enterprise scale, industry sector) does not align with the hiring company\'s profile and culture signals.',
        },
      ].map(filter => (
        <Box key={filter.name} sx={{ mb: 1.5 }}>
          <Controller
            name={filter.name}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel control={<Switch {...field} checked={field.value ?? false} />} label={filter.label} />
            )}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5, mt: -0.5 }}>
            {filter.description}
          </Typography>
        </Box>
      ))}
    </>
  );
};
