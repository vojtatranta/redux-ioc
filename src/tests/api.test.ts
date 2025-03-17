import { describe, it, expect } from 'vitest';
import { createTypedFactory } from '../ts-ioc';

describe('TypeScript IoC API', () => {
  describe('createTypedFactory', () => {
    it('should create a factory that defines services with their dependencies', () => {
      // Step 1: Define the dependencies that our services will need
      // These are factory functions that will be provided to our services
      type Dependencies = {
        logger: (deps: {}) => { log: (message: string) => void };
        database: (deps: {}) => { query: (sql: string) => Promise<any[]> };
      };

      // Step 2: Create a typed factory with our dependencies
      const serviceFactory = createTypedFactory<Dependencies>();

      // Step 3: Define our services using the factory
      // Each service receives the resolved dependencies as an argument
      const services = serviceFactory({
        // UserService depends on logger and database
        userService: deps => ({
          getUser: async (id: number) => {
            deps.logger.log(`Fetching user with id ${id}`);
            const results = await deps.database.query(`SELECT * FROM users WHERE id = ${id}`);
            return results[0];
          },
        }),

        // AuthService depends on userService and logger
        authService: deps => ({
          authenticate: async (username: string, password: string) => {
            deps.logger.log(`Authenticating user ${username}`);
            // In a real implementation, this would verify credentials
            return { authenticated: true, user: { id: 1, username } };
          },
        }),
      });

      // Step 4: Provide the actual implementations of dependencies
      const dependencies = {
        logger: { log: (message: string) => console.log(message) },
        database: { query: async (sql: string) => [{ id: 1, name: 'Test User' }] },
      };

      // Step 5: Create instances of our services with the implemented dependencies
      const serviceImplementations = services(dependencies);

      // Verify the structure of our service implementations
      expect(serviceImplementations).toHaveProperty('userService');
      expect(serviceImplementations).toHaveProperty('authService');
      expect(serviceImplementations.userService).toHaveProperty('getUser');
      expect(serviceImplementations.authService).toHaveProperty('authenticate');

      // Verify that the service factory has the type definitions attached
      expect(services).toHaveProperty('_TYPED_METHOD_DEFINITIONS');
    });

    it('should provide type safety for dependencies and service implementations', () => {
      // This test demonstrates the type safety of the API
      // TypeScript would catch errors if we tried to:
      // 1. Use a dependency that wasn't defined
      // 2. Define a service that doesn't match its interface
      // 3. Provide dependencies that don't match their interfaces

      // Define dependencies with specific types
      type MathDependencies = {
        adder: (deps: {}) => { add: (a: number, b: number) => number };
        multiplier: (deps: {}) => { multiply: (a: number, b: number) => number };
      };

      // Create a factory with typed dependencies
      const mathServiceFactory = createTypedFactory<MathDependencies>();

      // Define services with their implementations
      const mathServices = mathServiceFactory({
        calculatorService: deps => ({
          calculate: (a: number, b: number, operation: 'add' | 'multiply') => {
            if (operation === 'add') {
              return deps.adder.add(a, b);
            } else {
              return deps.multiplier.multiply(a, b);
            }
          },
        }),
      });

      // Provide implementations for dependencies
      const mathDependencies = {
        adder: { add: (a: number, b: number) => a + b },
        multiplier: { multiply: (a: number, b: number) => a * b },
      };

      // Create concrete implementations of services with the provided dependencies
      const mathServiceImplementations = mathServices(mathDependencies);

      // Test the implementation
      expect(mathServiceImplementations.calculatorService.calculate(2, 3, 'add')).toBe(5);
      expect(mathServiceImplementations.calculatorService.calculate(2, 3, 'multiply')).toBe(6);
    });
  });

  describe('Order of Operations', () => {
    it('should follow a specific order: 1) create factory, 2) define services, 3) provide dependencies', () => {
      // This test demonstrates the correct order of operations when using the IoC container

      // STEP 1: Create the typed factory with dependency types
      // This is where you define what dependencies your services will need
      type LoggerDependency = {
        logger: (deps: {}) => { info: (message: string) => void; error: (message: string) => void };
      };

      const factory = createTypedFactory<LoggerDependency>();

      // STEP 2: Define your services using the factory
      // At this point, you're defining the structure of your services and how they use dependencies
      // But you're NOT yet providing actual implementations of those dependencies
      const notificationServiceFactory = factory({
        emailNotifier: deps => ({
          sendEmail: (to: string, subject: string, body: string) => {
            deps.logger.info(`Sending email to ${to} with subject: ${subject}`);
            // Email sending logic would go here
            return true;
          },
        }),

        smsNotifier: deps => ({
          sendSms: (phoneNumber: string, message: string) => {
            deps.logger.info(`Sending SMS to ${phoneNumber}`);
            // SMS sending logic would go here
            return true;
          },
        }),
      });

      // STEP 3: Only NOW do you provide the actual implementations of dependencies
      // This is the final step where you inject concrete implementations
      const dependencyImplementations = {
        logger: {
          info: (message: string) => {
            /* actual logging implementation */
          },
          error: (message: string) => {
            /* actual error logging implementation */
          },
        },
      };

      // Create the final service implementations with dependencies injected
      const notifiers = notificationServiceFactory(dependencyImplementations);

      // Verify the structure
      expect(notifiers).toHaveProperty('emailNotifier');
      expect(notifiers).toHaveProperty('smsNotifier');
      expect(notifiers.emailNotifier).toHaveProperty('sendEmail');
      expect(notifiers.smsNotifier).toHaveProperty('sendSms');
    });

    it('should allow for different dependency implementations without changing service definitions', () => {
      // This test demonstrates how the separation of concerns allows for different
      // implementations of dependencies without changing service definitions

      // STEP 1: Create the typed factory
      type StorageDependency = {
        storage: (deps: {}) => {
          save: (key: string, data: any) => void;
          get: (key: string) => any;
        };
      };

      const factory = createTypedFactory<StorageDependency>();

      // STEP 2: Define the service factory once
      const userPreferencesServiceFactory = factory({
        preferences: deps => ({
          savePreference: (userId: string, key: string, value: any) => {
            const storageKey = `user:${userId}:pref:${key}`;
            deps.storage.save(storageKey, value);
            return true;
          },
          getPreference: (userId: string, key: string) => {
            const storageKey = `user:${userId}:pref:${key}`;
            return deps.storage.get(storageKey);
          },
        }),
      });

      // STEP 3A: Provide a memory-based implementation of dependencies
      const memoryStore: Record<string, any> = {};
      const memoryImplementation = {
        storage: {
          save: (key: string, data: any) => {
            memoryStore[key] = data;
          },
          get: (key: string) => memoryStore[key],
        },
      };

      // Create service implementation with memory storage
      const memoryBasedPreferences = userPreferencesServiceFactory(memoryImplementation);

      // STEP 3B: Provide a localStorage-based implementation (for browser environments)
      const mockLocalStorage: Record<string, any> = {};
      const localStorageImplementation = {
        storage: {
          save: (key: string, data: any) => {
            mockLocalStorage[key] = JSON.stringify(data);
          },
          get: (key: string) => {
            const value = mockLocalStorage[key];
            return value ? JSON.parse(value) : null;
          },
        },
      };

      // Create service implementation with localStorage
      const localStorageBasedPreferences = userPreferencesServiceFactory(
        localStorageImplementation
      );

      // Test both implementations with the same service definition
      memoryBasedPreferences.preferences.savePreference('user1', 'theme', 'dark');
      expect(memoryStore['user:user1:pref:theme']).toBe('dark');

      localStorageBasedPreferences.preferences.savePreference('user1', 'theme', 'light');
      expect(JSON.parse(mockLocalStorage['user:user1:pref:theme'])).toBe('light');
    });
  });
});
