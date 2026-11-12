const count = (group) => group._count._all;

export async function getReportData(prisma) {
  const active = { sourceActive: true };
  const [
    activeProspects,
    statuses,
    states,
    sectors,
    campaigns,
    campaignStatuses,
    campaignLeadStatuses,
    completedRuns,
    failedRuns,
  ] = await Promise.all([
    prisma.prospect.count({ where: active }),
    prisma.prospect.groupBy({ by: ['status'], where: active, _count: { _all: true } }),
    prisma.prospect.groupBy({ by: ['state'], where: active, _count: { _all: true } }),
    prisma.prospect.groupBy({ by: ['cnaePrimary'], where: active, _count: { _all: true } }),
    prisma.campaign.count(),
    prisma.campaign.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.campaignProspect.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.searchRun.count({ where: { status: 'completed' } }),
    prisma.searchRun.count({ where: { status: 'failed' } }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      activeProspects,
      campaigns,
      completedRuns,
      failedRuns,
    },
    statuses: statuses.map((item) => ({ status: item.status, total: count(item) })),
    states: states
      .map((item) => ({ state: item.state, total: count(item) }))
      .sort((left, right) => right.total - left.total || left.state.localeCompare(right.state))
      .slice(0, 10),
    sectors: sectors
      .map((item) => ({ cnae: item.cnaePrimary, total: count(item) }))
      .sort((left, right) => right.total - left.total || left.cnae.localeCompare(right.cnae))
      .slice(0, 10),
    campaignsByStatus: campaignStatuses.map((item) => ({
      status: item.status,
      total: count(item),
    })),
    campaignLeadsByStatus: campaignLeadStatuses.map((item) => ({
      status: item.status,
      total: count(item),
    })),
  };
}
