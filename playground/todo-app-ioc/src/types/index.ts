// Define Todo item type
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export enum VisibilityFilter {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
}

// State interfaces
export interface TodoState {
  todos: Todo[];
  visibilityFilter: VisibilityFilter;
}

// Redux Toolkit uses PayloadAction type internally
// We don't need to define our own action types anymore

// Service interfaces for IoC
export interface TodoService {
  getTodos: () => Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  addTodoAsync: (text: string) => Promise<void>;
}

export interface FilterService {
  getVisibilityFilter: () => VisibilityFilter;
  setVisibilityFilter: (filter: VisibilityFilter) => void;
}

export interface StoreService {
  getState: () => TodoState;
  subscribe: (listener: () => void) => () => void;
  dispatch: (action: unknown) => void;
}
