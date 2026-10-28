import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMBEDDING_WEIGHT_DEFAULTS, embeddingWeightsSum, formFieldNames } from './form.constants.ts';

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

test('embeddingWeightsSum uses stored values and falls back to defaults only for missing ones', () => {
  const defaults = Object.values(EMBEDDING_WEIGHT_DEFAULTS);
  assert.ok(Math.abs(embeddingWeightsSum([0.3, 0.3, 0.2, 0.1, 0.1], defaults) - 1) < 1e-9);
  assert.ok(Math.abs(embeddingWeightsSum([undefined, undefined, undefined, undefined, undefined], defaults) - 1) < 1e-9);
  assert.ok(Math.abs(embeddingWeightsSum([0.5, 0.25, 0.15, undefined, null], defaults) - 1.1) < 1e-9);
});
