import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeEstablishment, parseReceitaDate } from './normalize.js';

function establishment(overrides = {}) {
  const row = Array(30).fill('');
  row[0] = '12345678';
  row[1] = '0001';
  row[2] = '90';
  row[4] = 'Unidade central';
  row[5] = '02';
  row[10] = '20200131';
  row[11] = '6201501';
  row[19] = 'SP';
  row[20] = '7107';
  return Object.assign(row, overrides);
}

test('normalizes active establishments with company and reference data', () => {
  const result = normalizeEstablishment(
    establishment(),
    new Set(['SP']),
    { companyName: 'Empresa Exemplo Ltda', companySize: 'Microempresa' },
    new Map([['6201501', 'Desenvolvimento de programas']]),
    new Map([['7107', 'São Paulo']]),
    '2026-10',
  );

  assert.deepEqual(result, {
    cnpj: '12345678000190',
    companyName: 'Empresa Exemplo Ltda',
    tradeName: 'Unidade central',
    cnaePrimary: '6201501',
    cnaeDescription: 'Desenvolvimento de programas',
    city: 'São Paulo',
    state: 'SP',
    companySize: 'Microempresa',
    openedAt: new Date('2020-01-31T00:00:00.000Z'),
    sourceVersion: '2026-10',
  });
});

test('ignores inactive establishments, unselected states, and missing companies', () => {
  const row = establishment();
  const company = { companyName: 'Empresa', companySize: null };
  const states = new Set(['SP']);
  const emptyMap = new Map();

  row[5] = '08';
  assert.equal(normalizeEstablishment(row, states, company, emptyMap, emptyMap, '2026-10'), null);
  row[5] = '02';
  row[19] = 'RJ';
  assert.equal(normalizeEstablishment(row, states, company, emptyMap, emptyMap, '2026-10'), null);
  row[19] = 'SP';
  assert.equal(normalizeEstablishment(row, states, null, emptyMap, emptyMap, '2026-10'), null);
});

test('rejects invalid CNPJ dates and preserves valid dates as UTC', () => {
  assert.equal(parseReceitaDate('20210229'), null);
  assert.equal(parseReceitaDate('00000000'), null);
  assert.equal(parseReceitaDate(''), null);
  assert.equal(parseReceitaDate('20240229')?.toISOString(), '2024-02-29T00:00:00.000Z');
});
