import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types';

const initialState: Todo[] = [];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<{ id: number }>) => {
      const todo = state.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<{ id: number }>) => {
      return state.filter(todo => todo.id !== action.payload.id);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
