import Database from 'better-sqlite3';
import { parse } from 'csv-parse';
import { createWriteStream } from 'node:fs';
import { mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import unzipper from 'unzipper';
import { normalizeEstablishment } from './normalize.js';

const serverDirectory = fileURLToPath(new URL('../../', import.meta.url));
const sourceBaseUrl = new URL(
  process.env.RFB_CNPJ_BASE_URL || 'https://dadosabertos.rfb.gov.br/CNPJ/',
);
const dataDirectory = path.resolve(serverDirectory, process.env.RFB_DATA_DIR || './data');
const validSourceHost = 'dadosabertos.rfb.gov.br';
const archiveNames = [
  ...Array.from({ length: 10 }, (_, index) => `Empresas${index}.zip`),
  ...Array.from({ length: 10 }, (_, index) => `Estabelecimentos${index}.zip`),
  'Cnaes.zip',
  'Municipios.zip',
];

if (sourceBaseUrl.protocol !== 'https:' || sourceBaseUrl.hostname !== validSourceHost) {
  throw new Error(`A fonte de CNPJ deve usar HTTPS em ${validSourceHost}.`);
}

function versionFromIndex(html) {
  const versions = [...html.matchAll(/href=["'](20\d{2}-\d{2})\/?["']/gi)]
    .map((match) => match[1])
    .sort();
  const version = versions.at(-1);
  if (!version) {
    throw new Error('A listagem da Receita não contém uma versão de dados no formato AAAA-MM.');
  }
  return version;
}

async function request(url, timeoutMs, description) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;
    const causeCode = cause && typeof cause === 'object' && 'code' in cause
      ? cause.code
      : undefined;
    const host = new URL(url).hostname;
    const isTimeout = causeCode === 'UND_ERR_CONNECT_TIMEOUT'
      || causeCode === 'ETIMEDOUT'
      || (error instanceof Error && error.name === 'TimeoutError');
    const failure = isTimeout
      ? `a conexão expirou${causeCode ? ` (${causeCode})` : ''}`
      : `falha de rede${causeCode ? ` (${causeCode})` : ''}`;
    throw new Error(
      `${description}: ${failure} ao acessar ${host}. Verifique internet, DNS, firewall/proxy e acesso HTTPS de saída (porta 443).`,
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new Error(`${description}: a Receita respondeu HTTP ${response.status}.`);
  }
  return response;
}

async function fileExists(filePath) {
  try {
    const file = await stat(filePath);
    return file.isFile() && file.size > 0;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function downloadArchive(version, filename, versionDirectory) {
  const filePath = path.join(versionDirectory, filename);
  if (await fileExists(filePath)) return filePath;

  const partialPath = `${filePath}.part`;
  const url = new URL(`${version}/${filename}`, sourceBaseUrl);
  try {
    const response = await request(
      url,
      60 * 60 * 1000,
      `Erro ao baixar ${filename}`,
    );
    if (!response.body) {
      throw new Error(`A Receita não enviou conteúdo para ${filename}.`);
    }

    await pipeline(
      Readable.fromWeb(response.body),
      createWriteStream(partialPath, { flags: 'w' }),
    );
    await rename(partialPath, filePath);
    return filePath;
  } catch (error) {
    await rm(partialPath, { force: true });
    throw error;
  }
}

export async function prepareSource(onProgress) {
  await mkdir(dataDirectory, { recursive: true });
  const indexResponse = await request(sourceBaseUrl, 30_000, 'Erro ao consultar a Receita');
  const version = versionFromIndex(await indexResponse.text());
  const versionDirectory = path.join(dataDirectory, version);
  await mkdir(versionDirectory, { recursive: true });

  const archives = new Map();
  for (let index = 0; index < archiveNames.length; index += 1) {
    const filename = archiveNames[index];
    archives.set(filename, await downloadArchive(version, filename, versionDirectory));
    await onProgress({
      step: 'download',
      progress: Math.floor(((index + 1) / archiveNames.length) * 25),
      processedRows: index + 1,
    });
  }

  const companyIndex = await buildCompanyIndex(version, archives, onProgress);
  await pruneOldVersions(version);
  return {
    version,
    companyIndex,
    archives,
    onProgress,
  };
}

async function pruneOldVersions(currentVersion) {
  for (const entry of await readdir(dataDirectory, { withFileTypes: true })) {
    if (entry.isDirectory() && /^20\d{2}-\d{2}$/.test(entry.name) && entry.name !== currentVersion) {
      await rm(path.join(dataDirectory, entry.name), { recursive: true, force: true });
      continue;
    }

    const companyIndexVersion = entry.name.match(/^companies-(20\d{2}-\d{2})\.sqlite$/)?.[1];
    if (companyIndexVersion && companyIndexVersion !== currentVersion && entry.isFile()) {
      await rm(path.join(dataDirectory, entry.name), { force: true });
    }
  }
}

async function firstCsvEntry(archivePath) {
  const archive = await unzipper.Open.file(archivePath);
  const csvEntry = archive.files.find(
    (entry) => entry.type === 'File' && entry.path.toLocaleLowerCase('en-US').endsWith('.csv'),
  );
  if (!csvEntry) {
    throw new Error(`O arquivo ${path.basename(archivePath)} não contém um CSV.`);
  }
  return csvEntry;
}

export async function* readReceitaCsv(archivePath) {
  const entry = await firstCsvEntry(archivePath);
  const parser = parse({
    bom: true,
    delimiter: ';',
    encoding: 'latin1',
    relax_column_count: true,
    skip_empty_lines: true,
  });
  entry.stream().pipe(parser);

  try {
    for await (const row of parser) {
      yield row;
    }
  } catch (error) {
    parser.destroy();
    throw new Error(`Erro ao interpretar ${path.basename(archivePath)}: ${error.message}`);
  }
}

async function buildCompanyIndex(version, archives, onProgress) {
  const readyPath = path.join(dataDirectory, `companies-${version}.sqlite`);
  if (await fileExists(readyPath)) return readyPath;

  const buildingPath = `${readyPath}.building`;
  await rm(buildingPath, { force: true });
  const database = new Database(buildingPath);
  database.pragma('journal_mode = WAL');
  database.pragma('synchronous = NORMAL');
  database.exec(`
    CREATE TABLE Company (
      cnpjRoot TEXT NOT NULL PRIMARY KEY,
      companyName TEXT NOT NULL,
      companySize TEXT
    );
  `);
  const insertCompany = database.prepare(
    'INSERT OR REPLACE INTO Company (cnpjRoot, companyName, companySize) VALUES (?, ?, ?)',
  );
  const companySizeLabels = {
    '01': 'Microempresa',
    '03': 'Empresa de pequeno porte',
    '05': 'Demais',
  };

  try {
    for (let index = 0; index < 10; index += 1) {
      let batch = [];
      for await (const row of readReceitaCsv(archives.get(`Empresas${index}.zip`))) {
        const cnpjRoot = row[0]?.trim();
        const companyName = row[1]?.trim();
        if (!cnpjRoot || !companyName) continue;

        batch.push([
          cnpjRoot.padStart(8, '0'),
          companyName,
          companySizeLabels[row[5]?.trim()] || null,
        ]);
        if (batch.length === 5_000) {
          database.transaction((rows) => rows.forEach((values) => insertCompany.run(...values)))(batch);
          batch = [];
        }
      }
      if (batch.length) {
        database.transaction((rows) => rows.forEach((values) => insertCompany.run(...values)))(batch);
      }
      await onProgress({
        step: 'index',
        progress: 25 + Math.floor(((index + 1) / 10) * 25),
        processedRows: index + 1,
      });
    }

    database.pragma('wal_checkpoint(TRUNCATE)');
    database.close();
    await rename(buildingPath, readyPath);
    await rm(`${buildingPath}-wal`, { force: true });
    await rm(`${buildingPath}-shm`, { force: true });
    return readyPath;
  } catch (error) {
    database.close();
    await rm(buildingPath, { force: true });
    await rm(`${buildingPath}-wal`, { force: true });
    await rm(`${buildingPath}-shm`, { force: true });
    throw error;
  }
}

async function readReferenceMap(archivePath) {
  const result = new Map();
  for await (const row of readReceitaCsv(archivePath)) {
    if (row[0] && row[1]) result.set(row[0].trim(), row[1].trim());
  }
  return result;
}

export async function searchEstablishments(source, states, saveBatch) {
  const cnaes = await readReferenceMap(source.archives.get('Cnaes.zip'));
  const municipalities = await readReferenceMap(source.archives.get('Municipios.zip'));
  const requestedStates = new Set(states);
  const companyDb = new Database(source.companyIndex, { readonly: true });
  const findCompany = companyDb.prepare(
    'SELECT companyName, companySize FROM Company WHERE cnpjRoot = ?',
  );
  let batch = [];
  let processedRows = 0;
  let foundRows = 0;

  try {
    for (let index = 0; index < 10; index += 1) {
      const archive = source.archives.get(`Estabelecimentos${index}.zip`);
      for await (const row of readReceitaCsv(archive)) {
        processedRows += 1;
        if (row[5]?.trim() !== '02' || !requestedStates.has(row[19]?.trim())) continue;

        const cnpjRoot = row[0]?.trim()?.padStart(8, '0');
        const company = cnpjRoot ? findCompany.get(cnpjRoot) : null;
        const prospect = normalizeEstablishment(
          row,
          requestedStates,
          company,
          cnaes,
          municipalities,
          source.version,
        );
        if (!prospect) continue;
        batch.push(prospect);
        foundRows += 1;

        if (batch.length >= 500) {
          await saveBatch(batch, { processedRows, foundRows });
          batch = [];
        }
        if (processedRows % 50_000 === 0) {
          await source.onProgress({
            step: 'filter',
            progress: 50 + Math.floor((index / 10) * 40),
            processedRows,
            foundRows,
          });
        }
      }
      await source.onProgress({
        step: 'filter',
        progress: 50 + Math.floor(((index + 1) / 10) * 40),
        processedRows,
        foundRows,
      });
    }

    if (batch.length) await saveBatch(batch, { processedRows, foundRows });
    return { processedRows, foundRows };
  } finally {
    companyDb.close();
  }
}
