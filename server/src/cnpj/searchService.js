import { randomUUID } from 'node:crypto';
import cron from 'node-cron';
import { Prisma } from '@prisma/client';
import { prepareSource, searchEstablishments } from './receitaSource.js';

const stateCodes = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]);
const scheduledCron = {
  weekly: '0 3 * * 1',
  monthly: '0 3 1 * *',
};
const batchInsertSize = 500;

let activeRunId = null;
let startingRun = false;
let scheduledTask = null;

export class SearchRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'SearchRequestError';
    this.statusCode = statusCode;
  }
}

export function validateStates(states) {
  if (!Array.isArray(states) || states.length === 0) {
    throw new SearchRequestError('Selecione pelo menos um estado para iniciar a busca.');
  }
  const normalized = [...new Set(states.map((state) => String(state).toUpperCase()))];
  const invalid = normalized.filter((state) => !stateCodes.has(state));
  if (invalid.length) {
    throw new SearchRequestError(`UF inválida: ${invalid.join(', ')}.`);
  }
  return normalized;
}

export function validateStateFilter(state) {
  if (state === undefined || state === '') return undefined;
  if (typeof state !== 'string' || !stateCodes.has(state.toUpperCase())) {
    throw new SearchRequestError('O filtro de UF informado é inválido.');
  }
  return state.toUpperCase();
}

async function updateRun(prisma, runId, values) {
  await prisma.searchRun.update({ where: { id: runId }, data: values });
}

async function persistProspects(prisma, prospects, sourceVersion) {
  for (let offset = 0; offset < prospects.length; offset += batchInsertSize) {
    const rows = prospects.slice(offset, offset + batchInsertSize);
    const now = new Date();
    const values = rows.map((row) => Prisma.sql`(
      ${randomUUID()},
      ${row.cnpj},
      ${row.companyName},
      ${row.tradeName},
      ${row.cnaePrimary},
      ${row.cnaeDescription},
      ${row.city},
      ${row.state},
      ${row.companySize},
      ${row.openedAt},
      true,
      0,
      'new',
      ${sourceVersion},
      ${now},
      ${now}
    )`);
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "Prospect" (
        "id", "cnpj", "companyName", "tradeName", "cnaePrimary",
        "cnaeDescription", "city", "state", "companySize", "openedAt",
        "sourceActive", "score", "status", "sourceVersion", "createdAt", "updatedAt"
      )
      VALUES ${Prisma.join(values)}
      ON CONFLICT("cnpj") DO UPDATE SET
        "companyName" = excluded."companyName",
        "tradeName" = excluded."tradeName",
        "cnaePrimary" = excluded."cnaePrimary",
        "cnaeDescription" = excluded."cnaeDescription",
        "city" = excluded."city",
        "state" = excluded."state",
        "companySize" = excluded."companySize",
        "openedAt" = excluded."openedAt",
        "sourceActive" = true,
        "sourceVersion" = excluded."sourceVersion",
        "updatedAt" = excluded."updatedAt"
    `);
  }
}

async function executeRun(prisma, runId, states) {
  activeRunId = runId;
  let latestProgress = 0;
  let lastReportedSaveRows = 0;
  try {
    await updateRun(prisma, runId, {
      status: 'running',
      currentStep: 'download',
      startedAt: new Date(),
    });
    const source = await prepareSource(async (progress) => {
      latestProgress = progress.progress;
      await updateRun(prisma, runId, {
        currentStep: progress.step,
        progress: progress.progress,
        processedRows: progress.processedRows,
        foundRows: progress.foundRows ?? undefined,
      });
    });

    const result = await searchEstablishments(
      source,
      states,
      async (batch, counts) => {
        await persistProspects(prisma, batch, source.version);
        if (counts.processedRows - lastReportedSaveRows >= 10_000 || lastReportedSaveRows === 0) {
          await updateRun(prisma, runId, {
            currentStep: 'save',
            progress: Math.max(latestProgress, 90),
            processedRows: counts.processedRows,
            foundRows: counts.foundRows,
          });
          lastReportedSaveRows = counts.processedRows;
        }
      },
    );

    await prisma.prospect.updateMany({
      where: {
        state: { in: states },
        sourceVersion: { not: source.version },
      },
      data: { sourceActive: false, updatedAt: new Date() },
    });

    await updateRun(prisma, runId, {
      status: 'completed',
      currentStep: 'completed',
      progress: 100,
      processedRows: result.processedRows,
      foundRows: result.foundRows,
      sourceVersion: source.version,
      finishedAt: new Date(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Busca ${runId} falhou: ${message}`);
    await updateRun(prisma, runId, {
      status: 'failed',
      currentStep: 'failed',
      error: message,
      finishedAt: new Date(),
    });
  } finally {
    activeRunId = null;
  }
}

