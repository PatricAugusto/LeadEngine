import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Megaphone, Plus, Search, Trash2, Users } from 'lucide-react';
import {
  addCampaignProspects,
  createCampaign,
  getCampaignProspects,
  getCampaigns,
  getProspects,
  removeCampaignProspect,
  updateCampaign,
  updateCampaignProspect,
} from '../api.js';
import {
  DataCell,
  DataTable,
  EmptyState,
  LeadCompany,
  LeadInfo,
  LeadName,
  LeadSubtext,
  Panel,
  PanelHeader,
  PanelTitle,
  SectionSubtitle,
  TableFooter,
  TableHead,
  TableWrap,
} from './DashboardStyles.js';
import {
  CardGrid,
  FormGrid,
  FormInput,
  FormLabel,
  FormTextarea,
  ModuleButton,
  ModuleControls,
  ModuleEmpty,
  ModuleFeedback,
  ModulePage,
  ModuleSearch,
  ModuleSelect,
  ModuleToolbar,
  SelectableCard,
} from './ModuleStyles.js';
import { LeadStatusSelect } from './LeadsStyles.js';

const campaignStatuses = [
  ['draft', 'Rascunho'],
  ['active', 'Ativa'],
  ['paused', 'Pausada'],
  ['completed', 'Concluída'],
];
const memberStatuses = [
  ['pending', 'Pendente'],
  ['contacted', 'Contatado'],
  ['responded', 'Respondeu'],
  ['meeting', 'Reunião'],
  ['converted', 'Convertido'],
  ['excluded', 'Excluído'],
];
const numberFormat = new Intl.NumberFormat('pt-BR');

