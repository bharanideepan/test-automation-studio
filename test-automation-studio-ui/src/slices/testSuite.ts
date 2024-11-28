import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestSuiteService from "../services/testSuiteService";
import {
  TestSuite,
} from "../declarations/interface";

export const getTestSuiteById: any = createAsyncThunk(
  "testSuite/getTestSuiteById",
  async (id: string) => {
    return TestSuiteService.getTestSuiteById(id);
  }
);
export const getTestSuiteHistoryById: any = createAsyncThunk(
  "testSuite/getTestSuiteById",
  async (id: string) => {
    return TestSuiteService.getTestSuiteHistoryById(id);
  }
);
const DEFAULT: {
  testSuite?: TestSuite;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testSuite",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
    addTestSuiteRun(state, action) {
      state.testSuite?.testSuiteRuns?.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTestSuiteById.fulfilled, (state, action) => {
      state.testSuite = action.payload;
    })
    builder.addCase(getTestSuiteById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testSuite details",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
