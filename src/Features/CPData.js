// Import redux component
import { createSlice } from '@reduxjs/toolkit';

// Create slice using redux toolkit
export const CPDataSlice = createSlice({
    // Defines slice name
    name: 'CPData',
    // Sets inital state value
    initialState: { value: [] },
    // Defines reduces
    reducers: {
        // Defines reducer to load all logs
        loadCPData: (state, action) => {
            // Setes state to action payload
            state.value = action.payload;
        },
        // Defines reducer to add one log
        addCP: (state, action) => {
            // Add the payload to the the state array
            state.value = [...state.value, action.payload];
        },
    }
});

// Exports actions
export const { loadCPData, addCP } = CPDataSlice.actions;
// Export reducer
export default CPDataSlice.reducer;