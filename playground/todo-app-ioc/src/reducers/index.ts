import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from './todos';
import visibilityFilterReducer from './visibilityFilter';
import { TodoState } from '../types';

// Use combineReducers from Redux Toolkit
const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
