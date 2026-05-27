# Controle de Tarefas - FESF SUS

Projeto Full Stack simples para cadastro de tarefas, desenvolvido com FastAPI no backend e React no frontend.

## Funcionalidades

- Criar tarefa
- Listar tarefas
- Editar tarefa
- Marcar tarefa como concluida
- Excluir tarefa
- Persistir dados em SQLite

## Tecnologias

- Python
- FastAPI
- SQLite
- React
- Vite
- Docker
- Docker Compose

## Como executar com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Depois acesse:

```text
Frontend: http://localhost:3000
Backend: http://localhost:8000
Documentacao da API: http://localhost:8000/docs
```

## Como executar sem Docker

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

## Rotas principais da API

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/health` | Verifica se a API esta online |
| GET | `/tasks` | Lista todas as tarefas |
| POST | `/tasks` | Cria uma nova tarefa |
| GET | `/tasks/{task_id}` | Busca uma tarefa pelo ID |
| PUT | `/tasks/{task_id}` | Atualiza uma tarefa |
| DELETE | `/tasks/{task_id}` | Exclui uma tarefa |

## Estrutura do projeto

```text
backend/
  app/
    main.py
  Dockerfile
  requirements.txt
frontend/
  src/
    App.jsx
    main.jsx
    styles.css
  Dockerfile
  nginx.conf
docker-compose.yml
README.md
```

## Observacao

O projeto foi mantido propositalmente simples para facilitar a execucao, a avaliacao e a explicacao tecnica:

- o backend concentra as regras da API;
- o frontend consome a API com `fetch`;
- o SQLite salva os dados em arquivo;
- o Docker Compose sobe backend e frontend juntos.
