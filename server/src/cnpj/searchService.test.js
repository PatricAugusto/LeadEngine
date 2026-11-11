import assert from 'node:assert/strict';
import test from 'node:test';
import { SearchRequestError, validateStates } from './searchService.js';

test('normalizes and deduplicates selected Brazilian states', () => {
  assert.deepEqual(validateStates(['sp', 'SP', 'pr']), ['SP', 'PR']);
});

test('requires at least one valid state', () => {
  assert.throws(() => validateStates([]), SearchRequestError);
  assert.throws(() => validateStates(['XX']), /UF inválida: XX/);
});
