import { describe, it, expect } from 'vitest';
import { assert } from 'chai';
import { createTypedFactory, InferInterface } from '../ts-ioc';
import { createMockStore, initialState, actionCreators, type User } from './mocks/redux-store.mock';

describe('ts-ioc', () => {
  describe('createDefined', () => {
    it('should create a dependency-less factory', () => {
      const dependencyLessFac = createTypedFactory();

      const dependencyLess = dependencyLessFac({
        multiply: () => (x: number) => x * 10,
      });

      const result = dependencyLess({}).multiply(5);

      // Using Vitest's expect
      expect(result).toBe(50);

      // Using Chai's assert
      assert.strictEqual(result, 50);
    });

    it('should handle dependencies correctly', () => {
      // Create base services
      const baseServicesFac = createTypedFactory();
      const baseServices = baseServicesFac({
        multiply: () => (x: number) => x * 10,
        add: () => (x: number) => x + 5,
      });

      // Create dependent service
      const dependentServiceFac = createTypedFactory<InferInterface<typeof baseServices>>();
      const dependentService = dependentServiceFac({
        calculate:
          ({ multiply, add }) =>
          (x: number) =>
            multiply(x) + add(x),
      });

      // Implement and use
      const implementation = dependentService({
        multiply: (x: number) => x * 10,
        add: (x: number) => x + 5,
      });

      const result = implementation.calculate(3);

      // Using Vitest's expect
      expect(result).toBe(38); // (3 * 10) + (3 + 5) = 30 + 8 = 38

      // Using Chai's assert
      assert.strictEqual(result, 38);
    });

    it('should compose multiple dependency factories', () => {
      // First factory
      const firstFac = createTypedFactory();
      const first = firstFac({
        getValue: () => () => 10,
      });

      // Second factory depending on first
      const secondFac = createTypedFactory<InferInterface<typeof first>>();
      const second = secondFac({
        doubleValue:
          ({ getValue }) =>
          () =>
            getValue() * 2,
      });

      // Implementation
      const implementation = second({
        getValue: () => 10,
      });

      const result = implementation.doubleValue();

      expect(result).toBe(20);
      assert.strictEqual(result, 20);
    });
  });

  describe('Redux integration', () => {
    it('should correctly integrate with Redux store', () => {
      // Create a mock Redux store
      const mockStore = createMockStore(initialState);
      const originalDispatch = mockStore.dispatch;
      let dispatchCalled = false;
      let lastAction = null;

      // Mock the dispatch method
      mockStore.dispatch = (action => {
        dispatchCalled = true;
        lastAction = action;
        return originalDispatch(action);
      }) as typeof originalDispatch;

      // Create a store service factory
      const storeServiceFac = createTypedFactory();
      const storeService = storeServiceFac({
        // Provide the Redux store
        store: () => mockStore,
      });

      // Create a user service that depends on the store
      const userServiceFac = createTypedFactory<InferInterface<typeof storeService>>();
      const userService = userServiceFac({
        // Method to get current user from the store
        getCurrentUser:
          ({ store }) =>
          () => {
            const state = store.getState();
            return state.auth.currentUser;
          },

        // Method to update user in the store
        updateUser:
          ({ store }) =>
          (updates: Partial<User>) => {
            const state = store.getState();
            const currentUser = state.auth.currentUser;

            if (!currentUser) {
              throw new Error('No current user to update');
            }

            const updatedUser = {
              ...currentUser,
              ...updates,
            };

            store.dispatch(actionCreators.updateUserSuccess(updatedUser));
            return updatedUser;
          },
      });

      // Create an implementation with the actual store
      const implementation = userService({
        store: mockStore,
      });

      // Test getCurrentUser
      const currentUser = implementation.getCurrentUser();
      expect(currentUser).toEqual(initialState.auth.currentUser);
      assert.deepEqual(currentUser, initialState.auth.currentUser);

      // Test updateUser
      const updatedUser = implementation.updateUser({ name: 'Updated Name' });
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.id).toBe('1'); // ID should remain the same
      expect(dispatchCalled).toBe(true);
      expect(lastAction).toEqual(actionCreators.updateUserSuccess(updatedUser));
    });

    it('should compose multiple services with Redux store dependency', () => {
      // Create a mock Redux store
      const mockStore = createMockStore(initialState);

      // Create a store service factory
      const storeServiceFac = createTypedFactory();
      const storeService = storeServiceFac({
        store: () => mockStore,
      });

      // Create a fetch service factory
      const fetchServiceFac = createTypedFactory();
      const fetchService = fetchServiceFac({
        fetch: () => async (url: string) => {
          // Mock implementation that returns a user
          return { id: '3', name: 'Fetched User', email: 'fetched@example.com' };
        },
      });

      // Create a user service that depends on both store and fetch
      const userServiceFac = createTypedFactory<
        InferInterface<typeof storeService> & InferInterface<typeof fetchService>
      >();
      const userService = userServiceFac({
        // Method to fetch and store a user
        fetchAndStoreUser:
          ({ store, fetch }) =>
          async (userId: string) => {
            // Fetch the user
            const user = await fetch(`/users/${userId}`);

            // Store the user in Redux
            store.dispatch(actionCreators.fetchUserSuccess(user));

            return user;
          },
      });

      // Create an implementation
      const implementation = userService({
        store: mockStore,
        fetch: async (url: string) => ({
          id: '3',
          name: 'Fetched User',
          email: 'fetched@example.com',
        }),
      });

      // Test the fetchAndStoreUser method
      return implementation.fetchAndStoreUser('3').then(user => {
        expect(user).toEqual({ id: '3', name: 'Fetched User', email: 'fetched@example.com' });

        // Verify the store was updated
        const state = mockStore.getState();
        expect(state.users.loading).toBe(false);
      });
    });

    it('should handle multiple store-dependent services', () => {
      // Create a mock Redux store
      const mockStore = createMockStore(initialState);

      // Create a store service factory
      const storeServiceFac = createTypedFactory();
      const storeService = storeServiceFac({
        store: () => mockStore,
      });

      // Create a user service
      const userServiceFac = createTypedFactory<InferInterface<typeof storeService>>();
      const userService = userServiceFac({
        getAllUsers:
          ({ store }) =>
          () => {
            const state = store.getState();
            return state.users.allIds.map(id => state.users.byId[id]);
          },
      });

      // Create an admin service that also depends on the store
      const adminServiceFac = createTypedFactory<
        InferInterface<typeof storeService> & InferInterface<typeof userService>
      >();
      const adminService = adminServiceFac({
        // Method that uses both the store directly and the user service
        getUsersWithConfig:
          ({ store, getAllUsers }) =>
          () => {
            const state = store.getState();
            const users = getAllUsers();

            return {
              users,
              apiUrl: state.config.apiUrl,
            };
          },
      });

      // Create implementations
      const userImpl = userService({
        store: mockStore,
      });

      const adminImpl = adminService({
        store: mockStore,
        getAllUsers: userImpl.getAllUsers,
      });

      // Test the composed services
      const result = adminImpl.getUsersWithConfig();

      expect(result.users).toHaveLength(2);
      expect(result.apiUrl).toBe('https://api.example.com');
      expect(result.users[0].id).toBe('1');
      expect(result.users[1].id).toBe('2');
    });
  });
});
