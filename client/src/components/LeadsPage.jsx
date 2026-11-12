import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Filter,
  RefreshCw,
  Search,
  Target,
  Users,
} from 'lucide-react';
import { getProspects, updateProspectStatus } from '../api.js';
import {
  DataCell,
  DataTable,
  EmptyState,
  LeadCompany,
  LeadInfo,
  LeadInitial,
  LeadName,
  LeadSubtext,
  Panel,
  PanelHeader,
  PanelTitle,
  SectionSubtitle,
  TableFooter,
  TableHead,
  TableWrap,
  Tag,
} from './DashboardStyles.js';
import {
  LeadEmptyState,
  LeadFeedback,
  LeadFilterButton,
  LeadFilters,
  LeadResultCount,
  LeadRefreshButton,
  LeadSearchWrap,
  LeadStatusSelect,
  LeadSummaryCard,
  LeadSummaryGrid,
  LeadsContent,
  LeadTools,
  LeadToolsTop,
} from './LeadsStyles.js';

const statuses = [
  { value: '', label: 'Todos' },
  { value: 'new', label: 'Novo lead' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'customer', label: 'Cliente' },
  { value: 'disqualified', label: 'Desqualificado' },
];
const avatarColors = ['#7868db', '#4f9d83', '#d38c49', '#5687ca', '#b16a8a', '#668d6f'];
const numberFormat = new Intl.NumberFormat('pt-BR');
const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('pt-BR');
}

function formatCnpj(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <LeadSummaryCard>
      <div className="summary-top">
        <span className="summary-label">{label}</span>
        <span className="summary-icon"><Icon size={16} /></span>
      </div>
      <span className="summary-value">{numberFormat.format(value)}</span>
    </LeadSummaryCard>
  );
}

