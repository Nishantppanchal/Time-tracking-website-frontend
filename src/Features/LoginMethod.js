import { createSlice } from '@reduxjs/toolkit';

const loginMethodStates = { trackable: 'trackable', google: 'google' };

export const loginMethodSlice = createSlice({
  name: 'loginMethod',
  initialState: {
    value: localStorage.getItem('login_method') ?? loginMethodStates.trackable,
  },
  reducers: {
    setLoginMethod: (state, action) => {
      localStorage.setItem('login_method', action.payload);
      state.value = action.payload;
    },
    clearLoginMethod: (state) => {
      localStorage.removeItem('login_method');
      state.value = loginMethodStates.trackable;
    },
  },
});

export { loginMethodStates };

export const { setLoginMethod, clearLoginMethod } = loginMethodSlice.actions;

export default loginMethodSlice.reducer;
