from pathlib import Path
import os
import sqlite3
from typing import Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


DATABASE_PATH = Path(os.getenv("DATABASE_PATH", "tasks.db"))

app = FastAPI(title="API de Tarefas FESF SUS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: Optional[str] = Field(default="", max_length=500)


class TaskUpdate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: Optional[str] = Field(default="", max_length=500)
    completed: bool


class Task(BaseModel):
    id: int
    title: str
    description: str
    completed: bool


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_table() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                completed INTEGER NOT NULL DEFAULT 0
            )
            """
        )


def row_to_task(row: sqlite3.Row) -> Task:
    return Task(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        completed=bool(row["completed"]),
    )


@app.on_event("startup")
def startup() -> None:
    create_table()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/tasks", response_model=list[Task])
def list_tasks() -> list[Task]:
    with get_connection() as connection:
        rows = connection.execute("SELECT * FROM tasks ORDER BY id DESC").fetchall()
    return [row_to_task(row) for row in rows]


@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate) -> Task:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO tasks (title, description) VALUES (?, ?)",
            (payload.title, payload.description or ""),
        )
        task_id = cursor.lastrowid
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    return row_to_task(row)


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int) -> Task:
    with get_connection() as connection:
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa nao encontrada")

    return row_to_task(row)


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate) -> Task:
    with get_connection() as connection:
        existing = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

        if existing is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa nao encontrada")

        connection.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, completed = ?
            WHERE id = ?
            """,
            (payload.title, payload.description or "", int(payload.completed), task_id),
        )
        row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()

    return row_to_task(row)


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int) -> None:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa nao encontrada")
