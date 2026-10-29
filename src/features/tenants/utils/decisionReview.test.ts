import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_FILTERS,
  EXPORT_MAX_ROWS,
  attentionLabel,
  buildExportParams,
  buildListParams,
  driftView,
  exportFilename,
  exportNotice,
  formatDelta,
  formatScore,
  formatScoreTransition,
  mapReviewError,
  parseExportHeaders,
  statusLabel,
  validateFilters,
} from './decisionReview.ts';

test('default filters send only the default statuses and attention sort', () => {
  assert.deepEqual(buildListParams(DEFAULT_FILTERS, 0, 50), {
    sort: 'attention',
    statuses: 'excluded,on_hold,dropped',
    limit: 50,
    offset: 0,
  });
});

test('list params carry every filter and the page offset', () => {
  const params = buildListParams(
    {
      ...DEFAULT_FILTERS,
      statuses: ['excluded'],
      dateFrom: '2026-10-01',
      dateTo: '2026-10-29',
      reasonCode: ' seniority_too_low ',
      recruiter: 'a@b.c',
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      scoreMin: '70',
      scoreMax: '100',
      includeCascade: true,
      needsAttention: true,
      sort: 'newest',
    },
    2,
    25,
  );
  assert.deepEqual(params, {
    sort: 'newest',
    statuses: 'excluded',
    date_from: '2026-10-01',
    date_to: '2026-10-29',
    reason_code: 'seniority_too_low',
    recruiter: 'a@b.c',
    job_id: '123e4567-e89b-12d3-a456-426614174000',
    score_min: 70,
    score_max: 100,
    include_cascade: true,
    needs_attention: true,
    limit: 25,
    offset: 50,
  });
});

test('export params reuse the filters and add format and cap, no paging', () => {
  const params = buildExportParams(DEFAULT_FILTERS, 'csv');
  assert.equal(params.format, 'csv');
  assert.equal(params.max_rows, EXPORT_MAX_ROWS);
  assert.equal('limit' in params, false);
  assert.equal('offset' in params, false);
  assert.equal(params.statuses, 'excluded,on_hold,dropped');
});

test('score 0 is kept as a filter value', () => {
  assert.equal(buildListParams({ ...DEFAULT_FILTERS, scoreMin: '0' }, 0, 50).score_min, 0);
});

test('validation catches bad ranges, scores and job ids', () => {
  assert.equal(validateFilters(DEFAULT_FILTERS), null);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, statuses: [] })!, /status/);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, dateFrom: '2026-10-02', dateTo: '2026-10-01' })!, /date/);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, scoreMin: '101' })!, /Min score/);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, scoreMax: 'abc' })!, /Max score/);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, scoreMin: '80', scoreMax: '20' })!, /above/);
  assert.match(validateFilters({ ...DEFAULT_FILTERS, jobId: 'nope' })!, /UUID/);
});

test('score formatting', () => {
  assert.equal(formatScore(null), '-');
  assert.equal(formatScore(87.46), '87.5');
  assert.equal(formatScoreTransition(91, 62.25), '91 → 62.3');
  assert.equal(formatScoreTransition(null, 50), '- → 50');
  assert.equal(formatDelta(-28.74), '-28.7');
  assert.equal(formatDelta(3), '+3');
  assert.equal(formatDelta(null), '-');
});

test('labels', () => {
  assert.equal(attentionLabel('high_score_excluded'), 'High score excluded');
  assert.equal(attentionLabel(''), '');
  assert.equal(statusLabel('on_hold'), 'On hold');
  assert.equal(statusLabel('custom_thing'), 'Custom thing');
});

test('drift view distinguishes unknown, same and drifted', () => {
  assert.equal(driftView(null).drifted, false);
  assert.match(driftView(null).text, /unknown/);
  assert.equal(driftView(false).drifted, false);
  const d = driftView(true, 84, 12);
  assert.equal(d.drifted, true);
  assert.match(d.text, /score 84/);
  assert.match(d.text, /run 12/);
});

test('export headers parse from a plain object and from a Headers-like getter', () => {
  const plain = parseExportHeaders({ 'x-export-rows': '20000', 'x-export-total': '31000', 'x-export-truncated': 'true' });
  assert.deepEqual(plain, { rows: 20000, total: 31000, truncated: true });
  const map = new Map([['x-export-rows', '5'], ['x-export-total', '5'], ['x-export-truncated', 'false']]);
  assert.deepEqual(parseExportHeaders(map), { rows: 5, total: 5, truncated: false });
  assert.deepEqual(parseExportHeaders(undefined), { rows: null, total: null, truncated: false });
  assert.deepEqual(parseExportHeaders({ 'x-export-rows': 'abc' }), { rows: null, total: null, truncated: false });
});

test('export notice warns when truncated', () => {
  const warn = exportNotice({ rows: 20000, total: 31000, truncated: true });
  assert.equal(warn.severity, 'warning');
  assert.match(warn.text, /20000 of 31000/);
  assert.equal(exportNotice({ rows: 12, total: 12, truncated: false }).severity, 'success');
  assert.equal(exportNotice({ rows: null, total: null, truncated: false }).text, 'Export downloaded.');
});

test('export filename comes from content-disposition with a fallback', () => {
  assert.equal(exportFilename('attachment; filename="decision_review_x.xlsx"', 'xlsx'), 'decision_review_x.xlsx');
  assert.equal(exportFilename(undefined, 'csv'), 'decision_review.csv');
});

const apiError = (status: number, detail: unknown) => ({ response: { status, data: { detail } } });

test('error mapping for the documented codes', () => {
  const unavailable = mapReviewError(apiError(409, { code: 'decision_events_unavailable', message: 'x' }));
  assert.equal(unavailable.status, 409);
  assert.match(unavailable.message, /no decision history/);
  assert.match(mapReviewError(apiError(409, { code: 'tenant_db_unavailable', message: 'x' })).message, /no database/);
  assert.match(mapReviewError(apiError(404, { code: 'account_not_found', message: 'x' })).message, /no longer exists/);
  assert.match(mapReviewError(apiError(404, { code: 'decision_event_not_found', message: 'x' })).message, /not found/);
});

test('error mapping for 422, 403, network and unknown shapes', () => {
  assert.match(mapReviewError(apiError(422, { code: 'invalid_date_range', message: 'date_from is after date_to' })).message, /after date_to/);
  assert.match(mapReviewError(apiError(403, 'Forbidden')).message, /access/);
  assert.match(mapReviewError(new Error('boom')).message, /Could not reach/);
  assert.match(mapReviewError(apiError(500, 'Internal')).message, /Internal/);
  assert.equal(mapReviewError(apiError(500, undefined)).message, 'Request failed. Try again.');
});
