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

// With Redux Toolkit, we don't need to define action types and interfaces manually
// Redux Toolkit handles the action creation and type safety for us
