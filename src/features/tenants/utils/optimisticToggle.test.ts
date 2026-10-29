import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runOptimisticToggle } from './optimisticToggle.ts';

const harness = (initial: boolean) => {
  const state = { value: initial, history: [] as boolean[] };
  const apply = (value: boolean) => {
    state.value = value;
    state.history.push(value);
  };
  return { state, apply };
};

test('applies the new value optimistically before the request resolves', async () => {
  const { state, apply } = harness(false);
  let seenDuringRequest: boolean | undefined;
  const ok = await runOptimisticToggle({
    previous: false,
    next: true,
    apply,
    request: async next => {
      seenDuringRequest = state.value;
      return next;
    },
  });
  assert.equal(seenDuringRequest, true);
  assert.equal(ok, true);
  assert.equal(state.value, true);
});

test('sends the requested value to the PATCH and keeps the server value', async () => {
  const { state, apply } = harness(true);
  const sent: boolean[] = [];
  await runOptimisticToggle({
    previous: true,
    next: false,
    apply,
    request: async next => {
      sent.push(next);
      return false;
    },
  });
  assert.deepEqual(sent, [false]);
  assert.equal(state.value, false);
});

test('rolls back to the previous value when the request fails', async () => {
  const { state, apply } = harness(false);
  const ok = await runOptimisticToggle({
    previous: false,
    next: true,
    apply,
    request: async () => {
      throw new Error('500');
    },
  });
  assert.equal(ok, false);
  assert.equal(state.value, false);
  assert.deepEqual(state.history, [true, false]);
});
