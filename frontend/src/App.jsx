import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const emptyForm = {
  title: "",
  description: "",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  async function loadTasks() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar as tarefas.");
      }

      const data = await response.json();
      setTasks(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function startEditing(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
    });
  }

  function clearForm() {
    setEditingTask(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = form.title.trim();

    if (trimmedTitle.length < 3) {
      setMessage("Informe um titulo com pelo menos 3 caracteres.");
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: form.description.trim(),
    };

    const url = editingTask ? `${API_URL}/tasks/${editingTask.id}` : `${API_URL}/tasks`;
    const method = editingTask ? "PUT" : "POST";
    const body = editingTask
      ? { ...payload, completed: editingTask.completed }
      : payload;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel salvar a tarefa.");
      }

      clearForm();
      await loadTasks();
      setMessage(editingTask ? "Tarefa atualizada." : "Tarefa criada.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel alterar o status.");
      }

      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel excluir a tarefa.");
      }

      if (editingTask?.id === taskId) {
        clearForm();
      }

      await loadTasks();
      setMessage("Tarefa excluida.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="summary-panel" aria-label="Resumo das tarefas">
          <div className="brand-row">
            <div className="brand-mark" aria-hidden="true">
              ✓
            </div>
            <div>
              <p className="eyebrow">FESF SUS</p>
              <h1>Controle de tarefas</h1>
            </div>
          </div>

          <div className="metric-grid">
            <div>
              <span>Total</span>
              <strong>{tasks.length}</strong>
            </div>
            <div>
              <span>Concluidas</span>
              <strong>{completedCount}</strong>
            </div>
            <div>
              <span>Pendentes</span>
              <strong>{tasks.length - completedCount}</strong>
            </div>
          </div>
        </aside>

        <section className="task-panel" aria-label="Cadastro e lista de tarefas">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div>
                <p className="eyebrow">{editingTask ? "Editando" : "Nova tarefa"}</p>
                <h2>{editingTask ? "Atualizar tarefa" : "Cadastrar tarefa"}</h2>
              </div>
              {editingTask && (
                <button className="ghost-button" type="button" onClick={clearForm}>
                  Cancelar
                </button>
              )}
            </div>

            <label>
              Titulo
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex.: Revisar documentos"
                maxLength={120}
              />
            </label>

            <label>
              Descricao
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Detalhe opcional da tarefa"
                maxLength={500}
              />
            </label>

            <button className="primary-button" type="submit">
              {editingTask ? "Salvar alteracoes" : "Adicionar tarefa"}
            </button>
          </form>

          {message && <p className="status-message">{message}</p>}

          <div className="task-list-header">
            <h2>Tarefas cadastradas</h2>
            <button className="ghost-button" type="button" onClick={loadTasks}>
              Atualizar
            </button>
          </div>

          {isLoading ? (
            <p className="empty-state">Carregando tarefas...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">Nenhuma tarefa cadastrada.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li className={task.completed ? "task-item completed" : "task-item"} key={task.id}>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                    <span>{task.completed ? "Concluida" : "Pendente"}</span>
                  </label>

                  <div className="task-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>

                  <div className="task-actions">
                    <button type="button" onClick={() => startEditing(task)}>
                      Editar
                    </button>
                    <button className="danger-button" type="button" onClick={() => deleteTask(task.id)}>
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
