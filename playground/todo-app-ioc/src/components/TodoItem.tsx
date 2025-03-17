import React from 'react';
import { Todo, TodoState } from '../types';
import { useSelector } from 'react-redux';
import { useManager } from './ServiceContext';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const manager = useManager();

  return (
    <li className="todo-item">
      <span
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          cursor: 'pointer',
          marginRight: '10px',
        }}
        onClick={() => manager.toggleTodo(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => manager.deleteTodo(todo.id)} className="delete-button">
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
