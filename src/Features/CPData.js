// Import redux component
import { createSlice } from '@reduxjs/toolkit';

const initialValue = [];

// Create slice using redux toolkit
export const CPDataSlice = createSlice({
  // Defines slice name
  name: 'CPData',
  // Sets initial state value
  initialState: { value: initialValue },
  // Defines reduces
  reducers: {
    // Defines reducer to load all clients and projects
    loadCPData: (state, action) => {
      // Setes state to action payload
      state.value = action.payload;
    },
    // Defines reducer to add one client or project
    addCP: (state, action) => {
      // Add the payload to the the state array
      state.value = [...state.value, action.payload];
    },
    // Defines reducer to delete one client or project
    deleteCP: (state, action) => {
      // Delete the client/project with the id and type provided by the payload
      state.value = state.value.filter((CP) => {
        // Return true if the client or project's doesn't match the id provided.
        // However if does, if it is not the type provided return true as well
        return CP.id !== action.payload.id || CP.type !== action.payload.type;
      });
    },
    // Defines reducer to update a client or project
    updateCP: (state, action) => {
      // For each client and project in state
      state.value = state.value.map((CP) => {
        // If the it is the client/project we are looking for
        if (CP.id === action.payload.id && CP.type === action.payload.type) {
          // Return an updated dictionary
          return { ...CP, name: action.payload.name };
        } else {
          // Otherwise return the original dictionary
          return CP;
        }
      });
    },
    clearCP: (state) => {
      state.value = initialValue;
    },
  },
});

// Exports actions
export const { loadCPData, addCP, deleteCP, updateCP, clearCP } =
  CPDataSlice.actions;
// Export reducer
export default CPDataSlice.reducer;
