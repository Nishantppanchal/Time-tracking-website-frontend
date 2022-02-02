// Import redux component
import { createSlice } from '@reduxjs/toolkit';

// Create slice using redux toolkit
export const tagsSlice = createSlice({
    // Defines slice name
    name: 'tags',
    // Sets inital state value
    initialState: { value: [] },
    // Defines reduces
    reducers: {
        // Defines reducer to load all logs
        loadTags: (state, action) => {
            // Setes state to action payload
            state.value = action.payload;
        },
        // Defines reducer to add one log
        addTag: (state, action) => {
            // Add the payload to the the state array
            state.value = [...state.value, ...action.payload];
        },
    }
});

// Exports actions
export const { loadTags, addTag } = tagsSlice.actions;
// Export reducer
export default tagsSlice.reducer;