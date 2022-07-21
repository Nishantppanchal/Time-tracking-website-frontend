import { createSlice } from '@reduxjs/toolkit';

export const modeSlice = createSlice({
  name: 'theme',
  initialState: { value: localStorage.getItem('mode') ?? 'light' },
  reducers: {
    toggleMode: (state) => {
      const newMode = state.value === 'light' ? 'dark' : 'light';
      localStorage.setItem('mode', newMode);
      state.value = newMode;
    },
    toggleToWhite: (state) => {
      state.value = 'light';
    },
    restoreMode: (state) => {
      state.value = localStorage.getItem('mode') ?? 'light';
    },
    clearMode: (state) => {
      localStorage.removeItem('mode');
      state.value = 'light';
    },
  },
});

export const { toggleMode, toggleToWhite, restoreMode, clearMode } =
  modeSlice.actions;

export default modeSlice.reducer;
