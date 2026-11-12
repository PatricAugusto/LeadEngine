import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SearchRequestError,
  validateStateFilter,
  validateStates,
} from './searchService.js';

test('normalizes and deduplicates selected Brazilian states', () => {
  assert.deepEqual(validateStates(['sp', 'SP', 'pr']), ['SP', 'PR']);
});

test('requires at least one valid state', () => {
  assert.throws(() => validateStates([]), SearchRequestError);
  assert.throws(() => validateStates(['XX']), /UF inválida: XX/);
});

test('validates an optional single-state filter', () => {
  assert.equal(validateStateFilter(undefined), undefined);
  assert.equal(validateStateFilter('sp'), 'SP');
  assert.throws(() => validateStateFilter('XX'), SearchRequestError);
  assert.throws(() => validateStateFilter(['SP']), SearchRequestError);
});
