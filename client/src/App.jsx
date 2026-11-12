import { useCallback, useEffect, useState } from 'react';
import {
  Bell,
  Building2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Database,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Megaphone,
  Search,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getDashboard, getProspects, getSearchRuns } from './api.js';
import LeadSearch from './components/LeadSearch.jsx';
import LeadsPage from './components/LeadsPage.jsx';
import CompaniesPage from './components/CompaniesPage.jsx';
import CampaignsPage from './components/CampaignsPage.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import HelpPage from './components/HelpPage.jsx';
import { NotificationAnchor, NotificationPanel } from './components/ModuleStyles.js';
import {
  ActivityBars,
  ActivityCard,
  ActivityHeading,
  ActivityLegend,
  ActivityMeta,
  ActivityTitle,
  AppShell,
  Avatar,
  Badge,
  Brand,
  BrandMark,
  ChartBar,
  ChartBars,
  ChartColumn,
  ChartGrid,
  ChartLabel,
  ChartSection,
  Content,
  DataCell,
  DataTable,
  DemoNotice,
  EmptyState,
  ErrorBox,
  Header,
  HeaderActions,
  HeaderEyebrow,
  HeaderTitle,
  IconButton,
  Layout,
  LeadCompany,
  LeadInitial,
  LeadInfo,
  LeadName,
  LeadSubtext,
  LegendDot,
  LoadingState,
  Main,
  MetricCard,
  MetricDetail,
  MetricIcon,
  MetricLabel,
  MetricGrid,
  MetricTopRow,
  MetricValue,
  NavGroup,
  NavItem,
  NavList,
  NavSectionLabel,
  Panel,
  PanelHeader,
  PanelTitle,
  PipelineRow,
  PipelineStage,
  PipelineTrack,
  PipelineValue,
  RefreshButton,
  SearchWrap,
  Section,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  Sidebar,
  SidebarBottom,
  SidebarLink,
  TableFooter,
  TableHead,
  TableWrap,
  Tag,
  Topbar,
  UserInfo,
  UserName,
  UserRole,
} from './components/DashboardStyles.js';

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard, page: 'overview' },
  { label: 'Leads', icon: Users, page: 'leads' },
  { label: 'Empresas', icon: Building2, page: 'companies' },
  { label: 'Campanhas', icon: Megaphone, page: 'campaigns' },
];

const secondaryNavigation = [
  { label: 'Relatórios', icon: ClipboardList, page: 'reports' },
  { label: 'Configurações', icon: Settings2, page: 'settings' },
];

const pageDetails = {
  overview: { title: 'Visão geral', eyebrow: '' },
  leads: { title: 'Leads', eyebrow: 'GESTÃO COMERCIAL' },
  companies: { title: 'Empresas', eyebrow: 'BASE EMPRESARIAL' },
  campaigns: { title: 'Campanhas', eyebrow: 'PLANEJAMENTO COMERCIAL' },
  reports: { title: 'Relatórios', eyebrow: 'INDICADORES DA OPERAÇÃO' },
  settings: { title: 'Configurações', eyebrow: 'PREFERÊNCIAS DO SISTEMA' },
  help: { title: 'Central de ajuda', eyebrow: 'GUIA DE UTILIZAÇÃO' },
};
const pageSubtitles = {
  overview: 'Encontre as melhores oportunidades para o seu time.',
  leads: 'Organize empresas, acompanhe etapas e mantenha sua prospecção em movimento.',
  companies: 'Pesquise e consulte os dados empresariais da base local.',
  campaigns: 'Agrupe empresas e acompanhe o progresso comercial manualmente.',
  reports: 'Acompanhe indicadores reais da base, campanhas e buscas.',
  settings: 'Configure o agendamento automático de atualizações da base.',
  help: 'Veja como usar os módulos e os limites das informações disponíveis.',
};

