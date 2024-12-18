import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestSuiteRunService from "../services/testSuiteRunService";
import { TestSuiteRun } from "../declarations/interface";

export const getTestSuiteRunById: any = createAsyncThunk(
  "testSuiteRun/getTestSuiteRunById",
  async (id: string) => {
    return TestSuiteRunService.getTestSuiteRunById(id);
  }
);
export const executeRun: any = createAsyncThunk(
  "testSuiteRun/executeRun",
  async (id: string) => {
    return TestSuiteRunService.executeRun(id);
  }
)
const DEFAULT: {
  testSuiteRun?: TestSuiteRun;
  addedTestSuiteRun?: TestSuiteRun;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "TestSuiteRun",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTestSuiteRunById.fulfilled, (state, action) => {
      state.testSuiteRun = action.payload;
    })
    builder.addCase(getTestSuiteRunById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching TestSuite run details",
      };
    })
    builder.addCase(executeRun.fulfilled, (state, action) => {
      state.addedTestSuiteRun = action.payload;
      state.status = {
        type: "SUCCESS",
        message: "Run executed successfully",
      };
    })
    builder.addCase(executeRun.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while executing test case run",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
