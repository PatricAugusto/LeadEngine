import assert from 'node:assert/strict';
import test from 'node:test';
import { getReportData } from './reportService.js';

test('summarizes prospect, campaign, and search data with bounded rankings', async () => {
  const prisma = {
    prospect: {
      count: async () => 80,
      groupBy: async ({ by }) => {
        if (by[0] === 'status') return [{ status: 'new', _count: { _all: 60 } }];
        if (by[0] === 'state') {
          return Array.from({ length: 11 }, (_, index) => ({
            state: `S${index}`,
            _count: { _all: 11 - index },
          }));
        }
        return Array.from({ length: 12 }, (_, index) => ({
          cnaePrimary: String(index),
          _count: { _all: 12 - index },
        }));
      },
    },
    campaign: {
      count: async () => 3,
      groupBy: async () => [{ status: 'active', _count: { _all: 2 } }],
    },
    campaignProspect: {
      groupBy: async () => [{ status: 'pending', _count: { _all: 8 } }],
    },
    searchRun: {
      count: async ({ where }) => (where.status === 'completed' ? 4 : 1),
    },
  };

  const report = await getReportData(prisma);

  assert.equal(report.metrics.activeProspects, 80);
  assert.equal(report.metrics.campaigns, 3);
  assert.equal(report.states.length, 10);
  assert.equal(report.sectors.length, 10);
  assert.deepEqual(report.campaignLeadsByStatus, [{ status: 'pending', total: 8 }]);
  assert.equal(report.metrics.failedRuns, 1);
  assert.doesNotThrow(() => new Date(report.generatedAt).toISOString());
});
