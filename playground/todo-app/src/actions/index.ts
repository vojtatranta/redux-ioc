import { VisibilityFilter } from '../types';
import {
  addTodo as addTodoAction,
  toggleTodo as toggleTodoAction,
  deleteTodo as deleteTodoAction,
} from '../reducers/todos';
import { setVisibilityFilter as setVisibilityFilterAction } from '../reducers/visibilityFilter';
import { AppDispatch } from '../store';

// Action creators
let nextTodoId = 0;

// Re-export the action creators from the slices
export const addTodo = (text: string) => {
  return addTodoAction({ id: nextTodoId++, text });
};

export const toggleTodo = (id: number) => {
  return toggleTodoAction({ id });
};

export const deleteTodo = (id: number) => {
  return deleteTodoAction({ id });
};

export const setVisibilityFilter = (filter: VisibilityFilter) => {
  return setVisibilityFilterAction({ filter });
};

// Async action using redux-thunk (now built into Redux Toolkit)
export const addTodoAsync = (text: string) => {
  return (dispatch: AppDispatch) => {
    // Simulate API call
    return new Promise<void>(resolve => {
      setTimeout(() => {
        dispatch(addTodo(text));
        resolve();
      }, 1000);
    });
  };
};
