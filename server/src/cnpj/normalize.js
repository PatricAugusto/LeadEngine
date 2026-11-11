export function parseReceitaDate(value) {
  if (!/^\d{8}$/.test(value || '')) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function normalizeEstablishment(row, states, company, cnaes, municipalities, sourceVersion) {
  const state = row[19]?.trim();
  if (row[5]?.trim() !== '02' || !states.has(state) || !company) return null;

  const cnpjRoot = row[0]?.trim()?.padStart(8, '0');
  const order = row[1]?.trim()?.padStart(4, '0');
  const checkDigits = row[2]?.trim()?.padStart(2, '0');
  const cnpj = `${cnpjRoot || ''}${order || ''}${checkDigits || ''}`;
  if (!/^\d{14}$/.test(cnpj)) return null;

  const cnaePrimary = row[11]?.trim()?.padStart(7, '0');
  const municipality = row[20]?.trim()?.padStart(4, '0');
  return {
    cnpj,
    companyName: company.companyName,
    tradeName: row[4]?.trim() || null,
    cnaePrimary,
    cnaeDescription: cnaes.get(cnaePrimary) || null,
    city: municipalities.get(municipality) || municipality,
    state,
    companySize: company.companySize,
    openedAt: parseReceitaDate(row[10]?.trim()),
    sourceVersion,
  };
}
