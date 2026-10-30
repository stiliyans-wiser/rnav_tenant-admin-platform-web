import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  languageFieldError,
  languageSettingsError,
  withLanguageSettings,
  withMatchConfigDefaults,
} from './languageSettings.ts';
import { LANGUAGE_NUMERIC_SPECS, LANGUAGE_SETTING_DEFAULTS } from '../constants/form.constants.ts';
import { withEmbeddingWeights } from './embeddingWeights.ts';

const stored = {
  top_k: 20,
  language_rule_mode: 'gate',
  language_recall_mode: 'on',
  language_recall_pool_size: 250,
  language_reserved_slots_per_language: 5,
  language_reserved_slots_total: 9,
  language_penalty_score_cap: 35.5,
  language_gate_score_cap: 25,
  language_recall_min_similarity: 0.42,
  language_recall_max_gap_cosine: 0.2,
  language_rule_ignored_languages: ['english', 'dutch'],
};

test('missing API fields fall back to defaults', () => {
  const out = withLanguageSettings<Record<string, unknown>>({ top_k: 5 });
  assert.equal(out.language_rule_mode, 'shadow');
  assert.equal(out.language_gate_score_cap, 29);
  assert.equal(out.language_recall_min_similarity, 0.3);
  assert.equal(out.language_recall_max_gap_cosine, 0.15);
  assert.ok(!('language_rule_ignored_languages' in out));
});

// Mirrors EditTenant.getRequestBody for each section: match-config sections send withEmbeddingWeights(match_config),
// every other section sends the whole form values; EditTenant then runs withMatchConfigDefaults on the body.
const partial = {
  language_rule_mode: 'gate',
  language_gate_score_cap: '25',
  language_rule_ignored_languages: ['english', 'dutch'],
  top_k: 7,
};
const sectionBodies: Record<string, Record<string, unknown>> = {
  matchingControls: { match_config: withEmbeddingWeights(partial) },
  uiConfig: { match_config: withEmbeddingWeights(partial) },
  candidateDelivery: { match_config: withEmbeddingWeights(partial), report_config: {} },
  aiServices: { company_name: 'x', ai_config: {}, match_config: { ...partial } },
  generalDetails: { company_name: 'x', match_config: { ...partial } },
};

for (const [section, body] of Object.entries(sectionBodies)) {
  test(`${section} save keeps stored language values and fills only missing ones`, () => {
    const out = withMatchConfigDefaults(body).match_config as Record<string, unknown>;
    assert.equal(out.language_rule_mode, 'gate');
    assert.strictEqual(out.language_gate_score_cap, 25);
    assert.deepEqual(out.language_rule_ignored_languages, ['english', 'dutch']);
    assert.equal(out.language_recall_mode, 'shadow');
    assert.equal(out.language_recall_pool_size, 100);
    assert.equal(out.language_penalty_score_cap, 40);
    assert.equal(out.language_recall_min_similarity, 0.3);
    assert.equal(out.language_recall_max_gap_cosine, 0.15);
    assert.equal(out.top_k, 7);
  });
}

test('bodies without match_config are untouched', () => {
  const body: { match_config?: unknown; provider_feature_flags: object } = { provider_feature_flags: { a: true } };
  assert.strictEqual(withMatchConfigDefaults(body), body);
});

test('valid stored config passes, including fractional caps', () => {
  assert.equal(languageSettingsError(stored), null);
  assert.equal(languageSettingsError({ ...stored, language_gate_score_cap: 29.5 }), null);
  assert.equal(languageSettingsError(undefined), null);
});

test('pool and slots are integers within the API ranges', () => {
  assert.notEqual(languageFieldError('language_recall_pool_size', 9), null);
  assert.notEqual(languageFieldError('language_recall_pool_size', 301), null);
  assert.equal(languageFieldError('language_recall_pool_size', 10), null);
  assert.equal(languageFieldError('language_recall_pool_size', 300), null);
  assert.notEqual(languageFieldError('language_recall_pool_size', 100.5), null);
  assert.notEqual(languageFieldError('language_reserved_slots_per_language', 11), null);
  assert.notEqual(languageFieldError('language_reserved_slots_per_language', -1), null);
  assert.notEqual(languageFieldError('language_reserved_slots_total', 13), null);
  assert.equal(languageFieldError('language_reserved_slots_total', 12), null);
});

