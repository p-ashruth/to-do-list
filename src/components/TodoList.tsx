import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.scss";

function TodoList() {
  const [todos, setTodos] = useState<{ id: string; task: string; isDone: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");

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

  const clearAllTasks = () => {
    setTodos([]);
  };

  const resetApp = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Tasks</h1>
        <p>Stay organized and productive</p>
      </div>

      <div className={styles.inputSection}>
        <input
          type="text"
          className={styles.taskInput}
          placeholder="Add a new task..."
          maxLength={200}
          value={newTodo}
          onChange={updateTodoValue}
        />
        <button className={styles.addBtn} onClick={addNewTask}>Add Task</button>
      </div>

      <div className={styles.stats}>
        <span>Total: <span id="total-tasks">{todos.length}</span></span>
        <span>Completed: <span id="completed-tasks">{todos.filter((t) => t.isDone).length}</span></span>
        <span>Remaining: <span id="remaining-tasks">{todos.filter((t) => !t.isDone).length}</span></span>
      </div>

      <div className={styles.todoList} id="todo-list">
        {todos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className={`${styles.todoItem} ${todo.isDone ? styles.completed : ""}`}>
                <div className={`${styles.todoCheckbox} ${todo.isDone ? styles.checked : ""}`} onClick={() => markDone(todo.id)} />
                <span className={`${styles.todoText} ${todo.isDone ? styles.completed : ""}`}>{todo.task}</span>
                <div className={styles.todoActions}>
                  <button className={styles.deleteBtn} onClick={() => deleteTask(todo.id)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.controls}>
        <button onClick={clearCompletedTasks}>Clear Completed</button>
        <button onClick={clearAllTasks}>Clear All</button>
        <button onClick={resetApp}>Reset App</button>
      </div>
    </div>
  );
}

export { TodoList };
