import React from 'react';
import TodoItem from './TodoItem';
import { Todo, TodoState, VisibilityFilter } from '../types';
import { useSelector } from 'react-redux';

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  // Get data from services
  const visibilityFilter = useSelector((state: TodoState) => state.visibilityFilter);

  // Filter todos based on the current visibility filter
  const getVisibleTodos = () => {
    switch (visibilityFilter) {
      case VisibilityFilter.SHOW_ALL:
        return todos;
      case VisibilityFilter.SHOW_COMPLETED:
        return todos.filter(todo => todo.completed);
      case VisibilityFilter.SHOW_ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  };

  const visibleTodos = getVisibleTodos();

  if (visibleTodos.length === 0) {
    return <p>No todos yet! Add some tasks to get started.</p>;
  }

  return (
    <ul className="todo-list">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
