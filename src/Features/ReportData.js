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
    clearReportData: (state) => {
      state.value = initialValue;
    },
  },
});

export const { editReportData, clearReportData } = reportDataSlice.actions;

export default reportDataSlice.reducer;
