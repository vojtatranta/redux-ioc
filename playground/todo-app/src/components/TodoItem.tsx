import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo }) => {
  return (
    <li className="todo-item">
      <span
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          cursor: 'pointer',
          marginRight: '10px',
        }}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => deleteTodo(todo.id)} className="delete-button">
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