export default function LeadsPage({ statusCounts = {}, onStatusChanged, onNavigateToOverview }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const activeTotal = useMemo(
    () => Object.values(statusCounts).reduce((total, count) => total + count, 0),
    [statusCounts],
  );
  const inProgress = (statusCounts.contacted || 0) + (statusCounts.meeting || 0);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getProspects({ page, query, status })
      .then((response) => {
        if (active) setResult(response);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, query, reloadKey, status]);

  async function handleStatusChange(prospect, nextStatus) {
    if (prospect.status === nextStatus) return;
    setError('');
    setUpdatingId(prospect.id);
    try {
      await updateProspectStatus(prospect.id, nextStatus);
      setReloadKey((current) => current + 1);
      onStatusChanged();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId('');
    }
  }

  const prospects = result?.items || [];
  const firstItem = result?.total ? ((page - 1) * result.pageSize) + 1 : 0;
  const lastItem = Math.min(page * (result?.pageSize || 0), result?.total || 0);
  const noMatches = !loading && !error && prospects.length === 0;
  const hasFilters = Boolean(query || status);

  return (
    <LeadsContent>
      <LeadSummaryGrid>
        <SummaryCard icon={Users} label="Leads ativos" value={activeTotal} />
        <SummaryCard icon={Target} label="Novos leads" value={statusCounts.new || 0} />
        <SummaryCard icon={CheckCircle2} label="Qualificados" value={statusCounts.qualified || 0} />
        <SummaryCard icon={Clock3} label="Em andamento" value={inProgress} />
      </LeadSummaryGrid>

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Base de leads</PanelTitle>
            <SectionSubtitle>Pesquise empresas e acompanhe cada etapa da prospecção.</SectionSubtitle>
          </div>
          <LeadResultCount>
            {result
              ? `${numberFormat.format(result.total)} ${result.total === 1 ? 'resultado' : 'resultados'}`
              : 'Carregando leads...'}
          </LeadResultCount>
        </PanelHeader>

        <LeadTools>
          <LeadToolsTop>
            <LeadSearchWrap>
              <Search size={16} aria-hidden="true" />
              <input
                aria-label="Buscar leads por empresa, CNPJ, CNAE ou cidade"
                placeholder="Buscar por empresa, CNPJ, CNAE ou cidade..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </LeadSearchWrap>
            <LeadRefreshButton
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spinning' : ''} />
              Atualizar lista
            </LeadRefreshButton>
          </LeadToolsTop>

          <LeadFilters role="group" aria-label="Filtrar leads por etapa">
            {statuses.map((item) => {
              const count = item.value ? statusCounts[item.value] || 0 : activeTotal;
              return (
                <LeadFilterButton
                  key={item.value || 'all'}
                  type="button"
                  $active={status === item.value}
                  aria-pressed={status === item.value}
                  onClick={() => {
                    setStatus(item.value);
                    setPage(1);
                  }}
                >
                  {item.label}
                  <span className="count">{numberFormat.format(count)}</span>
                </LeadFilterButton>
              );
            })}
          </LeadFilters>
        </LeadTools>

        {error && <LeadFeedback role="alert">{error}</LeadFeedback>}

        {noMatches ? (
          <LeadEmptyState>
            <Filter size={22} />
            <strong>{hasFilters ? 'Nenhum lead encontrado' : 'Sua base de leads está vazia'}</strong>
            <span>
              {hasFilters
                ? 'Ajuste os filtros ou faça outra busca para encontrar leads.'
                : 'Inicie uma busca por estado na visão geral para trazer empresas para esta lista.'}
            </span>
            {hasFilters
              ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setQuery('');
                      setStatus('');
                      setPage(1);
                    }}
                  >
                    Limpar filtros
                  </button>
                )
              : <button type="button" onClick={onNavigateToOverview}>Ir para visão geral</button>}
          </LeadEmptyState>
        ) : (
          <>
            <TableWrap>
              <DataTable>
                <thead>
                  <tr>
                    <TableHead>Lead</TableHead>
                    <TableHead>Atividade (CNAE)</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Porte</TableHead>
                    <TableHead>Abertura</TableHead>
                    <TableHead>Etapa</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect) => (
                    <tr key={prospect.id}>
                      <DataCell>
                        <LeadCompany>
                          <LeadInitial $color={avatarColors[prospect.id.charCodeAt(0) % avatarColors.length]}>
                            {initials(prospect.companyName)}
                          </LeadInitial>
                          <LeadInfo>
                            <LeadName>{prospect.companyName}</LeadName>
                            <LeadSubtext>CNPJ {formatCnpj(prospect.cnpj)}</LeadSubtext>
                          </LeadInfo>
                        </LeadCompany>
                      </DataCell>
                      <DataCell>
                        <Tag title={`CNAE ${prospect.cnaePrimary}`}>
                          {prospect.cnaeDescription || prospect.cnaePrimary}
                        </Tag>
                      </DataCell>
                      <DataCell>
                        <span className="location">{prospect.city}, {prospect.state}</span>
                      </DataCell>
                      <DataCell>{prospect.companySize || 'Não informado'}</DataCell>
                      <DataCell>
                        {prospect.openedAt ? dateFormat.format(new Date(prospect.openedAt)) : '—'}
                      </DataCell>
                      <DataCell>
                        <LeadStatusSelect
                          aria-label={`Atualizar etapa de ${prospect.companyName}`}
                          value={prospect.status}
                          disabled={updatingId === prospect.id}
                          onChange={(event) => handleStatusChange(prospect, event.target.value)}
                        >
                          {statuses.filter((item) => item.value).map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </LeadStatusSelect>
                      </DataCell>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              {loading && <EmptyState role="status">Atualizando lista de leads...</EmptyState>}
            </TableWrap>
            <TableFooter>
              <span>
                {result
                  ? `Exibindo ${firstItem}–${lastItem} de ${numberFormat.format(result.total)} leads`
                  : 'Carregando leads...'}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={loading || page <= 1}
                >
                  Anterior
                </button>
                <span>Página {page} de {result?.pageCount || 1}</span>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={loading || page >= (result?.pageCount || 1)}
                >
                  Próxima
                </button>
              </div>
            </TableFooter>
          </>
        )}
      </Panel>
    </LeadsContent>
  );
}
