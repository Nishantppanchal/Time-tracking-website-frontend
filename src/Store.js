// Import redux components
import { configureStore } from '@reduxjs/toolkit';
// Import reducers
import tagsReducer from './Features/Tags';
import CPDataReducer from './Features/CPData';
import logsReducer from './Features/Logs';
import themeReducer from './Features/Theme';
import modeReducer from './Features/Mode';
import reportData from './Features/ReportData';

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
    // Sets theme reducer
    theme: themeReducer,
    // Set mode reducer
    mode: modeReducer,
    // Set report data reducer
    reportData: reportData,
  },
});

// Exports redux store
export default store;
