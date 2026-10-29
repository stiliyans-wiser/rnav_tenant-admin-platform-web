import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ENABLE_EFFECT_TEXT,
  PROBE_FAILED_TEXT,
  RESET_CONFIRM_TEXT,
  serverErrorDetail,
  withServerDetail,
  parseSchemaNotReady,
  runAvailabilityToggle,
  runConfirmedReset,
  schemaNotReadyMessage,
} from './decisionReasonsAvailability.ts';

const harness = (initial: boolean) => {
  const state = { value: initial, history: [] as boolean[] };
  const apply = (value: boolean) => {
    state.value = value;
    state.history.push(value);
  };
  return { state, apply };
};

const conflict = (missing: unknown) => ({
  response: { status: 409, data: { detail: { code: 'decision_schema_unhealthy', message: 'x', missing_columns: missing } } },
});

test('toggle applies optimistically, sends the value and keeps the server answer', async () => {
  const { state, apply } = harness(false);
  const sent: boolean[] = [];
  let seen: boolean | undefined;
  const result = await runAvailabilityToggle({
    previous: false,
    next: true,
    apply,
    request: async next => {
      seen = state.value;
      sent.push(next);
      return next;
    },
  });
  assert.deepEqual(result, { ok: true, schemaNotReady: null });
  assert.equal(seen, true);
  assert.deepEqual(sent, [true]);
  assert.equal(state.value, true);
});

test('toggle rolls back and reports no schema problem on a generic failure', async () => {
  const { state, apply } = harness(false);
  const result = await runAvailabilityToggle({
    previous: false,
    next: true,
    apply,
    request: async () => {
      throw new Error('500');
    },
  });
  assert.equal(result.ok, false);
  assert.equal(result.schemaNotReady, null);
  assert.equal((result.error as Error).message, '500');
  assert.equal(state.value, false);
  assert.deepEqual(state.history, [true, false]);
});

test('409 decision_schema_unhealthy rolls back and carries the missing columns', async () => {
  const { state, apply } = harness(false);
  const result = await runAvailabilityToggle({
    previous: false,
    next: true,
    apply,
    request: async () => {
      throw conflict(['candidate_status_events.reason_code', 'candidate_status_events.snapshot']);
    },
  });
  assert.equal(state.value, false);
  assert.equal(result.ok, false);
  assert.deepEqual(result.schemaNotReady, {
    missingColumns: ['candidate_status_events.reason_code', 'candidate_status_events.snapshot'],
  });
  assert.equal(
    schemaNotReadyMessage({ missingColumns: ['a.b', 'a.c'] }),
    'Database not ready: missing columns a.b, a.c - deploy/migration needed',
  );
});

test('parseSchemaNotReady ignores other 409s, other statuses and malformed details', () => {
  assert.equal(parseSchemaNotReady({ response: { status: 409, data: { detail: 'busy' } } }), null);
  assert.equal(parseSchemaNotReady({ response: { status: 409, data: { detail: { code: 'other' } } } }), null);
  assert.equal(parseSchemaNotReady({ response: { status: 500, data: { detail: { code: 'decision_schema_unhealthy' } } } }), null);
  assert.equal(parseSchemaNotReady(null), null);
  assert.deepEqual(parseSchemaNotReady(conflict(undefined)), { missingColumns: [] });
  assert.equal(schemaNotReadyMessage({ missingColumns: [] }), 'Database not ready: deploy/migration needed');
});

test('reset does not call the API unless confirmed', async () => {
  let calls = 0;
  const request = async () => {
    calls += 1;
  };
  assert.equal(await runConfirmedReset(false, request), 'cancelled');
  assert.equal(calls, 0);
  assert.equal(await runConfirmedReset(true, request), 'done');
  assert.equal(calls, 1);
});

test('reset reports failure and the confirm copy warns that the list is replaced', async () => {
  const result = await runConfirmedReset(true, async () => {
    throw new Error('500');
  });
  assert.equal(result, 'failed');
  assert.match(RESET_CONFIRM_TEXT, /replaces this tenant's reason list/);
});

test('probe-failed 409 shows a connectivity message, not a migration one', () => {
  const error = { response: { status: 409, data: { detail: { code: 'decision_schema_probe_failed', message: 'x' } } } };
  const parsed = parseSchemaNotReady(error);
  assert.deepEqual(parsed, { missingColumns: [], probeFailed: true });
  assert.equal(schemaNotReadyMessage(parsed!), PROBE_FAILED_TEXT);
});

test('enable copy states reasons go live immediately and are required', () => {
  assert.match(ENABLE_EFFECT_TEXT, /immediately/);
  assert.match(ENABLE_EFFECT_TEXT, /Exclude, put On hold, Drop, or Archive/);
});

test('server error detail is appended from string or object detail', () => {
  assert.equal(serverErrorDetail({ response: { data: { detail: 'Account not found' } } }), 'Account not found');
  assert.equal(serverErrorDetail({ response: { data: { detail: { message: 'bad' } } } }), 'bad');
  assert.equal(serverErrorDetail(new Error('x')), null);
  assert.equal(withServerDetail('Could not save.', { response: { data: { detail: 'nope' } } }), 'Could not save. nope');
  assert.equal(withServerDetail('Could not save.', null), 'Could not save.');
});
