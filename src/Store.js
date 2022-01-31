// Import redux components
import { configureStore } from '@reduxjs/toolkit';
// Import reducers
import tagsReducer from './Features/Tags';
import CPDataReducer from './Features/CPData';

const store = configureStore({
  reducer: {
    tags: tagsReducer,
    CPData: CPDataReducer,
  },
});

export default store;
