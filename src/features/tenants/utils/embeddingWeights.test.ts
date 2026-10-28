import assert from 'node:assert/strict';
import { test } from 'node:test';
import { embeddingWeightsError, withEmbeddingWeights } from './embeddingWeights.ts';

const stored = {
  embedding_weight_full_text: 0.3,
  embedding_weight_skills: 0.3,
  embedding_weight_experience: 0.2,
  embedding_weight_positions: 0.1,
  embedding_weight_companies: 0.1,
};

test('keeps stored weights and drops bio', () => {
  const out = withEmbeddingWeights<Record<string, unknown>>({ ...stored, embedding_weight_bio: 0.2, top_k: 7 });
  assert.equal(out.embedding_weight_full_text, 0.3);
  assert.equal(out.embedding_weight_companies, 0.1);
  assert.equal(out.top_k, 7);
  assert.ok(!('embedding_weight_bio' in out));
});

test('fills only missing weights with API defaults', () => {
  const out = withEmbeddingWeights<Record<string, unknown>>({ embedding_weight_full_text: 0.4, embedding_weight_skills: 0.25 });
  assert.equal(out.embedding_weight_full_text, 0.4);
  assert.equal(out.embedding_weight_experience, 0.15);
  assert.equal(out.embedding_weight_positions, 0.2);
  assert.equal(out.embedding_weight_companies, 0);
  assert.equal(embeddingWeightsError(undefined), null);
});

test('valid stored weights pass', () => {
  assert.equal(embeddingWeightsError(stored), null);
});

test('blocks a save whose weights do not sum to 1.0', () => {
  const message = embeddingWeightsError({ ...stored, embedding_weight_companies: 0.2 });
  assert.match(message ?? '', /must sum to 1\.0/);
});

test('blocks out-of-range weights', () => {
  assert.match(embeddingWeightsError({ ...stored, embedding_weight_skills: 1.5 }) ?? '', /between 0 and 1/);
});

test('uses the API tolerance of 0.01 so API-accepted configs are not blocked', () => {
  assert.equal(embeddingWeightsError({ ...stored, embedding_weight_companies: 0.105 }), null);
  assert.notEqual(embeddingWeightsError({ ...stored, embedding_weight_companies: 0.12 }), null);
});
