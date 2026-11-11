import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
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
import { getDashboard } from './api.js';
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
  MetricChange,
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
  Progress,
  RefreshButton,
  SearchWrap,
  Section,
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
  Sidebar,
  SidebarBottom,
  SidebarLink,
  TableHead,
  TableWrap,
  Tag,
  Topbar,
  UserInfo,
  UserName,
  UserRole,
} from './components/DashboardStyles.js';

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard, active: true },
  { label: 'Leads', icon: Users },
  { label: 'Empresas', icon: Building2 },
  { label: 'Campanhas', icon: Megaphone },
];

const secondaryNavigation = [
  { label: 'Relatórios', icon: ClipboardList },
  { label: 'Configurações', icon: Settings2 },
];

const formatNumber = new Intl.NumberFormat('pt-BR');
const formatPercent = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function Metric({ icon: Icon, label, value, change, tone, direction = 'up' }) {
  const ChangeIcon = direction === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <MetricCard>
      <MetricTopRow>
        <MetricLabel>{label}</MetricLabel>
        <MetricIcon $tone={tone}>
          <Icon size={18} strokeWidth={2} />
        </MetricIcon>
      </MetricTopRow>
      <MetricValue>{value}</MetricValue>
      <MetricChange $direction={direction}>
        <ChangeIcon size={14} />
        <span>{change}</span>
        <span className="period">vs. mês passado</span>
      </MetricChange>
    </MetricCard>
  );
}

function SidebarNavigation({ items }) {
  return (
    <NavList>
      {items.map(({ label, icon: Icon, active }) => (
        <NavItem
          key={label}
          type="button"
          $active={Boolean(active)}
          disabled={!active}
          title={active ? label : `${label} — disponível em breve`}
          aria-current={active ? 'page' : undefined}
        >
          <Icon size={18} />
          <span>{label}</span>
          {!active && <span className="soon">Em breve</span>}
        </NavItem>
      ))}
    </NavList>
  );
}

