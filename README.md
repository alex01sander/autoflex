# Autoflex

Aplicação simples para cadastro de produtos, matérias-primas, composição (ficha técnica) e análise de produção.

## Stack
- Frontend: React + Vite + Redux Toolkit + Tailwind
- Backend: Node.js (Express) + Prisma + PostgreSQL
- Testes E2E: Cypress

## Requisitos
- Node.js 20+
- npm
- Docker (opcional, para banco PostgreSQL)

## Configuração
### Banco de dados (PostgreSQL)
- Com Docker (recomendado):
  - Entre em `backend/` e rode:
    - `docker-compose up -d`
- Sem Docker: use um PostgreSQL local e ajuste a conexão.

### Backend
1) Entre em `backend/`
2) Crie `.env` com:
   - `DATABASE_URL=postgresql://autoflex:autoflex@localhost:5432/autoflex_db`
   - `PORT=3000`
3) Instale deps: `npm install`
4) Gere/atualize Prisma:
   - `npx prisma generate`
   - `npx prisma db push`
5) Rode: `npm run dev` (API em `http://localhost:3000`)

### Frontend
1) Entre em `frontend/`
2) Instale deps: `npm install`
3) Rode: `npm run dev` (UI em `http://localhost:5175`)

## Testes E2E (Cypress)
- Base URL: `http://localhost:5175`
- Com UI: `npm run cy:open`
- Headless: `npm run cy:run`

## Scripts úteis
- Frontend: `npm run dev`, `npm run build`, `npm run lint`
- Backend: `npm run dev`, `npm run build`, `npm start`

## Endpoints principais (backend)
- Produtos: `/products`
- Matérias-primas: `/raw-materials`
- Ficha técnica: `/product-materials`
- Sugestões de produção: `/production-suggestions`

## Estrutura
- `frontend/`: aplicação web
- `backend/`: API + Prisma
