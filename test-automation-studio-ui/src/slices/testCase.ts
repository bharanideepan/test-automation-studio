import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestCaseService from "../services/testCaseService";
import {
  TestCase,
} from "../declarations/interface";

export const getTestCaseById: any = createAsyncThunk(
  "testCase/getTestCaseById",
  async (id: string) => {
    return TestCaseService.getTestCaseById(id);
  }
);
export const getTestCaseHistoryById: any = createAsyncThunk(
  "testCase/getTestCaseById",
  async (id: string) => {
    return TestCaseService.getTestCaseHistoryById(id);
  }
);
const DEFAULT: {
  testCase?: TestCase;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testCase",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
    addTestCaseRun(state, action) {
      state.testCase?.testCaseRuns?.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTestCaseById.fulfilled, (state, action) => {
      state.testCase = action.payload;
    })
    builder.addCase(getTestCaseById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testCase details",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
