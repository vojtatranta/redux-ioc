import { createTypedFactory } from '../../../../src/ts-ioc';
import {
  Todo,
  TodoState,
  VisibilityFilter,
  TodoService,
  FilterService,
  StoreService,
} from '../types';

// Import the action creators from our slices
import {
  addTodo as addTodoAction,
  toggleTodo as toggleTodoAction,
  deleteTodo as deleteTodoAction,
} from '../reducers/todos';
import { setVisibilityFilter as setVisibilityFilterAction } from '../reducers/visibilityFilter';
import store from '../store';
import { InferInterface } from '../../../../src/ts-ioc';
import { useManager } from '../components/ServiceContext';
import { useSelector } from 'react-redux';
import { useMemo, useState } from 'react';

// Define our dependencies

type FetchService = {
  fetch: () => void;
};

type StoreDependency = { store: () => StoreService };

// Create a typed factory with our dependencies

const storeServicTypedFactory = createTypedFactory();
const storeServiceFactory = storeServicTypedFactory({
  store: () => store,
});

const fetchServiceTypedFactory = createTypedFactory<StoreDependency>();
const fetchServiceFactory = fetchServiceTypedFactory({
  fetch:
    ({ store }) =>
    (nextName: string) => {
      // Simulate API call
      return new Promise<string>(resolve => {
        setTimeout(() => {
          resolve(String(Math.random()) + nextName);
        }, 4000);
      });
    },
});

const storeService = storeServiceFactory({});
const fetchService = fetchServiceFactory({ store });

const services = {
  ...storeService,
  ...fetchService,
};

export type Services = typeof services;

export type ServiceInterfaceFactory = InferInterface<typeof services>;

const typedManagerFactory = createTypedFactory<ServiceInterfaceFactory>();

// Define our services using the factory
const managerFactory = typedManagerFactory({
  // Todo service implementation

  getTodos: deps => () => deps.store.getState().todos,

  addTodo: deps => (text: string) => {
    deps.store.dispatch(addTodoAction({ id: String(Math.random()), text }));
  },

  toggleTodo: deps => (id: string) => {
    deps.store.dispatch(toggleTodoAction({ id }));
  },

  deleteTodo: deps => (id: string) => {
    deps.store.dispatch(deleteTodoAction({ id }));
  },

  addTodoAsync: deps => async (text: string) => {
    const nextId = await deps.fetch(text);
    deps.store.dispatch(addTodoAction({ id: nextId, text }));
  },

  // Filter service impleme
  getVisibilityFilter: deps => () => deps.store.getState().visibilityFilter,

  setVisibilityFilter: deps => (filter: VisibilityFilter) => {
    deps.store.dispatch(setVisibilityFilterAction({ filter }));
  },
});

const manager = managerFactory(services);

export type ManagerInterface = typeof manager;

export { manager };
export { services };

export function useOptimisticAddTodoMutation(): {
  addTodoOptimistic: (todo: Pick<Todo, 'text' | 'completed'>) => Promise<void>;
  todos: Todo[];
  loading: boolean;
} {
  const manager = useManager();
  const todos = useSelector((state: TodoState) => state.todos);

  const [optimisticTodo, setOptimisticTodo] = useState<Todo | null>(null);

  return {
    addTodoOptimistic: async (todo: Pick<Todo, 'text' | 'completed'>) => {
      setOptimisticTodo({ id: String(Math.random()), text: todo.text, completed: false });
      try {
        await manager.addTodoAsync(todo.text);
      } finally {
        setOptimisticTodo(null);
      }
    },

    todos: useMemo(
      () => (optimisticTodo ? [...todos, optimisticTodo] : todos),
      [todos, optimisticTodo]
    ),
    loading: optimisticTodo !== null,
  };
}
