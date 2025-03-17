// Mock Redux store for testing
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  auth: {
    token: string | null;
    currentUser: User | null;
  };
  users: {
    byId: Record<string, User>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  config: {
    apiUrl: string;
  };
}

// Initial state for tests
export const initialState: AppState = {
  auth: {
    token: 'mock-token-123',
    currentUser: { id: '1', name: 'Test User', email: 'test@example.com' },
  },
  users: {
    byId: {
      '1': { id: '1', name: 'Test User', email: 'test@example.com' },
      '2': { id: '2', name: 'Another User', email: 'another@example.com' },
    },
    allIds: ['1', '2'],
    loading: false,
    error: null,
  },
  config: {
    apiUrl: 'https://api.example.com',
  },
};

// Action types
export const ActionTypes = {
  FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',
};

// Action creators
export const actionCreators = {
  fetchUserRequest: (userId: string): Action => ({
    type: ActionTypes.FETCH_USER_REQUEST,
    payload: userId,
  }),
  fetchUserSuccess: (user: User): Action<User> => ({
    type: ActionTypes.FETCH_USER_SUCCESS,
    payload: user,
  }),
  fetchUserFailure: (error: string): Action<string> => ({
    type: ActionTypes.FETCH_USER_FAILURE,
    payload: error,
  }),
  updateUserRequest: (user: Partial<User> & { id: string }): Action<Partial<User> & { id: string }> => ({
    type: ActionTypes.UPDATE_USER_REQUEST,
    payload: user,
  }),
  updateUserSuccess: (user: User): Action<User> => ({
    type: ActionTypes.UPDATE_USER_SUCCESS,
    payload: user,
  }),
  updateUserFailure: (error: string): Action<string> => ({
    type: ActionTypes.UPDATE_USER_FAILURE,
    payload: error,
  }),
};

// Mock Redux store interface
export interface ReduxStore {
  getState(): AppState;
  dispatch(action: Action): void;
  subscribe(listener: () => void): () => void;
}

// Mock store creator
export const createMockStore = (initialState: AppState): ReduxStore => {
  let state = { ...initialState };
  const listeners: Array<() => void> = [];

  return {
    getState: () => state,
    dispatch: (action: Action) => {
      // In a real Redux store, reducers would handle this
      // For our mock, we'll just simulate some basic state updates
      if (action.type === ActionTypes.FETCH_USER_SUCCESS && action.payload) {
        const user = action.payload as User;
        state = {
          ...state,
          users: {
            ...state.users,
            byId: {
              ...state.users.byId,
              [user.id]: user,
            },
            loading: false,
            error: null,
          },
        };
      } else if (action.type === ActionTypes.FETCH_USER_REQUEST) {
        state = {
          ...state,
          users: {
            ...state.users,
            loading: true,
            error: null,
          },
        };
      } else if (action.type === ActionTypes.FETCH_USER_FAILURE) {
        state = {
          ...state,
          users: {
            ...state.users,
            loading: false,
            error: action.payload as string,
          },
        };
      }

      // Notify listeners
      listeners.forEach(listener => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
  };
};
