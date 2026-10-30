import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LANGUAGE_SETTING_DEFAULTS, languageSettingsError, withLanguageSettings, buildMatchConfigRequestBody } from './languageSettings.ts';

const stored = {
  top_k: 20,
  language_rule_mode: 'gate',
  language_recall_mode: 'on',
  language_recall_pool_size: 250,
  language_reserved_slots_per_language: 5,
  language_reserved_slots_total: 9,
  language_penalty_score_cap: 35,
  language_gate_score_cap: 25,
  language_rule_ignored_languages: ['english', 'dutch'],
};

test('defaults match the backend defaults', () => {
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

test('missing API fields fall back to defaults', () => {
  const out = withLanguageSettings<Record<string, unknown>>({ top_k: 5 });
  assert.equal(out.language_rule_mode, 'shadow');
  assert.equal(out.language_gate_score_cap, 29);
  assert.ok(!('language_rule_ignored_languages' in out));
});

test('save payload round-trips every language field, including ignored languages', () => {
  const out = buildMatchConfigRequestBody<Record<string, unknown>>({ ...stored, top_k: 99 });
  for (const [key, value] of Object.entries(stored)) {
    if (key === 'top_k') continue;
    assert.deepEqual(out[key], value, key);
  }
  assert.equal(out.top_k, 99);
});

test('numeric strings from inputs are coerced to numbers', () => {
  const out = withLanguageSettings<Record<string, unknown>>({ ...stored, language_recall_pool_size: '120' });
  assert.equal(out.language_recall_pool_size, 120);
});

test('valid config passes', () => {
  assert.equal(languageSettingsError(stored), null);
  assert.equal(languageSettingsError(undefined), null);
});

test('rejects negative, fractional and non-numeric values', () => {
  assert.notEqual(languageSettingsError({ ...stored, language_recall_pool_size: -1 }), null);
  assert.notEqual(languageSettingsError({ ...stored, language_reserved_slots_total: 2.5 }), null);
  assert.notEqual(languageSettingsError({ ...stored, language_penalty_score_cap: 'abc' }), null);
});

test('gate cap must be below 30', () => {
  assert.match(languageSettingsError({ ...stored, language_gate_score_cap: 30 }) ?? '', /below 30/);
  assert.equal(languageSettingsError({ ...stored, language_gate_score_cap: 29 }), null);
});

test('rejects unknown modes', () => {
  assert.notEqual(languageSettingsError({ ...stored, language_rule_mode: 'strict' }), null);
  assert.notEqual(languageSettingsError({ ...stored, language_recall_mode: 'penalty' }), null);
});
