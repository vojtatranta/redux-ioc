import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit includes thunk middleware by default
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
