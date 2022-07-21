// Import redux component
import { createSlice } from '@reduxjs/toolkit';

const initialValue = [];

// Create slice using redux toolkit
export const tagsSlice = createSlice({
  // Defines slice name
  name: 'tags',
  // Sets inital state value
  initialState: { value: initialValue },
  // Defines reduces
  reducers: {
    // Defines reducer to load all tags
    loadTags: (state, action) => {
      // Setes state to action payload
      state.value = action.payload;
    },
    // Defines reducer to add tags
    addTag: (state, action) => {
      // Add the payload to the the state array
      // Spreader is used for the action.payload as it would a array of new tags
      state.value = [...state.value, ...action.payload];
    },
    clearTags: (state) => {
      state.value = initialValue;
    },
  },
});

// Exports actions
export const { loadTags, addTag, clearTags } = tagsSlice.actions;
// Export reducer
export default tagsSlice.reducer;
