import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  configureSchedule,
  getRun,
  getSchedule,
  listRuns,
  loadSchedule,
  recoverInterruptedRuns,
  SearchRequestError,
  startSearch,
  validateStates,
} from './cnpj/searchService.js';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3001);

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function statusLabel(status) {
  return {
    new: 'Novo lead',
    qualified: 'Qualificado',
    contacted: 'Contatado',
    meeting: 'Reunião',
    customer: 'Cliente',
    disqualified: 'Desqualificado',
  }[status] || status;
}

function calendarDays(days) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - days + index + 1);
    return date;
  });
}

app.get('/api/health', asyncRoute(async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await prisma.prospect.count();
    response.json({ status: 'ok', database: 'ready' });
  } catch (error) {
    console.error(`Verificação do banco falhou: ${error.message}`);
    response.status(503).json({
      status: 'unavailable',
      database: 'not_ready',
      error: 'Configure o SQLite e aplique o SQL manual descrito no README.',
    });
  }
}));

app.get('/api/dashboard', asyncRoute(async (_request, response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const [
    activeProspects,
    newToday,
    qualified,
    customers,
    statusGroups,
    recentDates,
    latestRun,
  ] = await Promise.all([
    prisma.prospect.count({ where: { sourceActive: true } }),
    prisma.prospect.count({ where: { sourceActive: true, createdAt: { gte: today } } }),
    prisma.prospect.count({ where: { sourceActive: true, status: 'qualified' } }),
    prisma.prospect.count({ where: { sourceActive: true, status: 'customer' } }),
    prisma.prospect.groupBy({
      by: ['status'],
      where: { sourceActive: true },
      _count: { _all: true },
    }),
    prisma.prospect.findMany({
      where: { sourceActive: true, createdAt: { gte: weekStart } },
      select: { createdAt: true },
    }),
    prisma.searchRun.findFirst({
      where: { status: 'completed' },
      orderBy: { finishedAt: 'desc' },
      select: { finishedAt: true, sourceVersion: true },
    }),
  ]);

  const dailyCounts = new Map();
  for (const { createdAt } of recentDates) {
    const key = new Date(createdAt).toLocaleDateString('sv-SE');
    dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1);
  }
  const activity = calendarDays(7).map((date) => {
    const key = date.toLocaleDateString('sv-SE');
    return {
      label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
        .format(date)
        .replace('.', ''),
      total: dailyCounts.get(key) || 0,
    };
  });

  const countsByStatus = new Map(
    statusGroups.map((group) => [group.status, group._count._all]),
  );
  const total = Math.max(activeProspects, 1);
  const stages = [
    { label: 'Leads identificados', count: activeProspects, color: '#8878ed' },
    { label: 'Em análise', count: countsByStatus.get('new') || 0, color: '#70a0e8' },
    { label: 'Qualificados', count: qualified, color: '#5dbe98' },
    { label: 'Contatados', count: countsByStatus.get('contacted') || 0, color: '#f0b76a' },
    { label: 'Clientes', count: customers, color: '#e88779' },
  ].map((stage) => ({
    ...stage,
    percent: Math.round((stage.count / total) * 100),
  }));

  response.set('Cache-Control', 'no-store');
  response.json({
    dataMode: 'live',
    source: 'Dados Abertos do CNPJ — Receita Federal',
    latestRun,
    metrics: {
      activeProspects,
      newToday,
      qualified,
      customers,
      conversion: activeProspects ? Number(((customers / activeProspects) * 100).toFixed(1)) : 0,
    },
    activity,
    funnel: stages,
  });
}));

app.get('/api/prospects', asyncRoute(async (request, response) => {
  const rawPage = request.query.page || '1';
  const page = Number(rawPage);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1_000_000) {
    throw new SearchRequestError('O número da página deve ser um inteiro positivo.');
  }

  const query = String(request.query.q || '').trim();
  if (query.length > 100) {
    throw new SearchRequestError('A busca deve ter no máximo 100 caracteres.');
  }
  const searchConditions = query
    ? [
        { companyName: { contains: query } },
        { tradeName: { contains: query } },
        { cnaeDescription: { contains: query } },
        { cnaePrimary: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query.toUpperCase() } },
      ]
    : [];
  const cnpjDigits = query.replace(/\D/g, '');
  if (cnpjDigits) searchConditions.push({ cnpj: { contains: cnpjDigits } });
  const where = {
    sourceActive: true,
    ...(searchConditions.length ? { OR: searchConditions } : {}),
  };
  const pageSize = 10;
  const [total, prospects] = await Promise.all([
    prisma.prospect.count({ where }),
    prisma.prospect.findMany({
      where,
      orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
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
        openedAt: true,
        score: true,
        status: true,
      },
    }),
  ]);
  response.set('Cache-Control', 'no-store');
  response.json({
    items: prospects.map((prospect) => ({
      ...prospect,
      statusLabel: statusLabel(prospect.status),
    })),
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  });
}));

app.post('/api/search', asyncRoute(async (request, response) => {
  const states = validateStates(request.body?.states);
  const run = await startSearch(prisma, states);
  response.status(202).json({
    ...run,
    states: JSON.parse(run.statesJson),
  });
}));

app.get('/api/search-runs', asyncRoute(async (_request, response) => {
  response.json(await listRuns(prisma));
}));

app.get('/api/search-runs/:id', asyncRoute(async (request, response) => {
  const run = await getRun(prisma, request.params.id);
  if (!run) {
    response.status(404).json({ error: 'Busca não encontrada.' });
    return;
  }
  response.json({ ...run, states: JSON.parse(run.statesJson) });
}));

app.get('/api/search-schedule', asyncRoute(async (_request, response) => {
  const schedule = await getSchedule(prisma);
  response.json({
    ...schedule,
    states: JSON.parse(schedule.statesJson),
    frequency: schedule.cronExpression === '0 3 * * 1' ? 'weekly' : 'monthly',
  });
}));

app.put('/api/search-schedule', asyncRoute(async (request, response) => {
  const schedule = await configureSchedule(prisma, request.body || {});
  response.json({
    ...schedule,
    states: JSON.parse(schedule.statesJson),
    frequency: schedule.cronExpression === '0 3 * * 1' ? 'weekly' : 'monthly',
  });
}));

app.use((_request, response) => {
  response.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SearchRequestError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error(`Erro na API: ${error instanceof Error ? error.message : String(error)}`);
  if (error?.code === 'P2021' || error?.code === 'P2022') {
    response.status(503).json({
      error: 'Banco SQLite não preparado. Revise e aplique server/prisma/manual-schema.sql conforme o README.',
    });
    return;
  }
  response.status(500).json({ error: 'Não foi possível concluir a solicitação.' });
});

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`LeadEngine API disponível em http://127.0.0.1:${port}`);
  recoverInterruptedRuns(prisma)
    .then((count) => {
      if (count) console.warn(`${count} busca(s) interrompida(s) foram marcadas como falha.`);
      return loadSchedule(prisma);
    })
    .catch((error) => {
      console.error(`Não foi possível carregar o agendamento: ${error.message}`);
    });
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
