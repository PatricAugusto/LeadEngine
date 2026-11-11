# LeadEngine

Dashboard e busca de prospecção de empresas ativas por UF, usando os Dados Abertos do CNPJ da Receita Federal.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Desenvolvimento

Na raiz do projeto:

```powershell
npm install
if (!(Test-Path server\.env)) { Copy-Item server\.env.example server\.env }
npm run db:generate --workspace server
```

Revise `server/prisma/manual-schema.sql` e aplique o SQL manualmente ao SQLite configurado em `server/.env`. Se preferir usar o comando Prisma, ele executa o mesmo arquivo revisável:

```powershell
npm run db:sql --workspace server
```

Depois inicie o sistema:

```powershell
npm run dev
```

O Vite disponibiliza a interface em `http://localhost:5173` e encaminha chamadas `/api` para o Express em `http://localhost:3001`.

## Busca de empresas

- Selecione uma ou mais UFs e inicie a busca no painel. O filtro inclui estabelecimentos com situação cadastral ativa e retorna razão social, nome fantasia, CNAE principal, município, porte e data de abertura.
- Todas as UFs começam selecionadas; reduza a seleção para limitar quais empresas entram na base.
- A tabela consulta a base local com busca por razão social, nome fantasia, CNAE, município, UF ou CNPJ e paginação.
- A primeira execução baixa 22 arquivos nacionais de estabelecimentos, empresas e tabelas de referência publicados em [Dados Abertos do CNPJ](https://dadosabertos.rfb.gov.br/CNPJ/). A Receita publica arquivos em lote, não uma consulta isolada por estado; portanto, mesmo uma UF requer baixar os arquivos nacionais. Cada busca percorre os arquivos de estabelecimentos para aplicar o filtro por UF. Planeje espaço em disco, rede, tempo de processamento e frequência do agendamento.
- Os arquivos e o índice auxiliar ficam em `server/data/` e são ignorados pelo Git. O índice de empresas é reutilizado; arquivos antigos são removidos depois que a nova versão é preparada.
- O agendamento é opt-in, desativado por padrão. Pode ser semanal ou mensal às 03:00 no fuso de Brasília. O servidor não inicia uma busca automaticamente ao subir; uma execução agendada só ocorre quando habilitada no painel.
- A base guarda dados cadastrais empresariais. Não coletamos contatos pessoais, e-mails ou telefones nesta etapa. A pontuação inicial é zero e não representa uma avaliação automática de potencial.

## Banco de dados

O schema Prisma está em `server/prisma/schema.prisma`. Nenhuma migration é executada automaticamente. Revise e aplique o SQL manual antes de iniciar uma busca; a API informa quando o banco ainda não está preparado.

Para validar o schema sem criar tabelas:

```powershell
$env:DATABASE_URL='file:./dev.db'
npm exec --workspace server -- prisma validate --schema prisma\schema.prisma
```

Testes do importador:

```powershell
npm test --workspace server
```
