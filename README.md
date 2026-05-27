# Controle de Tarefas - FESF SUS

Aplicação Full Stack para cadastro e gerenciamento de tarefas, desenvolvida com **FastAPI** no backend e **React** no frontend.

O projeto implementa uma API REST funcional, uma interface web integrada à API e configuração completa de execução com Docker e Docker Compose.

## Objetivo

O objetivo da aplicação é permitir o controle simples de tarefas por meio de uma interface web, com operações de criação, listagem, edição, conclusão e exclusão.

A aplicação foi organizada em dois módulos principais:

- `backend`: API REST desenvolvida com Python e FastAPI;
- `frontend`: interface web desenvolvida com React e Vite.

## Funcionalidades

- Cadastro de novas tarefas;
- Listagem de tarefas cadastradas;
- Edição de título e descrição;
- Marcação de tarefa como concluída ou pendente;
- Exclusão de tarefas;
- Persistência dos dados em SQLite;
- Comunicação entre frontend e backend via HTTP/JSON;
- Execução integrada com Docker Compose.

## Tecnologias Utilizadas

### Backend

- Python
- FastAPI
- Uvicorn
- SQLite
- Pydantic

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Infraestrutura

- Docker
- Docker Compose
- Nginx

## Arquitetura da Aplicação

```text
Usuário
  |
  v
Frontend React
  |
  | requisições HTTP/JSON
  v
Backend FastAPI
  |
  v
Banco SQLite
```

O frontend é responsável pela interação com o usuário e consome os endpoints da API usando `fetch`.

O backend concentra as regras da API, valida os dados recebidos e realiza as operações no banco SQLite.

## Como Executar com Docker

Pré-requisitos:

- Docker instalado;
- Docker Compose disponível.

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Após a inicialização dos containers, acesse:

```text
Frontend: http://localhost:3000
Backend: http://localhost:8000
Documentação da API: http://localhost:8000/docs
```

Para parar a aplicação:

```bash
docker compose down
```

## Como Executar sem Docker

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Inicie a API:

```bash
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://localhost:8000
```

### Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Verifica se a API está em execução |
| GET | `/tasks` | Lista todas as tarefas |
| POST | `/tasks` | Cria uma nova tarefa |
| GET | `/tasks/{task_id}` | Busca uma tarefa pelo ID |
| PUT | `/tasks/{task_id}` | Atualiza uma tarefa |
| DELETE | `/tasks/{task_id}` | Remove uma tarefa |

## Exemplos de Requisição

### Criar tarefa

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Revisar documentação\",\"description\":\"Conferir README e instruções de execução\"}"
```

### Listar tarefas

```bash
curl http://localhost:8000/tasks
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Revisar documentação\",\"description\":\"README revisado\",\"completed\":true}"
```

### Excluir tarefa

```bash
curl -X DELETE http://localhost:8000/tasks/1
```

## Modelo de Dados

Cada tarefa possui os seguintes campos:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | integer | Identificador único da tarefa |
| `title` | string | Título da tarefa |
| `description` | string | Descrição opcional |
| `completed` | boolean | Indica se a tarefa foi concluída |

Exemplo de resposta:

```json
{
  "id": 1,
  "title": "Revisar documentação",
  "description": "Conferir README e instruções de execução",
  "completed": false
}
```

## Estrutura do Projeto

```text
backend/
  app/
    main.py
  .dockerignore
  Dockerfile
  README.md
  requirements.txt

frontend/
  src/
    App.jsx
    main.jsx
    styles.css
  .dockerignore
  Dockerfile
  index.html
  nginx.conf
  package.json
  package-lock.json

docker-compose.yml
README.md
```

## Configuração dos Containers

O `docker-compose.yml` define dois serviços:

| Serviço | Descrição | Porta |
| --- | --- | --- |
| `backend` | API FastAPI | `8000` |
| `frontend` | Aplicação React servida pelo Nginx | `3000` |

O backend utiliza um volume Docker chamado `backend-data` para manter o arquivo SQLite persistente entre reinicializações dos containers.

## Validação

O projeto pode ser validado pelos seguintes acessos após a execução com Docker:

- `http://localhost:3000`: interface web;
- `http://localhost:8000/health`: verificação da API;
- `http://localhost:8000/docs`: documentação interativa gerada pelo FastAPI.

Também é possível testar o fluxo completo pela interface:

1. Criar uma tarefa;
2. Editar a tarefa criada;
3. Marcar como concluída;
4. Excluir a tarefa.
