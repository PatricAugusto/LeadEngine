import { useEffect, useState } from 'react';
import { AlertCircle, CalendarClock, CheckCircle2, LoaderCircle, Save } from 'lucide-react';
import { getSearchSchedule, saveSearchSchedule } from '../api.js';
import { allStateCodes, states } from '../data/states.js';
import { Panel, PanelHeader, PanelTitle, SectionSubtitle } from './DashboardStyles.js';
import {
  FormLabel,
  ModuleButton,
  ModuleFeedback,
  ModulePage,
  ModuleSelect,
  StatePicker,
} from './ModuleStyles.js';

export default function SettingsPage() {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [selectedStates, setSelectedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setLoadFailed(false);
    getSearchSchedule()
      .then((schedule) => {
        if (!active) return;
        setEnabled(schedule.enabled);
        setFrequency(schedule.frequency);
        setSelectedStates(schedule.states);
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [reloadKey]);

  function toggleState(code) {
    setSelectedStates((current) => (
      current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code].sort()
    ));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const schedule = await saveSearchSchedule({ enabled, frequency, states: selectedStates });
      setEnabled(schedule.enabled);
      setSelectedStates(schedule.states);
      setNotice(schedule.enabled
        ? `Busca ${frequency === 'weekly' ? 'semanal' : 'mensal'} habilitada para ${schedule.states.join(', ')} às 03:00 (horário de Brasília).`
        : 'Agendamento automático desativado.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  const allSelected = selectedStates.length === allStateCodes.length;

  return (
    <ModulePage>
      <Panel>
        <PanelHeader>
          <div>
            <PanelTitle>Agendamento de buscas</PanelTitle>
            <SectionSubtitle>Configure a atualização automática da base de empresas.</SectionSubtitle>
          </div>
          <CalendarClock size={18} color="#a78bfa" aria-hidden="true" />
        </PanelHeader>
        {loadFailed && (
          <div style={{ padding: '0 20px 16px' }}>
            <ModuleButton type="button" onClick={() => setReloadKey((value) => value + 1)}>
              Tentar carregar novamente
            </ModuleButton>
          </div>
        )}
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 16, padding: '0 20px 20px' }}>
          <FormLabel>
            Frequência
            <ModuleSelect value={frequency} onChange={(event) => setFrequency(event.target.value)} disabled={loading || saving || loadFailed}>
              <option value="weekly">Semanal — segunda-feira às 03:00</option>
              <option value="monthly">Mensal — dia 1 às 03:00</option>
            </ModuleSelect>
          </FormLabel>
          <FormLabel>
            Estados que serão atualizados
            <StatePicker>
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelectedStates(allSelected ? [] : allStateCodes)}
                  disabled={loading || saving || loadFailed}
                />
                Todas as UFs
              </label>
              <div className="states">
                {states.map(([code, name]) => (
                  <label key={code} title={name}>
                    <input
                      type="checkbox"
                      checked={selectedStates.includes(code)}
                      onChange={() => toggleState(code)}
                      disabled={loading || saving || loadFailed}
                    />
                    {code}
                  </label>
                ))}
              </div>
            </StatePicker>
          </FormLabel>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#c5cbd4', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              disabled={loading || saving || loadFailed}
              style={{ accentColor: '#9c83f5' }}
            />
            Ativar agendamento automático
          </label>
          <p style={{ margin: 0, color: '#8792a0', fontSize: 11, lineHeight: 1.6 }}>
            A busca baixa arquivos nacionais da Receita Federal e processa as UFs selecionadas. Planeje uso de rede, disco e processamento. O agendamento depende da API estar ativa no horário programado.
          </p>
          <div>
            <ModuleButton type="submit" $primary disabled={loading || saving || loadFailed || (enabled && !selectedStates.length)}>
              {saving ? <LoaderCircle size={15} className="spinning" /> : <Save size={15} />}
              Salvar configurações
            </ModuleButton>
          </div>
        </form>
        {error && <ModuleFeedback role="alert" style={{ margin: '0 20px 18px' }}><AlertCircle size={15} /> {error}</ModuleFeedback>}
        {notice && <ModuleFeedback $success role="status" style={{ margin: '0 20px 18px' }}><CheckCircle2 size={15} /> {notice}</ModuleFeedback>}
      </Panel>
    </ModulePage>
  );
}
