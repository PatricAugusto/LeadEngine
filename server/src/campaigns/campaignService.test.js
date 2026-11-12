import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CampaignRequestError,
  addProspectsToCampaign,
  createCampaign,
  listCampaignProspects,
  updateCampaign,
  updateCampaignProspect,
} from './campaignService.js';

test('creates campaigns with normalized, bounded fields', async () => {
  let input;
  const prisma = {
    campaign: {
      create: async ({ data }) => {
        input = data;
        return { id: 'campaign-1', ...data, status: 'draft' };
      },
    },
  };

  const campaign = await createCampaign(prisma, { name: '  Feira Regional ', description: '  Primeiro contato  ' });

  assert.deepEqual(input, { name: 'Feira Regional', description: 'Primeiro contato' });
  assert.equal(campaign.statusLabel, 'Rascunho');
  await assert.rejects(() => createCampaign(prisma, { name: ' ' }), CampaignRequestError);
  await assert.rejects(() => createCampaign(prisma, { name: 'Campanha', description: 'x'.repeat(501) }), CampaignRequestError);
});

test('rejects invalid campaign updates and missing campaigns', async () => {
  let updateCalls = 0;
  const prisma = {
    campaign: {
      updateMany: async () => {
        updateCalls += 1;
        return { count: 0 };
      },
    },
  };

  await assert.rejects(() => updateCampaign(prisma, 'missing', { status: 'unknown' }), CampaignRequestError);
  await assert.rejects(
    () => updateCampaign(prisma, 'missing', { status: 'active' }),
    (error) => error instanceof CampaignRequestError && error.statusCode === 404,
  );
  assert.equal(updateCalls, 1);
});

test('adds only active prospects and reports duplicate memberships', async () => {
  const created = [];
  const prisma = {
    campaign: { findUnique: async () => ({ id: 'campaign-1' }) },
    prospect: {
      findMany: async ({ where }) => where.id.in
        .filter((id) => id !== 'missing')
        .map((id) => ({ id })),
    },
    campaignProspect: {
      findMany: async () => [{ prospectId: 'lead-1' }],
      create: async ({ data }) => { created.push(data); },
    },
    $transaction: async (operation) => operation(prisma),
  };

  const result = await addProspectsToCampaign(prisma, 'campaign-1', ['lead-1', 'lead-2', 'lead-2']);

  assert.deepEqual(result, { added: 1, alreadyIncluded: 1 });
  assert.deepEqual(created, [{ campaignId: 'campaign-1', prospectId: 'lead-2' }]);
  await assert.rejects(() => addProspectsToCampaign(prisma, 'campaign-1', ['lead-1', 'missing']), CampaignRequestError);
});

test('validates membership list filters and campaign lead status', async () => {
  const prisma = {
    campaign: { findUnique: async () => ({ id: 'campaign-1' }) },
    campaignProspect: {
      count: async () => 0,
      findMany: async () => [],
      updateMany: async () => ({ count: 1 }),
    },
  };

  await assert.rejects(() => listCampaignProspects(prisma, 'campaign-1', { page: 0 }), CampaignRequestError);
  await assert.rejects(() => updateCampaignProspect(prisma, 'campaign-1', 'lead-1', 'unknown'), CampaignRequestError);
  assert.deepEqual(
    await updateCampaignProspect(prisma, 'campaign-1', 'lead-1', 'responded'),
    {
      campaignId: 'campaign-1',
      prospectId: 'lead-1',
      status: 'responded',
      statusLabel: 'Respondeu',
    },
  );
});
