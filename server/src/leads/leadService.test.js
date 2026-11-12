import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LeadRequestError,
  parseLeadStatusFilter,
  updateLeadStatus,
} from './leadService.js';

test('accepts known status filters and rejects invalid values', () => {
  assert.equal(parseLeadStatusFilter(undefined), undefined);
  assert.equal(parseLeadStatusFilter('qualified'), 'qualified');
  assert.throws(() => parseLeadStatusFilter('unknown'), LeadRequestError);
  assert.throws(() => parseLeadStatusFilter(['new']), LeadRequestError);
});

test('updates the status of an active lead and returns its label', async () => {
  let update;
  const prisma = {
    prospect: {
      updateMany: async (args) => {
        update = args;
        return { count: 1 };
      },
    },
  };

  const result = await updateLeadStatus(prisma, 'lead-1', 'qualified');

  assert.deepEqual(update, {
    where: { id: 'lead-1', sourceActive: true },
    data: { status: 'qualified' },
  });
  assert.deepEqual(result, {
    id: 'lead-1',
    status: 'qualified',
    statusLabel: 'Qualificado',
  });
});

test('rejects invalid status changes and inactive or missing leads', async () => {
  let updates = 0;
  const prisma = {
    prospect: {
      updateMany: async () => {
        updates += 1;
        return { count: 0 };
      },
    },
  };

  await assert.rejects(
    () => updateLeadStatus(prisma, 'lead-1', 'unknown'),
    LeadRequestError,
  );
  await assert.rejects(
    () => updateLeadStatus(prisma, 'missing', 'contacted'),
    (error) => error instanceof LeadRequestError && error.statusCode === 404,
  );
  assert.equal(updates, 1);
});
