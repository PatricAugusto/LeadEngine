export const leadStatusLabels = Object.freeze({
  new: 'Novo lead',
  qualified: 'Qualificado',
  contacted: 'Contatado',
  meeting: 'Reunião',
  customer: 'Cliente',
  disqualified: 'Desqualificado',
});

export class LeadRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'LeadRequestError';
    this.statusCode = statusCode;
  }
}

export function parseLeadStatusFilter(value) {
  if (value === undefined || value === '') return undefined;
  if (typeof value !== 'string' || !Object.hasOwn(leadStatusLabels, value)) {
    throw new LeadRequestError('O filtro de status informado é inválido.');
  }
  return value;
}

export async function updateLeadStatus(prisma, id, status) {
  if (typeof status !== 'string' || !Object.hasOwn(leadStatusLabels, status)) {
    throw new LeadRequestError('Selecione um status válido para o lead.');
  }

  const result = await prisma.prospect.updateMany({
    where: { id, sourceActive: true },
    data: { status },
  });
  if (!result.count) {
    throw new LeadRequestError('Lead não encontrado ou inativo.', 404);
  }

  return { id, status, statusLabel: leadStatusLabels[status] };
}
