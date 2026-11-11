# LeadEngine

Base inicial do LeadEngine: dashboard de prospecção, API local de demonstração e schema Prisma para SQLite.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Desenvolvimento

Na raiz do projeto:

```powershell
npm install
npm run dev
```

O Vite disponibiliza a interface em `http://localhost:5173` e encaminha chamadas `/api` para o Express em `http://localhost:3001`.

Os dados exibidos nesta etapa são demonstrativos e não representam empresas reais. A API ainda não consulta o banco nem fontes externas.

## Banco de dados

O schema Prisma está em `server/prisma/schema.prisma`. As variáveis para um arquivo SQLite local estão documentadas em `server/.env.example`.

Nenhuma migração, criação de banco ou alteração de dados é executada automaticamente. Depois de revisar o schema, configure `DATABASE_URL`, gere o Prisma Client e aplique manualmente as instruções SQL aprovadas.