const runStatusLabels = {
  queued: 'Na fila',
  running: 'Em andamento',
  completed: 'Concluída',
  failed: 'Falhou',
};

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    setError('');
    getSearchRuns()
      .then((items) => { if (active) setRuns(items.slice(0, 5)); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open]);

  const hasFailed = runs.some((run) => run.status === 'failed');
  const timeFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <NotificationAnchor>
      <IconButton
        type="button"
        aria-label="Notificações de busca"
        aria-expanded={open}
        title="Atividade recente das buscas"
        $failed={hasFailed}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={18} />
        {(hasFailed || runs.some((run) => run.status === 'running' || run.status === 'queued')) && <i />}
      </IconButton>
      {open && (
        <NotificationPanel role="region" aria-label="Atividade recente das buscas" aria-live="polite">
          <div className="header">
            <h2 className="title">Atividade de busca</h2>
            <button type="button" onClick={() => setOpen(false)}>Fechar</button>
          </div>
          {loading && <p className="empty" role="status">Carregando atividade...</p>}
          {error && <p className="empty" role="alert">{error}</p>}
          {!loading && !error && !runs.length && <p className="empty">Nenhuma busca registrada.</p>}
          {!loading && !error && runs.map((run) => (
            <div className="item" key={run.id}>
              <strong className={run.status === 'failed' ? 'failed' : undefined}>
                {runStatusLabels[run.status] || run.status} · {(run.states || []).join(', ') || 'UF não informada'}
              </strong>
              <span>
                {run.createdAt ? timeFormat.format(new Date(run.createdAt)) : 'Data indisponível'}
                {run.status === 'completed' ? ` · ${formatNumber.format(run.foundRows || 0)} empresas encontradas` : ''}
              </span>
              {run.status === 'failed' && run.error && <span className="failed">{run.error.slice(0, 180)}</span>}
            </div>
          ))}
        </NotificationPanel>
      )}
    </NotificationAnchor>
  );
}

const formatNumber = new Intl.NumberFormat('pt-BR');
const formatPercent = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const avatarColors = ['#7868db', '#4f9d83', '#d38c49', '#5687ca', '#b16a8a', '#668d6f'];
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

function Metric({ icon: Icon, label, value, detail, tone }) {
  return (
    <MetricCard>
      <MetricTopRow>
        <MetricLabel>{label}</MetricLabel>
        <MetricIcon $tone={tone}>
          <Icon size={18} strokeWidth={2} />
        </MetricIcon>
      </MetricTopRow>
      <MetricValue>{value}</MetricValue>
      <MetricDetail>{detail}</MetricDetail>
    </MetricCard>
  );
}

function SidebarNavigation({ items, currentPage, onNavigate }) {
  return (
    <NavList>
      {items.map(({ label, icon: Icon, page }) => {
        const active = page === currentPage;
        const disabled = !page;
        return (
          <NavItem
            key={label}
            type="button"
            $active={active}
            disabled={disabled}
            onClick={() => page && onNavigate(page)}
            title={disabled ? `${label} — disponível em breve` : label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
            {disabled && <span className="soon">Em breve</span>}
          </NavItem>
        );
      })}
    </NavList>
  );
}

function ProspectTable() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
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
    getProspects({ page, query })
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
  }, [page, query]);

  const prospects = result?.items || [];
  const firstItem = result?.total ? ((page - 1) * result.pageSize) + 1 : 0;
  const lastItem = Math.min(page * (result?.pageSize || 0), result?.total || 0);

  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>Empresas encontradas</PanelTitle>
          <SectionSubtitle>Empresas ativas encontradas na base oficial</SectionSubtitle>
        </div>
        <SearchWrap>
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Buscar empresa, segmento ou cidade"
            placeholder="Buscar em toda a base..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </SearchWrap>
      </PanelHeader>
      <TableWrap>
        <DataTable>
          <thead>
            <tr>
              <TableHead>Empresa</TableHead>
              <TableHead>Atividade (CNAE)</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Porte</TableHead>
              <TableHead>Abertura</TableHead>
              <TableHead>Status</TableHead>
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
                <DataCell><Tag title={`CNAE ${prospect.cnaePrimary}`}>{prospect.cnaeDescription || prospect.cnaePrimary}</Tag></DataCell>
                <DataCell>
                  <span className="location"><MapPin size={14} />{prospect.city}, {prospect.state}</span>
                </DataCell>
                <DataCell>
                  <span>{prospect.companySize || 'Não informado'}</span>
                </DataCell>
                <DataCell>
                  <span className="opened">{prospect.openedAt ? dateFormat.format(new Date(prospect.openedAt)) : '—'}</span>
                </DataCell>
                <DataCell><Badge $status={prospect.status}>{prospect.statusLabel}</Badge></DataCell>
              </tr>
            ))}
          </tbody>
        </DataTable>
        {loading && <EmptyState>Carregando empresas...</EmptyState>}
        {!loading && error && <EmptyState role="alert">{error}</EmptyState>}
        {!loading && !error && prospects.length === 0 && (
          <EmptyState>{query ? 'Nenhuma empresa corresponde à busca.' : 'Nenhuma empresa encontrada. Inicie uma busca por estado.'}</EmptyState>
        )}
      </TableWrap>
      <TableFooter>
        <span>{result ? `Exibindo ${firstItem}–${lastItem} de ${formatNumber.format(result.total)} empresas` : 'Carregando base...'}</span>
        <div>
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={loading || page <= 1}>
            Anterior
          </button>
          <span>Página {page} de {result?.pageCount || 1}</span>
          <button type="button" onClick={() => setPage((current) => current + 1)} disabled={loading || page >= (result?.pageCount || 1)}>
            Próxima
          </button>
        </div>
      </TableFooter>
    </Panel>
  );
}

