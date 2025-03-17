import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityFilter } from '../types';

const initialState = VisibilityFilter.SHOW_ALL;

const visibilityFilterSlice = createSlice({
  name: 'visibilityFilter',
  initialState,
  reducers: {
    setVisibilityFilter: (state, action: PayloadAction<{ filter: VisibilityFilter }>) => {
      // With Redux Toolkit, we can either mutate the state or return a new value
      // Here we're returning a new value
      return action.payload.filter;
    },
  },
});

export const { setVisibilityFilter } = visibilityFilterSlice.actions;
export default visibilityFilterSlice.reducer;
