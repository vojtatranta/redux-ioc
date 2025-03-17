import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from './todos';
import visibilityFilterReducer from './visibilityFilter';

const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