export async function startSearch(prisma, states) {
  const normalizedStates = validateStates(states);
  if (activeRunId || startingRun) {
    throw new SearchRequestError(
      'Já existe uma busca em andamento. Aguarde a conclusão antes de iniciar outra.',
      409,
    );
  }

  startingRun = true;
  try {
    const activeRun = await prisma.searchRun.findFirst({
      where: { status: 'running' },
      select: { id: true },
    });
    if (activeRun) {
      throw new SearchRequestError(
        'Já existe uma busca em andamento. Aguarde a conclusão antes de iniciar outra.',
        409,
      );
    }

    const run = await prisma.searchRun.create({
      data: {
        statesJson: JSON.stringify(normalizedStates),
        status: 'queued',
      },
    });
    activeRunId = run.id;
    void executeRun(prisma, run.id, normalizedStates).catch((error) => {
      console.error(
        `Erro ao atualizar a busca ${run.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
    return run;
  } finally {
    startingRun = false;
  }
}

export async function getSchedule(prisma) {
  const schedule = await prisma.searchSchedule.findUnique({ where: { id: 'default' } });
  return schedule || {
    id: 'default',
    enabled: false,
    cronExpression: scheduledCron.monthly,
    statesJson: '[]',
    updatedAt: null,
  };
}

export async function configureSchedule(prisma, { enabled, frequency, states }) {
  if (typeof enabled !== 'boolean') {
    throw new SearchRequestError('Informe se o agendamento está ativado ou desativado.');
  }
  if (!Object.hasOwn(scheduledCron, frequency)) {
    throw new SearchRequestError('A frequência deve ser semanal ou mensal.');
  }
  const normalizedStates = enabled ? validateStates(states) : [];
  const schedule = await prisma.searchSchedule.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      enabled,
      cronExpression: scheduledCron[frequency],
      statesJson: JSON.stringify(normalizedStates),
    },
    update: {
      enabled,
      cronExpression: scheduledCron[frequency],
      statesJson: JSON.stringify(normalizedStates),
    },
  });
  activateSchedule(prisma, schedule);
  return schedule;
}

function activateSchedule(prisma, schedule) {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
  }
  if (!schedule.enabled) return;

  scheduledTask = cron.schedule(
    schedule.cronExpression,
    async () => {
      try {
        const states = JSON.parse(schedule.statesJson);
        await startSearch(prisma, states);
      } catch (error) {
        console.error(
          `Busca agendada não iniciada: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
    { timezone: 'America/Sao_Paulo' },
  );
}

export async function loadSchedule(prisma) {
  const schedule = await getSchedule(prisma);
  activateSchedule(prisma, schedule);
  return schedule;
}

export async function recoverInterruptedRuns(prisma) {
  const result = await prisma.searchRun.updateMany({
    where: { status: { in: ['queued', 'running'] } },
    data: {
      status: 'failed',
      currentStep: 'failed',
      error: 'A busca foi interrompida porque o servidor reiniciou.',
      finishedAt: new Date(),
    },
  });
  return result.count;
}

export async function getRun(prisma, id) {
  return prisma.searchRun.findUnique({ where: { id } });
}

export async function listRuns(prisma) {
  const runs = await prisma.searchRun.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return runs.map((run) => ({
    ...run,
    states: JSON.parse(run.statesJson),
  }));
}
