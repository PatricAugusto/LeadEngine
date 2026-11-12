import { BookOpen, Building2, Megaphone, Search, Settings2, Users } from 'lucide-react';
import { HelpCard, HelpGrid, ModulePage } from './ModuleStyles.js';

const guides = [
  {
    icon: Search,
    title: '1. Carregue a base de empresas',
    body: 'Na Visão geral, selecione as UFs e inicie uma busca. A primeira execução baixa os arquivos nacionais da Receita Federal e pode levar tempo.',
    page: 'overview',
    action: 'Abrir busca',
  },
  {
    icon: Building2,
    title: '2. Explore as empresas',
    body: 'Pesquise por empresa, CNPJ, CNAE ou município e filtre por UF. Os resultados exibem dados cadastrais empresariais da base.',
    page: 'companies',
    action: 'Abrir empresas',
  },
  {
    icon: Users,
    title: '3. Organize seus leads',
    body: 'Atualize a etapa comercial dos leads. As mudanças ficam salvas na base e alimentam os indicadores e relatórios.',
    page: 'leads',
    action: 'Abrir leads',
  },
  {
    icon: Megaphone,
    title: '4. Acompanhe campanhas',
    body: 'Crie campanhas, adicione empresas ativas e registre o progresso manualmente. O sistema não envia mensagens nem coleta contatos pessoais.',
    page: 'campaigns',
    action: 'Abrir campanhas',
  },
  {
    icon: Settings2,
    title: '5. Configure atualizações',
    body: 'O agendamento é opcional e desativado por padrão. Escolha frequência e UFs; a API deve estar em execução no horário previsto.',
    page: 'settings',
    action: 'Abrir configurações',
  },
  {
    icon: BookOpen,
    title: 'Banco e segurança',
    body: 'O schema SQL é revisado e aplicado manualmente. A busca depende de acesso HTTPS aos Dados Abertos do CNPJ. Veja os requisitos e limitações no README do projeto.',
    page: null,
    action: null,
  },
];

export default function HelpPage({ onNavigate }) {
  return (
    <ModulePage>
      <HelpGrid>
        {guides.map(({ icon: Icon, title, body, page, action }) => (
          <HelpCard key={title}>
            <Icon size={19} aria-hidden="true" />
            <h2>{title}</h2>
            <p>{body}</p>
            {page && <button type="button" onClick={() => onNavigate(page)}>{action}</button>}
          </HelpCard>
        ))}
      </HelpGrid>
    </ModulePage>
  );
}
