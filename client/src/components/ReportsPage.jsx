import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { getReports } from '../api.js';
import {
  DistributionList,
  DistributionRow,
  ModuleButton,
  ModuleColumns,
  ModuleEmpty,
  ModuleFeedback,
  ModuleMetric,
  ModuleMetricGrid,
  ModulePage,
} from './ModuleStyles.js';
import { EmptyState, Panel, PanelHeader, PanelTitle, SectionSubtitle } from './DashboardStyles.js';

const numberFormat = new Intl.NumberFormat('pt-BR');
const prospectLabels = {
  new: 'Novo lead',
  qualified: 'Qualificado',
  contacted: 'Contatado',
  meeting: 'Reunião',
  customer: 'Cliente',
  disqualified: 'Desqualificado',
};
const campaignLabels = {
  draft: 'Rascunho',
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída',
};
const campaignLeadLabels = {
  pending: 'Pendente',
  contacted: 'Contatado',
  responded: 'Respondeu',
  meeting: 'Reunião',
  converted: 'Convertido',
  excluded: 'Excluído',
};

function DistributionPanel({ title, subtitle, items, labelFor, total }) {
  const highest = Math.max(...items.map((item) => item.total), 1);
  return (
    <Panel>
      <PanelHeader>
        <div><PanelTitle>{title}</PanelTitle><SectionSubtitle>{subtitle}</SectionSubtitle></div>
      </PanelHeader>
      {!items.length ? (
        <ModuleEmpty><span>Os indicadores aparecerão quando houver dados.</span></ModuleEmpty>
      ) : (
        <DistributionList>
          {items.map((item) => (
            <DistributionRow key={item.state || item.cnae || item.status}>
              <span className="name" title={labelFor(item)}>{labelFor(item)}</span>
              <span className="track"><span style={{ width: `${Math.max((item.total / highest) * 100, 2)}%` }} /></span>
              <span className="value">{numberFormat.format(item.total)}</span>
            </DistributionRow>
          ))}
          {total > 0 && <span className="value">{numberFormat.format(total)} registros considerados</span>}
        </DistributionList>
      )}
    </Panel>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getReports()
      .then((data) => { if (active) setReport(data); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  const prospectTotal = report?.metrics.activeProspects || 0;

  return (
    <ModulePage>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModuleButton type="button" onClick={() => setReloadKey((value) => value + 1)} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          Atualizar relatórios
        </ModuleButton>
      </div>
      {error && <ModuleFeedback role="alert">{error}</ModuleFeedback>}
      {loading && !report ? (
        <EmptyState role="status">Carregando indicadores...</EmptyState>
      ) : report && (
        <>
          <ModuleMetricGrid>
            <ModuleMetric><span className="label">Empresas ativas</span><span className="value">{numberFormat.format(report.metrics.activeProspects)}</span></ModuleMetric>
            <ModuleMetric><span className="label">Campanhas</span><span className="value">{numberFormat.format(report.metrics.campaigns)}</span></ModuleMetric>
            <ModuleMetric><span className="label">Buscas concluídas</span><span className="value">{numberFormat.format(report.metrics.completedRuns)}</span></ModuleMetric>
            <ModuleMetric><span className="label">Buscas com falha</span><span className="value">{numberFormat.format(report.metrics.failedRuns)}</span></ModuleMetric>
          </ModuleMetricGrid>
          <ModuleColumns>
            <DistributionPanel
              title="Empresas por estado"
              subtitle="Até 10 UFs com mais estabelecimentos ativos"
              items={report.states}
              labelFor={(item) => item.state}
              total={prospectTotal}
            />
            <DistributionPanel
              title="Atividades econômicas"
              subtitle="CNAEs principais mais frequentes"
              items={report.sectors}
              labelFor={(item) => `CNAE ${item.cnae}`}
              total={prospectTotal}
            />
            <DistributionPanel
              title="Etapas dos leads"
              subtitle="Distribuição da base comercial ativa"
              items={report.statuses}
              labelFor={(item) => prospectLabels[item.status] || item.status}
              total={prospectTotal}
            />
            <DistributionPanel
              title="Campanhas"
              subtitle="Campanhas por situação"
              items={report.campaignsByStatus}
              labelFor={(item) => campaignLabels[item.status] || item.status}
            />
            <DistributionPanel
              title="Empresas nas campanhas"
              subtitle="Acompanhamento manual por etapa"
              items={report.campaignLeadsByStatus}
              labelFor={(item) => campaignLeadLabels[item.status] || item.status}
            />
          </ModuleColumns>
          <SectionSubtitle>
            Indicadores gerados em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(report.generatedAt))}.
          </SectionSubtitle>
        </>
      )}
      {!loading && !error && !prospectTotal && report && (
        <ModuleFeedback $success>
          <BarChart3 size={15} /> A base ainda não possui empresas ativas. Faça uma busca por UF na Visão geral para começar.
        </ModuleFeedback>
      )}
    </ModulePage>
  );
}
