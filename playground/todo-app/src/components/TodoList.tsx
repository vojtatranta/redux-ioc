import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoItem from './TodoItem';
import { Todo, VisibilityFilter } from '../types';
import { toggleTodo, deleteTodo } from '../actions';
import { RootState } from '../reducers';
import { AppDispatch } from '../store';

const getVisibleTodos = (todos: Todo[], filter: VisibilityFilter): Todo[] => {
  switch (filter) {
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

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use useSelector to get data from the store
  const todos = useSelector((state: RootState) => {
    return getVisibleTodos(state.todos, state.visibilityFilter);
  });
  
  // Create handler functions that dispatch actions
  const handleToggleTodo = (id: number) => {
    dispatch(toggleTodo(id));
  };
  
  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };

  if (todos.length === 0) {
    return <p>No todos yet! Add some tasks to get started.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleTodo={handleToggleTodo} 
          deleteTodo={handleDeleteTodo} 
        />
      ))}
    </ul>
  );
};

export default TodoList;
