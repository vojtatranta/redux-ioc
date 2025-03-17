# ts-ioc

**A proof of concept repository showing how to make Redux better with a proper dependency management**

**Warning: The API will change drastically in the future**

Full playground example is located here: [todo-app-ioc](./playground/todo-app-ioc/)

For comparison, how would a standard thunk-based redux app look, check out [todo-app](./playground/todo-app/)

A lightweight, type-safe IoC (Inversion of Control) container for TypeScript.

## Features

- **Lightweight**: Zero dependencies, minimal footprint
- **Type-Safe**: Fully leverages TypeScript's type system for compile-time safety
- **Flexible**: Works with any TypeScript project
- **Simple API**: Easy to learn and use
- **Framework Agnostic**: Use with React, Vue, Angular, or any other framework

## Installation

```bash
npm install ts-ioc
```

## Basic Usage

```typescript
import { createTypedFactory, InferInterface } from 'ts-ioc';

// Create base services
const loggerServiceFac = createTypedFactory();
const loggerService = loggerServiceFac({
  log: () => (message: string) => console.log(`[LOG]: ${message}`),
  error: () => (message: string) => console.error(`[ERROR]: ${message}`),
});

// Create a service that depends on the logger
const userServiceFac = createTypedFactory<InferInterface<typeof loggerService>>();
const userService = userServiceFac({
  fetchUser:
    ({ log, error }) =>
    async (userId: string) => {
      log(`Fetching user with ID: ${userId}`);
      try {
        // Fetch user logic here
        return { id: userId, name: 'John Doe' };
      } catch (err) {
        error(`Failed to fetch user: ${err}`);
        throw err;
      }
    },
});

// Create an implementation
const implementation = userService({
  log: message => console.log(`[CUSTOM LOG]: ${message}`),
  error: message => console.error(`[CUSTOM ERROR]: ${message}`),
});

// Use the implementation
implementation.fetchUser('123').then(user => console.log(user));
```

## Advanced Usage with Redux

```typescript
import { createTypedFactory, InferInterface } from 'ts-ioc';
import { createStore } from 'redux';

// Create a Redux store
const store = createStore(rootReducer, initialState);

// Create a store service
const storeServiceFac = createTypedFactory();
const storeService = storeServiceFac({
  store: () => store,
});

// Create a user service that depends on the store
const userServiceFac = createTypedFactory<InferInterface<typeof storeService>>();
const userService = userServiceFac({
  getCurrentUser:
    ({ store }) =>
    () => {
      const state = store.getState();
      return state.auth.currentUser;
    },

  updateUser:
    ({ store }) =>
    updates => {
      store.dispatch({ type: 'UPDATE_USER', payload: updates });
    },
});

// Create an implementation
const implementation = userService({
  store: store,
});

// Use the implementation
const currentUser = implementation.getCurrentUser();
implementation.updateUser({ name: 'Jane Doe' });
```

## API Reference

### `createTypedFactory<Deps>()`

Creates a factory function that can be used to define services with dependencies.

**Parameters:**

- `Deps`: (Optional) Type parameter for dependencies

**Returns:**
A factory function that accepts a configuration object and returns a service factory.

### `InferInterface<T>`

A utility type that extracts the interface from a factory created with `createTypedFactory`.

**Parameters:**

- `T`: A factory created with `createTypedFactory`

**Returns:**
The inferred interface type of the factory.

## License

MIT
