import { useEffect, useState } from 'react';
import { Building2, MapPin, RefreshCw, Search } from 'lucide-react';
import { getProspects } from '../api.js';
import { states } from '../data/states.js';
import {
  Badge,
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
  ModuleButton,
  ModuleControls,
  ModuleEmpty,
  ModuleFeedback,
  ModulePage,
  ModuleSearch,
  ModuleSelect,
  ModuleToolbar,
} from './ModuleStyles.js';

const numberFormat = new Intl.NumberFormat('pt-BR');
const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const statusLabels = {
  new: 'Novo lead',
  qualified: 'Qualificado',
  contacted: 'Contatado',
  meeting: 'Reunião',
  customer: 'Cliente',
  disqualified: 'Desqualificado',
};
const avatarColors = ['#7868db', '#4f9d83', '#d38c49', '#5687ca', '#b16a8a', '#668d6f'];

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('pt-BR');
}

function formatCnpj(value) {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getProspects({ page, pageSize: 25, query, state })
      .then((response) => { if (active) setResult(response); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, query, reloadKey, state]);

  const companies = result?.items || [];
  const firstItem = result?.total ? ((page - 1) * result.pageSize) + 1 : 0;
  const lastItem = Math.min(page * (result?.pageSize || 0), result?.total || 0);

  return (
    <ModulePage>
      <ModuleToolbar>
        <ModuleControls>
          <ModuleSearch>
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Buscar empresas por nome, CNPJ, CNAE ou município"
              placeholder="Buscar por empresa, CNPJ, CNAE ou município..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </ModuleSearch>
          <ModuleSelect
            aria-label="Filtrar empresas por estado"
            value={state}
            onChange={(event) => {
              setState(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos os estados</option>
            {states.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
          </ModuleSelect>
        </ModuleControls>
        <ModuleButton type="button" onClick={() => setReloadKey((value) => value + 1)} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          Atualizar
        </ModuleButton>
      </ModuleToolbar>

      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Base de empresas</PanelTitle>
            <SectionSubtitle>
              {result ? `${numberFormat.format(result.total)} empresas ativas` : 'Empresas ativas na base local'}
            </SectionSubtitle>
          </div>
          <Building2 size={18} color="#a78bfa" aria-hidden="true" />
        </PanelHeader>
        {error && <ModuleFeedback role="alert">{error}</ModuleFeedback>}
        {!loading && !error && !companies.length ? (
          <ModuleEmpty>
            <Building2 size={22} />
            <strong>{query || state ? 'Nenhuma empresa corresponde aos filtros' : 'Ainda não há empresas na base'}</strong>
            <span>{query || state ? 'Remova filtros ou tente outros termos.' : 'Inicie uma busca por estado na Visão geral para carregar dados da Receita Federal.'}</span>
          </ModuleEmpty>
        ) : (
          <TableWrap>
            <DataTable>
              <thead>
                <tr>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Atividade (CNAE)</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Porte</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Etapa</TableHead>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <DataCell>
                      <LeadCompany>
                        <LeadInitial $color={avatarColors[company.id.charCodeAt(0) % avatarColors.length]}>
                          {initials(company.companyName)}
                        </LeadInitial>
                        <LeadInfo>
                          <LeadName>{company.companyName}</LeadName>
                          <LeadSubtext>CNPJ {formatCnpj(company.cnpj)}</LeadSubtext>
                        </LeadInfo>
                      </LeadCompany>
                    </DataCell>
                    <DataCell><Tag title={`CNAE ${company.cnaePrimary}`}>{company.cnaeDescription || company.cnaePrimary}</Tag></DataCell>
                    <DataCell><span className="location"><MapPin size={14} />{company.city}, {company.state}</span></DataCell>
                    <DataCell>{company.companySize || 'Não informado'}</DataCell>
                    <DataCell>{company.openedAt ? dateFormat.format(new Date(company.openedAt)) : '—'}</DataCell>
                    <DataCell><Badge $status={company.status}>{statusLabels[company.status] || company.status}</Badge></DataCell>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {loading && <EmptyState role="status">Atualizando empresas...</EmptyState>}
          </TableWrap>
        )}
        {result && !!companies.length && (
          <TableFooter>
            <span>Exibindo {firstItem}–{lastItem} de {numberFormat.format(result.total)} empresas</span>
            <div>
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={loading || page <= 1}>Anterior</button>
              <span>Página {page} de {result.pageCount}</span>
              <button type="button" onClick={() => setPage((value) => value + 1)} disabled={loading || page >= result.pageCount}>Próxima</button>
            </div>
          </TableFooter>
        )}
      </Panel>
    </ModulePage>
  );
}
