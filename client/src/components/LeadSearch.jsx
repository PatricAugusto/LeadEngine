import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  LoaderCircle,
  Play,
} from 'lucide-react';
import { getSearchRun, getSearchRuns, startSearch } from '../api.js';
import { allStateCodes, states } from '../data/states.js';
import {
  SearchActions,
  SearchButton,
  SearchCard,
  SearchCardHeader,
  SearchCheckbox,
  SearchField,
  SearchNotice,
  SearchProgress,
  SearchProgressTrack,
  SearchSection,
  SearchStatus,
  SearchStatusLine,
  StateGrid,
} from './SearchStyles.js';

const numberFormat = new Intl.NumberFormat('pt-BR');
const stepLabels = {
  queued: 'Na fila',
  download: 'Baixando arquivos oficiais da Receita',
  index: 'Preparando índice de empresas',
  filter: 'Filtrando estabelecimentos ativos por UF',
  save: 'Atualizando a base local',
  completed: 'Busca concluída',
  failed: 'Busca interrompida',
};

function isActiveRun(run) {
  return run && (run.status === 'queued' || run.status === 'running');
}

function StateSelector({ selectedStates, onChange }) {
  const allSelected = selectedStates.length === allStateCodes.length;
  const toggleAll = () => onChange(allSelected ? [] : allStateCodes);
  const toggleState = (code) => {
    onChange(
      selectedStates.includes(code)
        ? selectedStates.filter((state) => state !== code)
        : [...selectedStates, code].sort(),
    );
  };

  return (
    <StateGrid>
      <SearchCheckbox className="select-all">
        <input type="checkbox" checked={allSelected} onChange={toggleAll} />
        <span>Todas as UFs</span>
      </SearchCheckbox>
      <div className="states">
        {states.map(([code, name]) => (
          <SearchCheckbox key={code} title={name}>
            <input
              type="checkbox"
              checked={selectedStates.includes(code)}
              onChange={() => toggleState(code)}
            />
            <span>{code}</span>
          </SearchCheckbox>
        ))}
      </div>
    </StateGrid>
  );
}

function SearchRunStatus({ run }) {
  if (!run) return null;
  const successful = run.status === 'completed';
  const failed = run.status === 'failed';
  return (
    <SearchStatus $state={failed ? 'error' : successful ? 'success' : 'active'}>
      <SearchStatusLine>
        {failed ? <AlertCircle size={16} /> : successful ? <CheckCircle2 size={16} /> : <LoaderCircle size={16} className="spinning" />}
        <strong>{stepLabels[run.currentStep] || run.currentStep}</strong>
        <span>{(run.states || []).join(', ')}</span>
      </SearchStatusLine>
      {isActiveRun(run) && (
        <SearchProgress>
          <SearchProgressTrack>
            <span style={{ width: `${Math.min(run.progress || 0, 100)}%` }} />
          </SearchProgressTrack>
          <span>{run.progress || 0}% · {numberFormat.format(run.processedRows || 0)} registros verificados</span>
        </SearchProgress>
      )}
      {successful && (
        <p>Busca {run.sourceVersion} concluída: {numberFormat.format(run.foundRows)} empresas ativas encontradas.</p>
      )}
      {failed && <p role="alert">{run.error || 'A busca não pôde ser concluída.'}</p>}
    </SearchStatus>
  );
}

export default function LeadSearch({ onCompleted }) {
  const [selectedStates, setSelectedStates] = useState(allStateCodes);
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [error, setError] = useState('');

  const selectedLabel = `${selectedStates.length} ${selectedStates.length === 1 ? 'UF selecionada' : 'UFs selecionadas'}`;

  useEffect(() => {
    let active = true;
    getSearchRuns()
      .then((runs) => {
        if (!active) return;
        if (runs.length) setRun(runs[0]);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoadingRuns(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isActiveRun(run)) return undefined;
    const timer = window.setInterval(async () => {
      try {
        const updated = await getSearchRun(run.id);
        setRun(updated);
        if (updated.status === 'completed') onCompleted();
      } catch (pollError) {
        setError(pollError.message);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [run, onCompleted]);

  const handleSearch = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const newRun = await startSearch(selectedStates);
      setRun(newRun);
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }, [selectedStates]);

  return (
    <SearchSection>
      <SearchCard>
        <SearchCardHeader>
          <div className="search-icon"><Database size={18} /></div>
          <div>
            <h2>Buscar empresas por estado</h2>
            <p>Dados cadastrais empresariais da base aberta de CNPJ da Receita Federal.</p>
          </div>
        </SearchCardHeader>

        <SearchNotice>
          <AlertCircle size={16} />
          <span>A primeira busca baixa 22 arquivos nacionais e pode consumir bastante disco, rede e tempo. Mesmo com o cache, cada execução percorre os arquivos de estabelecimentos; selecione apenas as UFs necessárias e agende conforme a capacidade da máquina.</span>
        </SearchNotice>

        <SearchField>
          <div className="field-heading">
            <div><strong>Estados</strong><span>{selectedLabel}</span></div>
            <span>Somente estabelecimentos com situação ativa</span>
          </div>
          <StateSelector selectedStates={selectedStates} onChange={setSelectedStates} />
        </SearchField>

        <SearchActions>
          <SearchButton type="button" onClick={handleSearch} disabled={loading || loadingRuns || !selectedStates.length || isActiveRun(run)}>
            {loading || isActiveRun(run)
              ? <LoaderCircle size={16} className="spinning" />
              : <Play size={16} />}
            {loading || isActiveRun(run) ? 'Busca em andamento' : 'Iniciar busca'}
          </SearchButton>
        </SearchActions>

        {error && <SearchStatus $state="error" role="alert"><AlertCircle size={16} /><span>{error}</span></SearchStatus>}
        <SearchRunStatus run={run} />
      </SearchCard>
    </SearchSection>
  );
}
