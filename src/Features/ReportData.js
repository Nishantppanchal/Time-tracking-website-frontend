import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
  oldTheme: {},
  report: {
    CPTimes: [],
    logs: [],
    tagTimes: [],
    totalTime: null,
  },
  timeProgress: [],
  billableArray: [],
  CPPieColours: [],
  reportGenerated: false,
};

export const reportDataSlice = createSlice({
  name: 'reportData',
  initialState: {
    value: initialValue,
  },
  reducers: {
    editReportData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { editReportData } = reportDataSlice.actions;
export { initialValue };

export default reportDataSlice.reducer;
