import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.scss";

type Todo = { id: string; task: string; isDone: boolean };

const STORAGE_KEYS = {
  tasks: "todoTasks",
} as const;

const toggleTaskCase = (task: string) =>
  task === task.toUpperCase() ? task.toLowerCase() : task.toUpperCase();

const loadTodos = (): Todo[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.tasks);
    return saved ? (JSON.parse(saved) as Todo[]) : [];
  } catch {
    return [];
  }
};

const saveTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(todos));
  } catch {
    console.log("Could not save to localStorage.");
  }
};

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const pendingEditActionRef = useRef<"save" | "cancel" | null>(null);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const updateTodoValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const addNewTask = () => {
    if (newTodo.trim().length > 0) {
      console.log("a new task was added in todo");
      setTodos((prevTodos) => {
        return [...prevTodos, { id: uuidv4(), task: newTodo, isDone: false }];
      });
    }
    setNewTodo("");
  };

  const deleteTask = (id: string) => {
    console.log(`Deleting the task with ID ${id}`);
    setTodos((prevTodos) => {
      return prevTodos.filter((prevTodo) => prevTodo.id !== id);
    });
  };

  const clearCompletedTasks = () => {
    setTodos(todos.filter((todo) => !todo.isDone));
  };

  const toggleCaseAll = () => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return { ...todo, task: toggleTaskCase(todo.task) };
      });
    });
  };

  const toggleCase = (id: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, task: toggleTaskCase(todo.task) };
        }
        return todo;
      });
    });
  };

  const resetApp = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.tasks);
    } catch {
      console.log("Could not clear localStorage.");
    }
    setTodos([]);
    setNewTodo("");
  };

  const markDone = (id: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      });
    });
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.task);
  };

  const saveEdit = () => {
    if (editingId !== null && editValue.trim()) {
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === editingId) {
            return { ...todo, task: editValue.trim() };
          }
          return todo;
        });
      });
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleEditBlur = () => {
    const action = pendingEditActionRef.current;
    pendingEditActionRef.current = null;
    if (action === "cancel") {
      cancelEdit();
    } else {
      saveEdit();
    }
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      pendingEditActionRef.current = "save";
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      pendingEditActionRef.current = "cancel";
      event.currentTarget.blur();
    }
  };

  const completedCount = todos.filter((t) => t.isDone).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Tasks</h1>
        <p>Stay organized and productive</p>
      </div>

      <div className={styles["input-section"]}>
        <input
          type="text"
          className={styles["task-input"]}
          placeholder="Add a New Task"
          maxLength={200}
          value={newTodo}
          onChange={updateTodoValue}
        />
        <button className={styles["add-btn"]} onClick={addNewTask}>Add Task</button>
      </div>

      <div className={styles.stats}>
        <span>Total: <span>{todos.length}</span></span>
        <span>Completed: <span>{completedCount}</span></span>
        <span>Remaining: <span>{todos.length - completedCount}</span></span>
      </div>

      <div className={styles["todo-list"]}>
        {todos.length === 0 ? (
          <div className={styles["empty-state"]}>
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`${styles["todo-item"]} ${todo.isDone ? styles.completed : ""}`}
            >
              <div
                className={`${styles["todo-checkbox"]} ${todo.isDone ? styles.checked : ""}`}
                onClick={() => markDone(todo.id)}
              />
              {editingId === todo.id ? (
                <input
                  type="text"
                  className={`${styles["todo-text"]} ${styles.editing}`}
                  value={editValue}
                  maxLength={200}
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleEditBlur}
                  onKeyDown={handleEditKeyDown}
                />
              ) : (
                <div
                  className={`${styles["todo-text"]} ${todo.isDone ? styles.completed : ""}`}
                  onClick={() => startEdit(todo)}
                >
                  {todo.task}
                </div>
              )}
              <div className={styles["todo-actions"]}>
                <button
                  className={styles["edit-btn"]}
                  onClick={() => startEdit(todo)}
                >
                  ✏️
                </button>
                <button
                  className={styles["edit-btn"]}
                  onClick={() => toggleCase(todo.id)}
                >
                  Aa
                </button>
                <button
                  className={styles["delete-btn"]}
                  onClick={() => deleteTask(todo.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.clearCompletedBtn} onClick={clearCompletedTasks}>Clear Completed</button>
        <button className={styles.toggleCaseBtn} onClick={toggleCaseAll}>Toggle Case All</button>
        <button className={styles.resetBtn} onClick={resetApp}>Reset App</button>
      </div>
    </div>
  );
}

export { TodoList };
