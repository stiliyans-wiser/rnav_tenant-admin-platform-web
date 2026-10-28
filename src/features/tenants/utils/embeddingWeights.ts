import { EMBEDDING_WEIGHT_DEFAULTS, EMBEDDING_WEIGHTS_SUM_TOLERANCE } from '../constants/form.constants.ts';

const EMBEDDING_WEIGHT_KEYS = {
  embedding_weight_full_text: EMBEDDING_WEIGHT_DEFAULTS.fullText,
  embedding_weight_skills: EMBEDDING_WEIGHT_DEFAULTS.skills,
  embedding_weight_experience: EMBEDDING_WEIGHT_DEFAULTS.experience,
  embedding_weight_positions: EMBEDDING_WEIGHT_DEFAULTS.positions,
  embedding_weight_companies: EMBEDDING_WEIGHT_DEFAULTS.companies,
} as const;

type MatchConfigLike = Record<string, unknown>;

const isMissing = (value: unknown) => value === undefined || value === null || value === '';

export const withEmbeddingWeights = <T extends object>(matchConfig: T | undefined | null): T => {
  const { embedding_weight_bio: _removed, ...rest } = (matchConfig ?? {}) as MatchConfigLike;
  const filled: MatchConfigLike = { ...rest };
  for (const [key, fallback] of Object.entries(EMBEDDING_WEIGHT_KEYS)) {
    filled[key] = isMissing(rest[key]) ? fallback : Number(rest[key]);
  }
  return filled as T;
};

export const embeddingWeightsError = (matchConfig: MatchConfigLike | undefined | null): string | null => {
  const filled = withEmbeddingWeights(matchConfig ?? {}) as MatchConfigLike;
  const values = Object.keys(EMBEDDING_WEIGHT_KEYS).map(key => filled[key] as number);
  if (values.some(value => !Number.isFinite(value) || value < 0 || value > 1)) {
    return 'Embedding weights must be numbers between 0 and 1.';
  }
  const sum = values.reduce((total, value) => total + value, 0);
  if (Math.abs(sum - 1) > EMBEDDING_WEIGHTS_SUM_TOLERANCE) {
    return `Embedding weights must sum to 1.0 (current sum: ${sum.toFixed(3)}). Adjust them in Matching Controls.`;
  }
  return null;
};
