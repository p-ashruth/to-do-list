/* Features the raw idea and implementation of code */

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
      return prevTodos.filter((prevTodo) => prevTodo.id != id);
    });
  };

  const upperCaseAll = () => {
    const newArr = todos.map((todos) => {
      return {
        ...todos,
        task: todos.task.toUpperCase(),
      };
    });
    setTodos(newArr);
  };
  
  const upperCase = (id: string) => {
    const newArr = todos.map((todos) => {
      if(todos.id == id){
        return {
          ...todos,
          task: todos.task.toUpperCase()
        };
      } else {
        return todos;
      }
    });
    setTodos(newArr);
  }
  
  const markDone = (id: string) => {
    const newArr = todos.map((todos) => {
      if(todos.id == id){
        return {
          ...todos,
          isDone: true
        };
      } else {
        return todos;
      }
    });
    setTodos(newArr);
    console.log(newArr);
  }

  return (
    <div>
      <div>
        <input
          placeholder="Enter Task"
          value={newTodo}
          onChange={updateTodoValue}
        />
        <button onClick={addNewTask}>Add Task</button>
      </div>

      <div>
        <h1> My Tasks </h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span> {todo.task} </span>
              <button onClick={() => deleteTask(todo.id)}> Delete </button>
              <button onClick={() => upperCase(todo.id)}> Uppercase </button>
              <button onClick={() => markDone(todo.id)}> Mark as Done </button>
            </li>
          ))}
        </ul>
        <br></br>
        <button onClick={upperCaseAll}> UpperCase All </button>
      </div>
    </div>
  );
}

export { TodoList };
