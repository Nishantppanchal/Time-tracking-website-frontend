// Import redux components
import { configureStore } from '@reduxjs/toolkit';
// Import reducers
import tagsReducer from './Features/Tags';
import CPDataReducer from './Features/CPData';
import logsReducer from './Features/Logs';

// Defines redux store
const store = configureStore({
  // Defines reducers
  reducer: {
    // Sets tags reducer
    tags: tagsReducer,
    // Sets CPData reducer
    CPData: CPDataReducer,
    // Sets logs reducer
    logs: logsReducer,
  },
});

// Exports redux store
export default store;