test('cosine fields accept 0-1 and reject outside, non-numeric', () => {
  for (const key of ['language_recall_min_similarity', 'language_recall_max_gap_cosine']) {
    assert.notEqual(languageFieldError(key, 1.01), null);
    assert.notEqual(languageFieldError(key, -0.01), null);
    assert.notEqual(languageFieldError(key, 'abc'), null);
    assert.equal(languageFieldError(key, 0), null);
    assert.equal(languageFieldError(key, 1), null);
    assert.equal(languageFieldError(key, 0.15), null);
    assert.match(languageFieldError(key, 2) ?? '', /between 0 and 1/);
  }
});

test('gate cap accepts 0-100 and rejects outside, non-numeric', () => {
  assert.notEqual(languageFieldError('language_gate_score_cap', 101), null);
  assert.notEqual(languageFieldError('language_gate_score_cap', -0.1), null);
  assert.notEqual(languageFieldError('language_gate_score_cap', 'abc'), null);
});

test('deprecated penalty cap is not editable but is sent unchanged', () => {
  assert.equal(LANGUAGE_NUMERIC_SPECS.some(s => (s.key as string) === 'language_penalty_score_cap'), false);
  assert.equal(languageFieldError('language_penalty_score_cap', 1000), null);
  const out = withMatchConfigDefaults({ match_config: { ...stored, language_penalty_score_cap: 35.5 } }).match_config as Record<string, unknown>;
  assert.equal(out.language_penalty_score_cap, 35.5);
});

test('every editable field has a default and a form name, and a blank default-filled config carries all of them', () => {
  const filled = withLanguageSettings<Record<string, unknown>>({});
  for (const spec of LANGUAGE_NUMERIC_SPECS) {
    assert.equal(filled[spec.key], LANGUAGE_SETTING_DEFAULTS[spec.key]);
  }
  assert.equal(filled.language_rule_mode, 'shadow');
  assert.equal(filled.language_recall_mode, 'shadow');
});

test('full save payload carries the whole match_config including new fields', () => {
  const body = withMatchConfigDefaults({ match_config: withEmbeddingWeights({ ...stored, language_recall_min_similarity: '0.45' }) });
  const out = body.match_config as Record<string, unknown>;
  assert.deepEqual(
    { ...out, language_recall_min_similarity: undefined },
    { ...withEmbeddingWeights(stored), language_recall_min_similarity: undefined },
  );
  assert.strictEqual(out.language_recall_min_similarity, 0.45);
  assert.strictEqual(out.language_recall_max_gap_cosine, 0.2);
  assert.equal(out.top_k, 20);
  assert.deepEqual(out.language_rule_ignored_languages, ['english', 'dutch']);
});

test('gate cap must be below 30', () => {
  assert.match(languageFieldError('language_gate_score_cap', 30) ?? '', /below 30/);
  assert.equal(languageFieldError('language_gate_score_cap', 29.9), null);
});

test('empty numeric field is a required error, not a silent default', () => {
  assert.match(languageSettingsError({ ...stored, language_recall_pool_size: '' }) ?? '', /required/);
  assert.equal(languageFieldError('language_gate_score_cap', undefined), null);
});

test('range errors name the field and range', () => {
  assert.match(languageFieldError('language_recall_pool_size', 5) ?? '', /Recall pool size.*10 and 300/);
});

test('rejects unknown modes', () => {
  assert.notEqual(languageSettingsError({ ...stored, language_rule_mode: 'strict' }), null);
  assert.notEqual(languageSettingsError({ ...stored, language_recall_mode: 'penalty' }), null);
});

test('hidden penalty cap is raised to the gate cap so penalty >= gate always holds', () => {
  const sent = (cfg: Record<string, unknown>) => withMatchConfigDefaults({ match_config: cfg }).match_config as Record<string, unknown>;
  assert.strictEqual(sent({ ...stored, language_penalty_score_cap: 25, language_gate_score_cap: 29 }).language_penalty_score_cap, 29);
  assert.strictEqual(sent({ ...stored, language_penalty_score_cap: 40, language_gate_score_cap: 29 }).language_penalty_score_cap, 40);
  assert.strictEqual(sent({ ...stored, language_penalty_score_cap: 25, language_gate_score_cap: '29' }).language_penalty_score_cap, 29);
});

test('gate cap input allows decimals and caps the HTML max below 30', () => {
  const gate = LANGUAGE_NUMERIC_SPECS.find(s => s.key === 'language_gate_score_cap');
  assert.equal(gate?.step, 'any');
  assert.equal((gate as { htmlMax?: number }).htmlMax, 29.99);
});