function formatCnpj(value) {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function CampaignForm({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const campaign = await createCampaign({ name, description });
      await onCreated(campaign);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormGrid onSubmit={submit}>
      <PanelTitle>Nova campanha</PanelTitle>
      <FormLabel>
        Nome
        <FormInput value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required minLength={2} placeholder="Ex.: Prospecção regional — Sul" />
      </FormLabel>
      <FormLabel>
        Descrição <span style={{ color: '#818c9a', fontWeight: 400 }}>opcional, até 500 caracteres</span>
        <FormTextarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} placeholder="Objetivo ou contexto da campanha" />
      </FormLabel>
      {error && <ModuleFeedback role="alert">{error}</ModuleFeedback>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <ModuleButton type="submit" $primary disabled={saving}><Plus size={14} />Criar campanha</ModuleButton>
        <ModuleButton type="button" onClick={onCancel} disabled={saving}>Cancelar</ModuleButton>
      </div>
    </FormGrid>
  );
}

function AddCompanies({ campaignId, onAdded, onCancel }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getProspects({ pageSize: 25, query })
      .then((result) => { if (active) setCompanies(result.items); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);

  function toggle(id) {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    ));
  }

  async function addSelected() {
    setSaving(true);
    setError('');
    try {
      const result = await addCampaignProspects(campaignId, selectedIds);
      setSelectedIds([]);
      await onAdded(result);
    } catch (addError) {
      setError(addError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <PanelHeader>
        <div><PanelTitle>Adicionar empresas</PanelTitle><SectionSubtitle>Selecione até 100 empresas ativas nesta operação.</SectionSubtitle></div>
        <ModuleButton type="button" onClick={onCancel}>Fechar</ModuleButton>
      </PanelHeader>
      <div style={{ display: 'grid', gap: 12, padding: '0 20px 18px' }}>
        <ModuleSearch>
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Buscar empresas para adicionar à campanha"
            placeholder="Buscar por nome, CNPJ ou CNAE..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </ModuleSearch>
        {error && <ModuleFeedback role="alert">{error}</ModuleFeedback>}
        {!loading && !error && !companies.length ? (
          <ModuleEmpty><span>Nenhuma empresa ativa corresponde à busca.</span></ModuleEmpty>
        ) : (
          <TableWrap>
            <DataTable style={{ minWidth: 560 }}>
              <thead><tr><TableHead>Selecionar</TableHead><TableHead>Empresa</TableHead><TableHead>Localização</TableHead></tr></thead>
              <tbody>
                {companies.map((company) => {
                  const selected = selectedIds.includes(company.id);
                  return (
                    <tr key={company.id}>
                      <DataCell>
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!selected && selectedIds.length >= 100}
                        onChange={() => toggle(company.id)}
                        aria-label={`Selecionar ${company.companyName}`}
                        style={{ accentColor: '#9c83f5' }}
                      />
                      </DataCell>
                      <DataCell>
                        <LeadCompany><LeadInfo><LeadName>{company.companyName}</LeadName><LeadSubtext>CNPJ {formatCnpj(company.cnpj)}</LeadSubtext></LeadInfo></LeadCompany>
                      </DataCell>
                      <DataCell>{company.city}, {company.state}</DataCell>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
            {loading && <EmptyState role="status">Buscando empresas...</EmptyState>}
          </TableWrap>
        )}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 9 }}>
          <ModuleButton type="button" $primary onClick={addSelected} disabled={!selectedIds.length || saving}>
            <Plus size={14} />Adicionar {selectedIds.length ? numberFormat.format(selectedIds.length) : 'selecionadas'}
          </ModuleButton>
          <span style={{ color: '#8792a0', fontSize: 11 }}>Empresas já incluídas não serão duplicadas.</span>
        </div>
      </div>
    </Panel>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [membersResult, setMembersResult] = useState(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [memberPage, setMemberPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showAddCompanies, setShowAddCompanies] = useState(false);
  const [updatingId, setUpdatingId] = useState('');

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId),
    [campaigns, selectedId],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getCampaigns()
      .then((items) => {
        if (!active) return;
        setCampaigns(items);
        if (selectedId && !items.some((item) => item.id === selectedId)) setSelectedId('');
      })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMemberQuery(memberSearch.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [memberSearch]);

  useEffect(() => {
    if (!selectedId) {
      setMembersResult(null);
      return undefined;
    }
    let active = true;
    setError('');
    getCampaignProspects(selectedId, { page: memberPage, query: memberQuery })
      .then((result) => { if (active) setMembersResult(result); })
      .catch((loadError) => { if (active) setError(loadError.message); });
    return () => { active = false; };
  }, [memberPage, memberQuery, reloadKey, selectedId]);

  function refresh() {
    setReloadKey((value) => value + 1);
  }

  async function handleCampaignStatus(status) {
    setError('');
    try {
      await updateCampaign(selectedId, { status });
      refresh();
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function handleMemberStatus(prospectId, status) {
    setError('');
    setUpdatingId(prospectId);
    try {
      await updateCampaignProspect(selectedId, prospectId, status);
      refresh();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId('');
    }
  }

  async function handleRemove(prospectId) {
    setError('');
    try {
      await removeCampaignProspect(selectedId, prospectId);
      setNotice('Empresa removida da campanha. O lead continua na base geral.');
      refresh();
    } catch (removeError) {
      setError(removeError.message);
    }
  }

  async function handleCreated(campaign) {
    setNotice('Campanha criada.');
    setShowCreate(false);
    setCampaigns((items) => [campaign, ...items]);
    setSelectedId(campaign.id);
  }

  async function handleCompaniesAdded(result) {
    setNotice(`${numberFormat.format(result.added)} empresa(s) adicionada(s); ${numberFormat.format(result.alreadyIncluded)} já estavam nesta campanha.`);
    setShowAddCompanies(false);
    refresh();
  }

  const members = membersResult?.items || [];
  const firstItem = membersResult?.total ? ((memberPage - 1) * membersResult.pageSize) + 1 : 0;
  const lastItem = Math.min(memberPage * (membersResult?.pageSize || 0), membersResult?.total || 0);

  return (
    <ModulePage>
      {error && <ModuleFeedback role="alert">{error}</ModuleFeedback>}
      {notice && <ModuleFeedback $success role="status">{notice}</ModuleFeedback>}
      {selectedCampaign ? (
        <>
          <ModuleToolbar>
            <ModuleControls>
              <ModuleButton type="button" onClick={() => { setSelectedId(''); setShowAddCompanies(false); }}>
                <ArrowLeft size={14} />Campanhas
              </ModuleButton>
              <strong style={{ color: '#e2e6ec', fontSize: 13 }}>{selectedCampaign.name}</strong>
            </ModuleControls>
            <ModuleSelect
              aria-label="Etapa da campanha"
              value={selectedCampaign.status}
              onChange={(event) => handleCampaignStatus(event.target.value)}
            >
              {campaignStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </ModuleSelect>
          </ModuleToolbar>
          {selectedCampaign.description && (
            <Panel><div style={{ padding: 15, color: '#9aa4b1', fontSize: 12, lineHeight: 1.6 }}>{selectedCampaign.description}</div></Panel>
          )}
          <ModuleToolbar>
            <span style={{ color: '#aeb7c2', fontSize: 12 }}>
              <Users size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {numberFormat.format(selectedCampaign.prospectCount)} empresa(s) nesta campanha
            </span>
            <ModuleButton type="button" $primary onClick={() => setShowAddCompanies((value) => !value)}>
              <Plus size={14} />Adicionar empresas
            </ModuleButton>
          </ModuleToolbar>
          {showAddCompanies && (
            <AddCompanies
              campaignId={selectedId}
              onAdded={handleCompaniesAdded}
              onCancel={() => setShowAddCompanies(false)}
            />
          )}
          <Panel>
            <PanelHeader>
              <div><PanelTitle>Empresas da campanha</PanelTitle><SectionSubtitle>Atualize a etapa de acompanhamento sem enviar mensagens pelo sistema.</SectionSubtitle></div>
              <ModuleSearch>
                <Search size={15} aria-hidden="true" />
                <input
                  aria-label="Buscar empresas dentro da campanha"
                  placeholder="Buscar nesta campanha..."
                  value={memberSearch}
                  onChange={(event) => { setMemberSearch(event.target.value); setMemberPage(1); }}
                />
              </ModuleSearch>
            </PanelHeader>
            {!members.length && !error ? (
              <ModuleEmpty>
                <Users size={21} />
                <strong>{memberQuery ? 'Nenhuma empresa corresponde à busca' : 'A campanha ainda não tem empresas'}</strong>
                <span>Adicione empresas ativas da base para acompanhar o andamento manualmente.</span>
              </ModuleEmpty>
            ) : (
              <>
                <TableWrap>
                  <DataTable>
                    <thead><tr><TableHead>Empresa</TableHead><TableHead>Localização</TableHead><TableHead>Etapa na campanha</TableHead><TableHead>Ação</TableHead></tr></thead>
                    <tbody>
                      {members.map(({ prospect, status }) => (
                        <tr key={prospect.id}>
                          <DataCell>
                            <LeadCompany><LeadInfo><LeadName>{prospect.companyName}</LeadName><LeadSubtext>CNPJ {formatCnpj(prospect.cnpj)}</LeadSubtext></LeadInfo></LeadCompany>
                          </DataCell>
                          <DataCell>{prospect.city}, {prospect.state}</DataCell>
                          <DataCell>
                            <LeadStatusSelect
                              aria-label={`Etapa de ${prospect.companyName} nesta campanha`}
                              value={status}
                              disabled={updatingId === prospect.id}
                              onChange={(event) => handleMemberStatus(prospect.id, event.target.value)}
                            >
                              {memberStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </LeadStatusSelect>
                          </DataCell>
                          <DataCell>
                            <ModuleButton
                              type="button"
                              $danger
                              aria-label={`Remover ${prospect.companyName} da campanha`}
                              title="Remove somente da campanha"
                              onClick={() => handleRemove(prospect.id)}
                            >
                              <Trash2 size={14} />
                            </ModuleButton>
                          </DataCell>
                        </tr>
                      ))}
                    </tbody>
                  </DataTable>
                </TableWrap>
                <TableFooter>
                  <span>{membersResult ? `Exibindo ${firstItem}–${lastItem} de ${numberFormat.format(membersResult.total)} empresas` : 'Carregando empresas...'}</span>
                  <div>
                    <button type="button" onClick={() => setMemberPage((value) => Math.max(1, value - 1))} disabled={memberPage <= 1}>Anterior</button>
                    <span>Página {memberPage} de {membersResult?.pageCount || 1}</span>
                    <button type="button" onClick={() => setMemberPage((value) => value + 1)} disabled={memberPage >= (membersResult?.pageCount || 1)}>Próxima</button>
                  </div>
                </TableFooter>
              </>
            )}
          </Panel>
        </>
      ) : (
        <>
          <ModuleToolbar>
            <span style={{ color: '#9aa4b1', fontSize: 12 }}>
              Organize grupos de empresas e acompanhe resultados manualmente. Sem disparos de comunicação.
            </span>
            <ModuleButton type="button" $primary onClick={() => setShowCreate((value) => !value)}>
              <Plus size={14} />Nova campanha
            </ModuleButton>
          </ModuleToolbar>
          {showCreate && (
            <CampaignForm
              onCreated={handleCreated}
              onCancel={() => setShowCreate(false)}
            />
          )}
          {loading && !campaigns.length ? (
            <EmptyState role="status">Carregando campanhas...</EmptyState>
          ) : !campaigns.length ? (
            <ModuleEmpty>
              <Megaphone size={22} />
              <strong>Nenhuma campanha criada</strong>
              <span>Crie uma campanha para selecionar empresas ativas e registrar o acompanhamento comercial.</span>
            </ModuleEmpty>
          ) : (
            <CardGrid>
              {campaigns.map((campaign) => (
                <SelectableCard
                  key={campaign.id}
                  type="button"
                  onClick={() => { setSelectedId(campaign.id); setMemberPage(1); setMemberSearch(''); setNotice(''); }}
                >
                  <strong>{campaign.name}</strong>
                  <span>{campaign.description || 'Sem descrição'}</span>
                  <span>{campaign.statusLabel} · {numberFormat.format(campaign.prospectCount)} empresas</span>
                </SelectableCard>
              ))}
            </CardGrid>
          )}
        </>
      )}
    </ModulePage>
  );
}
