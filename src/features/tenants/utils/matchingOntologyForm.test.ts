import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { MatchingOntology } from '../interfaces/matching-ontology.interface.ts';
import {
  buildPatch,
  describeChanges,
  errorMessage,
  formatCoverage,
  parseHubs,
  parseMaxHops,
  parseV2NotReady,
  toForm,
  validateForm,
} from './matchingOntologyForm.ts';

const base = (): MatchingOntology => ({
  account_id: 'a'.repeat(24),
  strict_enabled: true,
  max_hops: 2,
  blocked_hubs: ['it', 'software'],
  static_aliases_enabled: false,
  language_guard_enabled: false,
  esco_resolution_enabled: false,
  esco_global_enabled: true,
  store_version: 'v1',
  dual_write: false,
  sources: {
    strict_enabled: 'default',
    max_hops: 'default',
    blocked_hubs: 'default',
    static_aliases_enabled: 'default',
    language_guard_enabled: 'default',
    esco_resolution_enabled: 'default',
    store_version: 'default',
    dual_write: 'default',
  },
  diagnostics: null,
});

const withStoredHubs = (hubs: string[]): MatchingOntology => {
  const data = base();
  data.blocked_hubs = hubs;
  data.sources.blocked_hubs = 'stored';
  return data;
};

test('toForm shows default hubs when none are stored', () => {
  const form = toForm(base());
  assert.equal(form.useDefaultHubs, true);
  assert.equal(form.blockedHubsText, 'it\nsoftware');
  assert.equal(form.maxHops, '2');
});

test('toForm shows stored hubs', () => {
  const form = toForm(withStoredHubs(['engineering']));
  assert.equal(form.useDefaultHubs, false);
  assert.equal(form.blockedHubsText, 'engineering');
});

test('unchanged form yields empty patches and no changes', () => {
  const data = base();
  const form = toForm(data);
  for (const group of ['skill_graph', 'esco', 'embedding_store'] as const) {
    assert.deepEqual(buildPatch(data, form, group), {});
    assert.deepEqual(describeChanges(data, form, group), []);
  }
});

test('skill graph patch only carries changed fields', () => {
  const data = base();
  const form = { ...toForm(data), strictEnabled: false, maxHops: '3' };
  assert.deepEqual(buildPatch(data, form, 'skill_graph'), { strict_enabled: false, max_hops: 3 });
});

test('custom hubs are trimmed, deduplicated, and sent as blocked_hubs', () => {
  const data = base();
  const form = { ...toForm(data), useDefaultHubs: false, blockedHubsText: ' a, b\nA\n\nc ' };
  assert.deepEqual(buildPatch(data, form, 'skill_graph'), { blocked_hubs: ['a', 'b', 'c'] });
});

test('returning to default hubs sends reset_blocked_hubs only when custom list was stored', () => {
  const data = withStoredHubs(['x']);
  const form = { ...toForm(data), useDefaultHubs: true };
  assert.deepEqual(buildPatch(data, form, 'skill_graph'), { reset_blocked_hubs: true });
  assert.deepEqual(buildPatch(base(), { ...toForm(base()), useDefaultHubs: true }, 'skill_graph'), {});
});

test('esco patch maps each toggle', () => {
  const data = base();
  const form = { ...toForm(data), staticAliasesEnabled: true, languageGuardEnabled: true, escoResolutionEnabled: true };
  assert.deepEqual(buildPatch(data, form, 'esco'), {
    static_aliases_enabled: true,
    language_guard_enabled: true,
    esco_resolution_enabled: true,
  });
});

test('embedding patch sets force only when flipping to v2 with force', () => {
  const data = base();
  const form = { ...toForm(data), storeVersion: 'v2' as const };
  assert.deepEqual(buildPatch(data, form, 'embedding_store'), { store_version: 'v2' });
  assert.deepEqual(buildPatch(data, form, 'embedding_store', true), { store_version: 'v2', force: true });
  const dualOnly = { ...toForm(data), dualWrite: true };
  assert.deepEqual(buildPatch(data, dualOnly, 'embedding_store', true), { dual_write: true });
});

test('describeChanges lists before and after values', () => {
  const data = base();
  const form = { ...toForm(data), strictEnabled: false, languageGuardEnabled: true };
  assert.deepEqual(describeChanges(data, form, 'skill_graph'), [{ label: 'Strict skill graph', from: 'On', to: 'Off' }]);
  assert.deepEqual(describeChanges(data, form, 'esco'), [{ label: 'Language guard', from: 'Off', to: 'On' }]);
});

test('validation rejects bad max hops and empty custom hubs', () => {
  const form = { ...toForm(base()), maxHops: '5', useDefaultHubs: false, blockedHubsText: ' , ' };
  const errors = validateForm(form);
  assert.ok(errors.maxHops);
  assert.ok(errors.blockedHubs);
  assert.deepEqual(validateForm(toForm(base())), {});
  assert.equal(parseMaxHops('1.5'), null);
  assert.equal(parseMaxHops('0'), null);
  assert.equal(parseMaxHops('4'), 4);
  assert.deepEqual(parseHubs(''), []);
  const tooLong = { ...toForm(base()), useDefaultHubs: false, blockedHubsText: 'x'.repeat(101) };
  assert.ok(validateForm(tooLong).blockedHubs);
});

test('parseV2NotReady extracts 409 reasons', () => {
  const error = { response: { status: 409, data: { detail: { message: 'v2 store is not ready', problems: ['coverage 50%'] } } } };
  assert.deepEqual(parseV2NotReady(error), { message: 'v2 store is not ready', problems: ['coverage 50%'] });
  assert.equal(parseV2NotReady({ response: { status: 500 } }), null);
  assert.equal(parseV2NotReady(null), null);
});

test('errorMessage handles string, validation list, and fallback', () => {
  assert.equal(errorMessage({ response: { data: { detail: 'nope' } } }, 'x'), 'nope');
  assert.equal(errorMessage({ response: { data: { detail: [{ msg: 'bad' }, { msg: 'worse' }] } } }, 'x'), 'bad; worse');
  assert.equal(errorMessage(new Error('boom'), 'fallback'), 'fallback');
});

test('formatCoverage', () => {
  assert.equal(formatCoverage(null), 'Not available');
  assert.equal(formatCoverage(null, false), 'Table missing');
  assert.equal(formatCoverage({ v1_rows: 2000, v2_rows: 1500, ratio: 0.75 }), 'v2 75.0% (1,500 of 2,000 v1 rows)');
});

test('custom hubs equal to stored custom hubs are not a change', () => {
  const data = withStoredHubs(['a', 'b']);
  assert.deepEqual(buildPatch(data, toForm(data), 'skill_graph'), {});
});