function PipelinePanel({ stages }) {
  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>Funil de prospecção</PanelTitle>
          <SectionSubtitle>Distribuição de leads por etapa</SectionSubtitle>
        </div>
        <button className="period-select" type="button" disabled title="Indicadores de toda a base local">
          Toda a base <ChevronDown size={14} />
        </button>
      </PanelHeader>
      <div className="pipeline">
        {stages.map((stage) => (
          <PipelineRow key={stage.label}>
            <PipelineStage>{stage.label}</PipelineStage>
            <PipelineTrack><span style={{ width: `${stage.percent}%`, background: stage.color }} /></PipelineTrack>
            <PipelineValue>{formatNumber.format(stage.count)}</PipelineValue>
          </PipelineRow>
        ))}
      </div>
      <div className="pipeline-note">
        <Sparkles size={16} />
        <span>Atualize o status dos leads conforme sua equipe avança no processo comercial.</span>
      </div>
    </Panel>
  );
}

function ActivityPanel({ activity }) {
  const max = Math.max(...activity.map((day) => day.total), 1);
  return (
    <ActivityCard>
      <ActivityHeading>
        <div>
          <ActivityTitle>Atividade de prospecção</ActivityTitle>
          <SectionSubtitle>Leads identificados nos últimos 7 dias</SectionSubtitle>
        </div>
        <ActivityMeta><span className="live-dot" />Esta semana</ActivityMeta>
      </ActivityHeading>
      <ChartSection aria-label="Gráfico de leads encontrados por dia">
        <ChartGrid>
          {[100, 66, 33, 0].map((line) => <span key={line} style={{ bottom: `${line}%` }} />)}
        </ChartGrid>
        <ChartBars>
          {activity.map((day) => (
            <ChartColumn key={day.label}>
              <ActivityBars>
                <ChartBar
                  title={`${day.total} leads`}
                  style={{ height: `${Math.max((day.total / max) * 100, 7)}%` }}
                />
              </ActivityBars>
              <ChartLabel>{day.label}</ChartLabel>
            </ChartColumn>
          ))}
        </ChartBars>
      </ChartSection>
      <ActivityLegend><LegendDot />Novos leads</ActivityLegend>
    </ActivityCard>
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [activePage, setActivePage] = useState('overview');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const isOverviewPage = activePage === 'overview';
  const pageInfo = pageDetails[activePage] || pageDetails.overview;

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await getDashboard());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro inesperado ao carregar o painel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <AppShell>
      <Sidebar>
        <Brand>
          <BrandMark><Target size={19} strokeWidth={2.5} /></BrandMark>
          <span>lead<span className="brand-accent">engine</span></span>
        </Brand>
        <NavGroup>
          <NavSectionLabel>MENU PRINCIPAL</NavSectionLabel>
          <SidebarNavigation
            items={navigation}
            currentPage={activePage}
            onNavigate={setActivePage}
          />
        </NavGroup>
        <NavGroup>
          <NavSectionLabel>GESTÃO</NavSectionLabel>
          <SidebarNavigation
            items={secondaryNavigation}
            currentPage={activePage}
            onNavigate={setActivePage}
          />
        </NavGroup>
        <SidebarBottom>
          <SidebarLink type="button" onClick={() => setActivePage('help')} title="Abrir central de ajuda">
            <CircleHelp size={17} /> Central de ajuda
          </SidebarLink>
          <div className="user-card">
            <Avatar>LE</Avatar>
            <UserInfo><UserName>Equipe comercial</UserName><UserRole>Plano demonstrativo</UserRole></UserInfo>
            <ChevronDown size={15} />
          </div>
        </SidebarBottom>
      </Sidebar>

      <Layout>
        <Topbar>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{pageInfo.title}</strong>
          </div>
          <HeaderActions>
            <NotificationsMenu />
            <div className="top-user"><Avatar>LE</Avatar><span>Equipe LeadEngine</span><ChevronDown size={14} /></div>
          </HeaderActions>
        </Topbar>

        <Main>
          <Header>
            <div>
              <HeaderEyebrow>
                {isOverviewPage
                  ? new Intl.DateTimeFormat('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    }).format(new Date()).toLocaleUpperCase('pt-BR')
                  : pageInfo.eyebrow}
              </HeaderEyebrow>
              <HeaderTitle>{pageInfo.title}</HeaderTitle>
              <SectionSubtitle>{pageSubtitles[activePage]}</SectionSubtitle>
            </div>
            {isOverviewPage && (
              <RefreshButton type="button" onClick={loadDashboard} disabled={loading}>
                <TrendingUp size={16} className={loading ? 'spinning' : ''} />
                {loading ? 'Atualizando...' : 'Atualizar painel'}
              </RefreshButton>
            )}
          </Header>

          {isOverviewPage && (
            <DemoNotice>
              <Database size={15} />
              <span>
                Fonte: {dashboard?.source || 'Dados Abertos do CNPJ — Receita Federal'}.
                {' '}Somente dados cadastrais empresariais; não coletamos dados pessoais nesta etapa.
              </span>
            </DemoNotice>
          )}

          {isOverviewPage && error && <ErrorBox role="alert">{error}</ErrorBox>}
          {isOverviewPage && loading && !dashboard && (
            <LoadingState><LoaderCircle size={20} className="spinning" /> Carregando painel...</LoadingState>
          )}
          {isOverviewPage && !loading && !dashboard && !error && (
            <ErrorBox role="alert">Nenhum dado disponível para exibição.</ErrorBox>
          )}

          {activePage === 'leads' && (
            <LeadsPage
              statusCounts={dashboard?.statusCounts}
              onStatusChanged={loadDashboard}
              onNavigateToOverview={() => setActivePage('overview')}
            />
          )}
          {activePage === 'companies' && <CompaniesPage />}
          {activePage === 'campaigns' && <CampaignsPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'help' && <HelpPage onNavigate={setActivePage} />}

          {isOverviewPage && dashboard && (
            <Content>
              <Section>
                <SectionHeader>
                  <div><SectionTitle>Base de prospecção</SectionTitle><SectionSubtitle>Empresas cadastradas e indicadores da base local</SectionSubtitle></div>
                  <span className="updated">
                    {dashboard.latestRun?.finishedAt
                      ? `Base consultada em ${dateFormat.format(new Date(dashboard.latestRun.finishedAt))}`
                      : 'Nenhuma busca concluída'}
                  </span>
                </SectionHeader>
                <MetricGrid>
                  <Metric icon={Users} label="Empresas encontradas" value={formatNumber.format(dashboard.metrics.activeProspects)} detail="CNPJs ativos na base" tone="purple" />
                  <Metric icon={Sparkles} label="Novas hoje" value={formatNumber.format(dashboard.metrics.newToday)} detail="Incluídas desde a meia-noite" tone="blue" />
                  <Metric icon={Target} label="Qualificadas" value={formatNumber.format(dashboard.metrics.qualified)} detail="Status salvo na base" tone="green" />
                  <Metric icon={TrendingUp} label="Clientes" value={`${formatPercent.format(dashboard.metrics.conversion)}%`} detail={`${formatNumber.format(dashboard.metrics.customers)} clientes na base`} tone="orange" />
                </MetricGrid>
              </Section>

              <div className="insights-grid">
                <ActivityPanel activity={dashboard.activity} />
                <PipelinePanel stages={dashboard.funnel} />
              </div>

              <LeadSearch onCompleted={loadDashboard} />

              <Section>
                <ProspectTable key={dashboard.latestRun?.finishedAt || 'initial'} />
              </Section>
              <div className="footer-note">LeadEngine · Prospecção inteligente para gestão e auditoria</div>
            </Content>
          )}
        </Main>
      </Layout>
    </AppShell>
  );
}
