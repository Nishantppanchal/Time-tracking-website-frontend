import { createSlice } from '@reduxjs/toolkit';

const initialValue = '';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: { value: initialValue },
  reducers: {
    setTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
