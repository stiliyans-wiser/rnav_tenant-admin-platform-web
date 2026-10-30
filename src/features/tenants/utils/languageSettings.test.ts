import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  languageFieldError,
  languagePenaltyCapWarning,
  languageSettingsError,
  withLanguageSettings,
  withMatchConfigDefaults,
} from './languageSettings.ts';
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
  language_rule_ignored_languages: ['english', 'dutch'],
};

test('missing API fields fall back to defaults', () => {
  const out = withLanguageSettings<Record<string, unknown>>({ top_k: 5 });
  assert.equal(out.language_rule_mode, 'shadow');
  assert.equal(out.language_gate_score_cap, 29);
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
    assert.equal(out.top_k, 7);
  });
}

test('bodies without match_config are untouched', () => {
  const body: { match_config?: unknown; provider_feature_flags: object } = { provider_feature_flags: { a: true } };
  assert.strictEqual(withMatchConfigDefaults(body), body);
});

test('valid stored config passes, including fractional caps', () => {
  assert.equal(languageSettingsError(stored), null);
  assert.equal(languageSettingsError({ ...stored, language_penalty_score_cap: 37.5, language_gate_score_cap: 29.5 }), null);
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

test('caps accept 0-100 and reject outside, non-numeric', () => {
  assert.notEqual(languageFieldError('language_penalty_score_cap', 101), null);
  assert.notEqual(languageFieldError('language_penalty_score_cap', -0.1), null);
  assert.notEqual(languageFieldError('language_penalty_score_cap', 'abc'), null);
  assert.equal(languageFieldError('language_penalty_score_cap', 100), null);
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

test('penalty cap at or below gate cap or under 30 warns, and blocks in penalty mode only', () => {
  const risky = { ...stored, language_penalty_score_cap: 25, language_gate_score_cap: 20 };
  assert.notEqual(languagePenaltyCapWarning(risky), null);
  assert.notEqual(languagePenaltyCapWarning({ ...stored, language_penalty_score_cap: 29, language_gate_score_cap: 29 }), null);
  assert.equal(languagePenaltyCapWarning({ ...stored, language_penalty_score_cap: 40, language_gate_score_cap: 29 }), null);
  assert.notEqual(languageSettingsError({ ...risky, language_rule_mode: 'penalty' }), null);
  assert.equal(languageSettingsError({ ...risky, language_rule_mode: 'gate' }), null);
});
