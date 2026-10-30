import { embeddingWeightsError, withEmbeddingWeights } from './embeddingWeights.ts';

export const LANGUAGE_RULE_MODES = ['off', 'shadow', 'penalty', 'gate'] as const;
export const LANGUAGE_RECALL_MODES = ['off', 'shadow', 'on'] as const;

export const LANGUAGE_SETTING_DEFAULTS = {
  language_rule_mode: 'shadow',
  language_recall_mode: 'shadow',
  language_recall_pool_size: 100,
  language_reserved_slots_per_language: 3,
  language_reserved_slots_total: 6,
  language_penalty_score_cap: 40,
  language_gate_score_cap: 29,
} as const;

export const LANGUAGE_GATE_CAP_LIMIT = 30;

type MatchConfigLike = Record<string, unknown>;

const NUMERIC_KEYS = [
  'language_recall_pool_size',
  'language_reserved_slots_per_language',
  'language_reserved_slots_total',
  'language_penalty_score_cap',
  'language_gate_score_cap',
] as const;

const isMissing = (value: unknown) => value === undefined || value === null || value === '';

export const withLanguageSettings = <T extends object>(matchConfig: T | undefined | null): T => {
  const filled: MatchConfigLike = { ...((matchConfig ?? {}) as MatchConfigLike) };
  for (const [key, fallback] of Object.entries(LANGUAGE_SETTING_DEFAULTS)) {
    const current = filled[key];
    if (isMissing(current)) {
      filled[key] = fallback;
    } else if (typeof fallback === 'number') {
      filled[key] = Number(current);
    }
  }
  return filled as T;
};

export const languageSettingsError = (matchConfig: MatchConfigLike | undefined | null): string | null => {
  const filled = withLanguageSettings(matchConfig ?? {}) as MatchConfigLike;
  if (!(LANGUAGE_RULE_MODES as readonly string[]).includes(filled.language_rule_mode as string)) {
    return 'Language rule mode must be off, shadow, penalty or gate.';
  }
  if (!(LANGUAGE_RECALL_MODES as readonly string[]).includes(filled.language_recall_mode as string)) {
    return 'Language recall mode must be off, shadow or on.';
  }
  if (NUMERIC_KEYS.some(key => !Number.isInteger(filled[key]) || (filled[key] as number) < 0)) {
    return 'Language settings must be whole numbers of 0 or more.';
  }
  if ((filled.language_gate_score_cap as number) >= LANGUAGE_GATE_CAP_LIMIT) {
    return `Language gate score cap must be below ${LANGUAGE_GATE_CAP_LIMIT}.`;
  }
  return null;
};

export const buildMatchConfigRequestBody = <T extends object>(matchConfig: T | undefined | null): T =>
  withLanguageSettings(withEmbeddingWeights(matchConfig));

export const matchConfigError = (matchConfig: MatchConfigLike | undefined | null): string | null =>
  embeddingWeightsError(matchConfig) ?? languageSettingsError(matchConfig);
