# Superheroes API - UGB

Projeto com API Node.js/Express, banco SQLite e interface React + Tailwind CSS.

## Estrutura
- `superheroes-api`: backend e endpoints REST.
- `superheroes-frontend`: interface gráfica React com Tailwind CSS.

## Como executar
Abra dois terminais no VS Code.

### Terminal 1 - API
```bash
cd superheroes-api
npm install
npm run dev
```
API: http://localhost:3000

### Terminal 2 - Interface
```bash
cd superheroes-frontend
npm install
npm run dev
```
Abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

## Endpoints
### Heróis
- GET `/heroes` - lista todos.
- GET `/heroes/:id` - consulta por ID.
- POST `/heroes` - cadastra `{ "name": "...", "universe": "...", "power": "..." }`.
- PUT `/heroes/:id` - substitui os três campos.
- PATCH `/heroes/:id` - atualiza somente os campos enviados.
- DELETE `/heroes/:id` - exclui.
- GET `/heroes/:id/movies` - lista filmes associados.
- POST `/heroes/:id/movies/:movieId` - associa filme.
- DELETE `/heroes/:id/movies/:movieId` - remove associação.

### Filmes
- GET `/movies` - lista todos.
- GET `/movies/:id` - consulta por ID.
- POST `/movies` - cadastra `{ "title": "...", "year": 2020 }`.
- PUT `/movies/:id` - substitui título e ano.
- PATCH `/movies/:id` - atualiza somente os campos enviados.
- DELETE `/movies/:id` - exclui.

## Observação
O Vite encaminha chamadas iniciadas por `/api` para `http://localhost:3000`, removendo o prefixo `/api`.