function ProspectTable({ prospects, search, onSearch }) {
  const filteredProspects = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (!term) return prospects;
    return prospects.filter((prospect) =>
      [prospect.companyName, prospect.segment, prospect.city, prospect.state]
        .join(' ')
        .toLocaleLowerCase('pt-BR')
        .includes(term),
    );
  }, [prospects, search]);

  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>Leads em destaque</PanelTitle>
          <SectionSubtitle>Empresas com maior potencial de conversão</SectionSubtitle>
        </div>
        <SearchWrap>
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Buscar empresa, segmento ou cidade"
            placeholder="Buscar leads..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </SearchWrap>
      </PanelHeader>
      <TableWrap>
        <DataTable>
          <thead>
            <tr>
              <TableHead>Empresa</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Qualificação</TableHead>
              <TableHead>Potencial</TableHead>
            </tr>
          </thead>
          <tbody>
            {filteredProspects.map((prospect) => (
              <tr key={prospect.id}>
                <DataCell>
                  <LeadCompany>
                    <LeadInitial $color={prospect.color}>{prospect.initials}</LeadInitial>
                    <LeadInfo>
                      <LeadName>{prospect.companyName}</LeadName>
                      <LeadSubtext>{prospect.contact}</LeadSubtext>
                    </LeadInfo>
                  </LeadCompany>
                </DataCell>
                <DataCell><Tag>{prospect.segment}</Tag></DataCell>
                <DataCell>
                  <span className="location"><MapPin size={14} />{prospect.city}, {prospect.state}</span>
                </DataCell>
                <DataCell><Badge $status={prospect.status}>{prospect.statusLabel}</Badge></DataCell>
                <DataCell>
                  <div className="score">
                    <Progress><span style={{ width: `${prospect.score}%` }} /></Progress>
                    <span>{prospect.score}</span>
                  </div>
                </DataCell>
              </tr>
            ))}
          </tbody>
        </DataTable>
        {filteredProspects.length === 0 && (
          <EmptyState>Nenhum lead corresponde à busca.</EmptyState>
        )}
      </TableWrap>
      <div className="table-footer">
        <span>Exibindo {filteredProspects.length} de {prospects.length} leads demonstrativos</span>
        <button type="button" disabled title="Disponível em breve">Ver todos <ChevronDown size={14} /></button>
      </div>
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
        <button className="period-select" type="button" disabled title="Período demonstrativo">
          Este mês <ChevronDown size={14} />
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
        <span>Leads qualificados têm <strong>2,4× mais chance</strong> de avançar para uma reunião.</span>
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
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
          <SidebarNavigation items={navigation} />
        </NavGroup>
        <NavGroup>
          <NavSectionLabel>GESTÃO</NavSectionLabel>
          <SidebarNavigation items={secondaryNavigation} />
        </NavGroup>
        <SidebarBottom>
          <SidebarLink type="button" disabled title="Central de ajuda disponível em breve">
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
          <div className="breadcrumb">Workspace <span>/</span> <strong>Visão geral</strong></div>
          <HeaderActions>
            <IconButton type="button" aria-label="Notificações (indisponível)" disabled title="Disponível em breve">
              <Bell size={18} />
              <i />
            </IconButton>
            <div className="top-user"><Avatar>LE</Avatar><span>Equipe LeadEngine</span><ChevronDown size={14} /></div>
          </HeaderActions>
        </Topbar>

        <Main>
          <Header>
            <div>
              <HeaderEyebrow>
                {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                  .format(new Date())
                  .toLocaleUpperCase('pt-BR')}
              </HeaderEyebrow>
              <HeaderTitle>Visão geral <span>👋</span></HeaderTitle>
              <SectionSubtitle>Encontre as melhores oportunidades para o seu time.</SectionSubtitle>
            </div>
            <RefreshButton type="button" onClick={loadDashboard} disabled={loading}>
              <TrendingUp size={16} className={loading ? 'spinning' : ''} />
              {loading ? 'Atualizando...' : 'Atualizar painel'}
            </RefreshButton>
          </Header>

          <DemoNotice>
            <Sparkles size={15} />
            <span>Modo demonstração — os dados exibidos são fictícios e não representam empresas reais.</span>
          </DemoNotice>

          {error && <ErrorBox role="alert">{error}</ErrorBox>}
          {loading && !dashboard && (
            <LoadingState><LoaderCircle size={20} className="spinning" /> Carregando painel...</LoadingState>
          )}
          {!loading && !dashboard && !error && (
            <ErrorBox role="alert">Nenhum dado disponível para exibição.</ErrorBox>
          )}

          {dashboard && (
            <Content>
              <Section>
                <SectionHeader>
                  <div><SectionTitle>Seus resultados</SectionTitle><SectionSubtitle>Resumo da operação comercial</SectionSubtitle></div>
                  <span className="updated">Atualizado agora</span>
                </SectionHeader>
                <MetricGrid>
                  <Metric icon={Users} label="Leads mapeados" value={formatNumber.format(dashboard.metrics.activeProspects)} change="+12,8%" tone="purple" />
                  <Metric icon={Sparkles} label="Novos hoje" value={formatNumber.format(dashboard.metrics.newToday)} change="+8,2%" tone="blue" />
                  <Metric icon={Target} label="Qualificados" value={formatNumber.format(dashboard.metrics.qualified)} change="+4,6%" tone="green" />
                  <Metric icon={TrendingUp} label="Conversão" value={`${formatPercent.format(dashboard.metrics.conversion)}%`} change="-1,3%" tone="orange" direction="down" />
                </MetricGrid>
              </Section>

              <div className="insights-grid">
                <ActivityPanel activity={dashboard.activity} />
                <PipelinePanel stages={dashboard.funnel} />
              </div>

              <Section>
                <ProspectTable prospects={dashboard.prospects} search={search} onSearch={setSearch} />
              </Section>
              <div className="footer-note">LeadEngine · Prospecção inteligente para gestão e auditoria</div>
            </Content>
          )}
        </Main>
      </Layout>
    </AppShell>
  );
}
