import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityFilter } from '../types';

const initialState = VisibilityFilter.SHOW_ALL;

const visibilityFilterSlice = createSlice({
  name: 'visibilityFilter',
  initialState,
  reducers: {
    setVisibilityFilter: (_state, action: PayloadAction<{ filter: VisibilityFilter }>) => {
      return action.payload.filter;
    },
  },
});

export const { setVisibilityFilter } = visibilityFilterSlice.actions;
export default visibilityFilterSlice.reducer;
