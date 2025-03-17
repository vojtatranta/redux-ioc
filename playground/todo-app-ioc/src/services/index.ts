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
  fetch: ({ store }) => {
    // Simulate API call
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
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

let nextTodoId = 0;
// Define our services using the factory
const managerFactory = typedManagerFactory({
  // Todo service implementation

  getTodos: deps => () => deps.store.getState().todos,

  addTodo: deps => (text: string) => {
    deps.store.dispatch(addTodoAction({ id: nextTodoId++, text }));
  },

  toggleTodo: deps => (id: number) => {
    deps.store.dispatch(toggleTodoAction({ id }));
  },

  deleteTodo: deps => (id: number) => {
    deps.store.dispatch(deleteTodoAction({ id }));
  },

  addTodoAsync: deps => (text: string) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        deps.store.dispatch(addTodoAction({ id: nextTodoId++, text }));
        resolve();
      }, 1000);
    });
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
