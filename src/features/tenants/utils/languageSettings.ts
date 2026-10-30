import {
  LANGUAGE_GATE_CAP_LIMIT,
  LANGUAGE_NUMERIC_SPECS,
  LANGUAGE_RECALL_MODES,
  LANGUAGE_RULE_MODES,
  LANGUAGE_SETTING_DEFAULTS,
} from '../constants/form.constants.ts';

type MatchConfigLike = Record<string, unknown>;

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

export const withMatchConfigDefaults = <T extends { match_config?: unknown }>(body: T): T =>
  body.match_config ? { ...body, match_config: withLanguageSettings(body.match_config as object) } : body;

export const languageFieldError = (key: string, value: unknown): string | null => {
  const spec = LANGUAGE_NUMERIC_SPECS.find(s => s.key === key);
  if (!spec) return null;
  if (value === '') return `${spec.label} is required.`;
  if (value === undefined || value === null) return null;
  const n = Number(value);
  const kind = spec.integer ? 'a whole number' : 'a number';
  if (!Number.isFinite(n) || (spec.integer && !Number.isInteger(n)) || n < spec.min || n > spec.max) {
    return `${spec.label} must be ${kind} between ${spec.min} and ${spec.max}.`;
  }
  if (key === 'language_gate_score_cap' && n >= LANGUAGE_GATE_CAP_LIMIT) {
    return `${spec.label} must be below ${LANGUAGE_GATE_CAP_LIMIT}.`;
  }
  return null;
};

export const languageSettingsError = (matchConfig: MatchConfigLike | undefined | null): string | null => {
  const cfg = matchConfig ?? {};
  const filled = withLanguageSettings(cfg) as MatchConfigLike;
  if (!(LANGUAGE_RULE_MODES as readonly string[]).includes(filled.language_rule_mode as string)) {
    return 'Language rule mode must be off, shadow, penalty or gate.';
  }
  if (!(LANGUAGE_RECALL_MODES as readonly string[]).includes(filled.language_recall_mode as string)) {
    return 'Language recall mode must be off, shadow or on.';
  }
  for (const spec of LANGUAGE_NUMERIC_SPECS) {
    const error = languageFieldError(spec.key, cfg[spec.key]);
    if (error) return error;
  }
  return null;
};
