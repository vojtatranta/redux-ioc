import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { StoreService, TodoState } from '../types';

// Create the Redux store with Redux Toolkit
const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
