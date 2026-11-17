import assert from 'node:assert/strict';
import { test } from 'node:test';
import { selectionFusionBudgetError, selectionFusionError, withSelectionFusionSettings } from './selectionFusion.ts';
import { withMatchConfigDefaults } from './languageSettings.ts';
import { withEmbeddingWeights } from './embeddingWeights.ts';
import { SELECTION_FUSION_DEFAULTS, formFieldNames } from '../constants/form.constants.ts';

test('fusion defaults match the API contract', () => {
  assert.deepEqual({ ...SELECTION_FUSION_DEFAULTS }, { selection_fusion_extra_enabled: false, selection_fusion_extra_budget: 50, selection_option1_keepset_enabled: false });
});

test('fusion fields have form names under match_config', () => {
  assert.equal(formFieldNames.matchConfig.selectionFusionExtraEnabled, 'match_config.selection_fusion_extra_enabled');
  assert.equal(formFieldNames.matchConfig.selectionFusionExtraBudget, 'match_config.selection_fusion_extra_budget');
});

test('budget range 10..69 inclusive is accepted', () => {
  for (const ok of [10, 50, 69, '10', '69']) assert.equal(selectionFusionBudgetError(ok), null, String(ok));
});

test('budget 9 and 70 are rejected', () => {
  for (const bad of [9, 70, '9', '70']) assert.ok(selectionFusionBudgetError(bad), String(bad));
});

test('non-integer, empty and non-numeric budgets are rejected', () => {
  for (const bad of [10.5, '', 'abc', NaN]) assert.ok(selectionFusionBudgetError(bad), String(bad));
});

test('untouched budget (undefined or null) is valid', () => {
  assert.equal(selectionFusionBudgetError(undefined), null);
  assert.equal(selectionFusionError({ top_k: 5 }), null);
  assert.ok(selectionFusionError({ selection_fusion_extra_budget: 70 }));
});

test('PATCH body includes both keys when set, with the budget as a number', () => {
  const body = { match_config: withEmbeddingWeights({ top_k: 7, selection_fusion_extra_enabled: true, selection_fusion_extra_budget: '40' }) };
  const out = withMatchConfigDefaults(body).match_config as Record<string, unknown>;
  assert.strictEqual(out.selection_fusion_extra_enabled, true);
  assert.strictEqual(out.selection_fusion_extra_budget, 40);
});

test('an explicit off switch is still sent', () => {
  const out = withMatchConfigDefaults({ match_config: { top_k: 7, selection_fusion_extra_enabled: false } }).match_config as Record<string, unknown>;
  assert.strictEqual(out.selection_fusion_extra_enabled, false);
});

test('omitted keys are not sent, so the API keeps the stored values', () => {
  const out = withMatchConfigDefaults({ match_config: withEmbeddingWeights({ top_k: 7 }) }).match_config as Record<string, unknown>;
  assert.ok(!('selection_fusion_extra_enabled' in out));
  assert.ok(!('selection_fusion_extra_budget' in out));
  const kept = withSelectionFusionSettings({ top_k: 7, selection_fusion_extra_budget: undefined }) as Record<string, unknown>;
  assert.strictEqual(kept.selection_fusion_extra_budget, undefined);
});

test('option 1 keep-set switch has a form name and a false default', () => {
  assert.equal(formFieldNames.matchConfig.selectionOption1KeepsetEnabled, 'match_config.selection_option1_keepset_enabled');
  assert.strictEqual(SELECTION_FUSION_DEFAULTS.selection_option1_keepset_enabled, false);
});

test('option 1 keep-set value is sent in the PATCH body, on and explicit off', () => {
  for (const v of [true, false]) {
    const out = withMatchConfigDefaults({ match_config: withEmbeddingWeights({ top_k: 7, selection_option1_keepset_enabled: v }) }).match_config as Record<string, unknown>;
    assert.strictEqual(out.selection_option1_keepset_enabled, v);
  }
});

test('option 1 keep-set is not sent when the form never touched it', () => {
  const out = withMatchConfigDefaults({ match_config: withEmbeddingWeights({ top_k: 7 }) }).match_config as Record<string, unknown>;
  assert.ok(!('selection_option1_keepset_enabled' in out));
});
