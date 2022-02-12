// Import redux component
import { createSlice } from '@reduxjs/toolkit';

// Create slice using redux toolkit
export const logsSlice = createSlice({
  // Defines slice name
  name: 'logs',
  // Sets inital state value
  initialState: {
    value: {
      // Stores logs
      logs: [],
      // Store whether all the logs have loaded
      allLogsLoaded: false,
      // Stores the number of logs that have been loaded in
      loadedLogsNumber: 0,
    },
  },
  // Defines reduces
  reducers: {
    // Defines reducer to add logs
    addLog: (state, action) => {
      // Add the payload to the the logs key in state
      // Spreader is used for the action.payload as a array is passed through
      state.value = {
        ...state.value,
        logs: [...state.value.logs, ...action.payload],
      };
    },
    // Defines reducer to delete log
    deleteLog: (state, action) => {
      // Delete the log with the id provided by the payload
      state.value = {
        ...state.value,
        logs: state.value.logs.filter((log) => {
          return log.id !== action.payload;
        }),
      };
    },
    // Defines reducer to set allLogsLoaded
    setAllLogsLoaded: (state, action) => {
      // Sets allLogsLoaded value to action.payload
      state.value = {
        ...state.value,
        allLogsLoaded: action.payload,
      };
    },
    // Defines reducer to change the number of logs loaded
    addToLoadedLogsNumber: (state, action) => {
      // Sets loadedLogsNumber to the number provided in the action.payload
      state.value = {
        ...state.value,
        loadedLogsNumber: state.value.loadedLogsNumber + action.payload,
      };
    },
  },
});

// Exports actions
export const { addLog, setAllLogsLoaded, addToLoadedLogsNumber, deleteLog } =
  logsSlice.actions;
// Export reducer
export default logsSlice.reducer;
