import { SELECTION_FUSION_BUDGET_MAX, SELECTION_FUSION_BUDGET_MIN } from '../constants/form.constants.ts';

type MatchConfigLike = Record<string, unknown>;

export const selectionFusionBudgetError = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  const message = `Fusion judge-set budget must be a whole number between ${SELECTION_FUSION_BUDGET_MIN} and ${SELECTION_FUSION_BUDGET_MAX}.`;
  if (value === '') return message;
  const n = Number(value);
  if (!Number.isInteger(n) || n < SELECTION_FUSION_BUDGET_MIN || n > SELECTION_FUSION_BUDGET_MAX) return message;
  return null;
};

export const selectionFusionError = (matchConfig: MatchConfigLike | undefined | null): string | null =>
  selectionFusionBudgetError((matchConfig ?? {}).selection_fusion_extra_budget);

// Keys the form never touched stay absent so the API keeps the stored value; a present budget is sent as a number.
export const withSelectionFusionSettings = <T extends object>(matchConfig: T): T => {
  const cfg = matchConfig as MatchConfigLike;
  const budget = cfg.selection_fusion_extra_budget;
  if (budget === undefined || budget === null || budget === '') return matchConfig;
  return { ...cfg, selection_fusion_extra_budget: Number(budget) } as T;
};
