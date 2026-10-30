import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMBEDDING_WEIGHT_DEFAULTS, LANGUAGE_NUMERIC_SPECS, LANGUAGE_SETTING_DEFAULTS, formFieldNames } from './form.constants.ts';

test('matchConfig field names expose no bio embedding weight', () => {
  const names = Object.values(formFieldNames.matchConfig);
  assert.ok(names.every(name => !name.includes('bio')));
  assert.ok(!('embeddingWeightBio' in formFieldNames.matchConfig));
});

test('embedding weight defaults are the five remaining weights summing to 1.0', () => {
  const values = Object.values(EMBEDDING_WEIGHT_DEFAULTS);
  assert.equal(values.length, 5);
  assert.ok(Math.abs(values.reduce((a, b) => a + b, 0) - 1) < 1e-9);
});

test('embedding weight defaults match the API MatchWeightConfig defaults', () => {
  assert.deepEqual({ ...EMBEDDING_WEIGHT_DEFAULTS }, { fullText: 0.4, skills: 0.25, experience: 0.15, positions: 0.2, companies: 0 });
});

test('language setting defaults match the API MatchWeightConfig defaults', () => {
  assert.deepEqual(
    { ...LANGUAGE_SETTING_DEFAULTS },
    {
      language_rule_mode: 'shadow',
      language_recall_mode: 'shadow',
      language_recall_pool_size: 100,
      language_reserved_slots_per_language: 3,
      language_reserved_slots_total: 6,
      language_penalty_score_cap: 40,
      language_gate_score_cap: 29,
    },
  );
});

test('language numeric specs use the API ranges and every field has a form name', () => {
  const ranges = Object.fromEntries(LANGUAGE_NUMERIC_SPECS.map(s => [s.key, [s.min, s.max, s.integer]]));
  assert.deepEqual(ranges, {
    language_recall_pool_size: [10, 300, true],
    language_reserved_slots_per_language: [0, 10, true],
    language_reserved_slots_total: [0, 12, true],
    language_penalty_score_cap: [0, 100, false],
    language_gate_score_cap: [0, 100, false],
  });
  for (const spec of LANGUAGE_NUMERIC_SPECS) {
    assert.equal(formFieldNames.matchConfig[spec.field], `match_config.${spec.key}`);
  }
});
