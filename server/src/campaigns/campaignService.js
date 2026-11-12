export const campaignStatuses = Object.freeze({
  draft: 'Rascunho',
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída',
});

export const campaignLeadStatuses = Object.freeze({
  pending: 'Pendente',
  contacted: 'Contatado',
  responded: 'Respondeu',
  meeting: 'Reunião',
  converted: 'Convertido',
  excluded: 'Excluído',
});

const campaignIdPattern = /^[a-zA-Z0-9_-]{1,100}$/;

export class CampaignRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'CampaignRequestError';
    this.statusCode = statusCode;
  }
}

function validateId(id) {
  if (typeof id !== 'string' || !campaignIdPattern.test(id)) {
    throw new CampaignRequestError('Identificador de campanha ou lead inválido.');
  }
  return id;
}

function validateCampaignContent({ name, description }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw new CampaignRequestError('O nome da campanha deve ter entre 2 e 100 caracteres.');
  }
  if (description !== undefined
    && description !== null
    && (typeof description !== 'string' || description.trim().length > 500)) {
    throw new CampaignRequestError('A descrição deve ter no máximo 500 caracteres.');
  }
  return {
    name: name.trim(),
    description: typeof description === 'string' && description.trim()
      ? description.trim()
      : null,
  };
}

export async function listCampaigns(prisma) {
  const campaigns = await prisma.campaign.findMany({
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    include: { _count: { select: { prospects: true } } },
  });
  return campaigns.map(({ _count, ...campaign }) => ({
    ...campaign,
    statusLabel: campaignStatuses[campaign.status] || campaign.status,
    prospectCount: _count.prospects,
  }));
}

export async function createCampaign(prisma, input) {
  const content = validateCampaignContent(input || {});
  const campaign = await prisma.campaign.create({ data: content });
  return {
    ...campaign,
    statusLabel: campaignStatuses[campaign.status],
    prospectCount: 0,
  };
}

export async function updateCampaign(prisma, id, input) {
  validateId(id);
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new CampaignRequestError('Informe os dados da campanha.');
  }
  const data = {};
  if (Object.hasOwn(input, 'name')) {
    data.name = validateCampaignContent({ name: input.name }).name;
  }
  if (Object.hasOwn(input, 'description')) {
    if (input.description !== null
      && (typeof input.description !== 'string' || input.description.trim().length > 500)) {
      throw new CampaignRequestError('A descrição deve ter no máximo 500 caracteres.');
    }
    data.description = typeof input.description === 'string' && input.description.trim()
      ? input.description.trim()
      : null;
  }
  if (Object.hasOwn(input, 'status')) {
    if (typeof input.status !== 'string' || !Object.hasOwn(campaignStatuses, input.status)) {
      throw new CampaignRequestError('Selecione uma etapa válida para a campanha.');
    }
    data.status = input.status;
  }
  if (!Object.keys(data).length) {
    throw new CampaignRequestError('Informe ao menos um campo válido para atualizar.');
  }
  const result = await prisma.campaign.updateMany({ where: { id }, data });
  if (!result.count) throw new CampaignRequestError('Campanha não encontrada.', 404);
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  return { ...campaign, statusLabel: campaignStatuses[campaign.status] };
}

export async function listCampaignProspects(prisma, id, { page = 1, query = '' } = {}) {
  validateId(id);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1_000_000) {
    throw new CampaignRequestError('O número da página deve ser um inteiro positivo.');
  }
  if (typeof query !== 'string' || query.length > 100) {
    throw new CampaignRequestError('A busca deve ter no máximo 100 caracteres.');
  }
  if (!(await prisma.campaign.findUnique({ where: { id }, select: { id: true } }))) {
    throw new CampaignRequestError('Campanha não encontrada.', 404);
  }

  const search = query.trim();
  const conditions = search
    ? [
        { companyName: { contains: search } },
        { tradeName: { contains: search } },
        { cnaeDescription: { contains: search } },
        { cnaePrimary: { contains: search } },
      ]
    : [];
  const digits = search.replace(/\D/g, '');
  if (digits) conditions.push({ cnpj: { contains: digits } });
  const where = {
    campaignId: id,
    ...(conditions.length ? { prospect: { is: { OR: conditions } } } : {}),
  };
  const pageSize = 25;
  const [total, memberships] = await Promise.all([
    prisma.campaignProspect.count({ where }),
    prisma.campaignProspect.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { addedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        prospectId: true,
        status: true,
        addedAt: true,
        prospect: {
          select: {
            id: true,
            cnpj: true,
            companyName: true,
            tradeName: true,
            cnaePrimary: true,
            cnaeDescription: true,
            city: true,
            state: true,
            companySize: true,
          },
        },
      },
    }),
  ]);
  return {
    items: memberships.map((membership) => ({
      ...membership,
      statusLabel: campaignLeadStatuses[membership.status] || membership.status,
    })),
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function addProspectsToCampaign(prisma, id, prospectIds) {
  validateId(id);
  if (!Array.isArray(prospectIds) || prospectIds.length < 1 || prospectIds.length > 100) {
    throw new CampaignRequestError('Selecione entre 1 e 100 empresas por operação.');
  }
  const ids = [...new Set(prospectIds.map(validateId))];
  if (!(await prisma.campaign.findUnique({ where: { id }, select: { id: true } }))) {
    throw new CampaignRequestError('Campanha não encontrada.', 404);
  }
  const activeProspects = await prisma.prospect.findMany({
    where: { id: { in: ids }, sourceActive: true },
    select: { id: true },
  });
  if (activeProspects.length !== ids.length) {
    throw new CampaignRequestError('Uma ou mais empresas não existem ou não estão ativas.');
  }
  const existing = await prisma.campaignProspect.findMany({
    where: { campaignId: id, prospectId: { in: ids } },
    select: { prospectId: true },
  });
  const existingIds = new Set(existing.map(({ prospectId }) => prospectId));
  const newIds = ids.filter((prospectId) => !existingIds.has(prospectId));
  if (newIds.length) {
    await prisma.$transaction(async (transaction) => {
      for (const prospectId of newIds) {
        await transaction.campaignProspect.create({
          data: { campaignId: id, prospectId },
        });
      }
    });
  }
  return { added: newIds.length, alreadyIncluded: ids.length - newIds.length };
}

export async function updateCampaignProspect(prisma, campaignId, prospectId, status) {
  validateId(campaignId);
  validateId(prospectId);
  if (typeof status !== 'string' || !Object.hasOwn(campaignLeadStatuses, status)) {
    throw new CampaignRequestError('Selecione uma etapa válida para a empresa.');
  }
  const result = await prisma.campaignProspect.updateMany({
    where: { campaignId, prospectId },
    data: { status },
  });
  if (!result.count) throw new CampaignRequestError('Empresa não encontrada nesta campanha.', 404);
  return {
    campaignId,
    prospectId,
    status,
    statusLabel: campaignLeadStatuses[status],
  };
}

export async function removeProspectFromCampaign(prisma, campaignId, prospectId) {
  validateId(campaignId);
  validateId(prospectId);
  const result = await prisma.campaignProspect.deleteMany({
    where: { campaignId, prospectId },
  });
  if (!result.count) throw new CampaignRequestError('Empresa não encontrada nesta campanha.', 404);
  return { removed: true };
}
